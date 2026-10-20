(() => {
  'use strict';
  const unit = document.body.dataset.unit;
  const base = location.pathname.includes('/units/') ? '../' : '';
  const key = 'course1266.learning.v2';
  let state = {done:{},last:null,draft:null};
  let storageAvailable = true;
  try {const saved = JSON.parse(localStorage.getItem(key) || 'null'); if(saved && typeof saved==='object')state={...state,...saved,done:saved.done||{}};} catch {storageAvailable=false;}
  function persist() {
    try {localStorage.setItem(key,JSON.stringify(state));}
    catch {storageAvailable=false; const notice=document.querySelector('[data-save-status]'); if(notice)notice.textContent='تعذر حفظ التقدم على هذا الجهاز. يمكنك متابعة الدروس وتنزيل الكود دون حفظ تلقائي.';}
  }
  if (!document.querySelector('.site-header')) {
    const header=document.createElement('header');header.className='site-header';
    header.innerHTML=`<div class="site-bar"><a class="brand" href="${base}index.html">تقنية تصميم صفحات الويب 1266</a><span>أ. أحمد عوني النتشة</span></div><nav class="course-nav" aria-label="التنقل الرئيسي"><a href="${base}index.html">الرئيسية</a>${['الإنترنت','HTML وCSS','JavaScript','الويب الديناميكي','PHP وSQL'].map((title,i)=>`<a href="${base}units/unit${i+1}.html">${i+1}. ${title}</a>`).join('')}<a href="${base}lab.html">المختبر</a><a href="${base}practical.html">المشاريع</a></nav>`;
    document.body.prepend(header);
  }
  document.querySelectorAll('.course-nav a').forEach(link=>{
    const normalizePath=path=>path.replace(/index\.html$/, '');
    if(normalizePath(new URL(link.href).pathname)===normalizePath(location.pathname))link.setAttribute('aria-current','page');
  });
  document.querySelectorAll('[data-copy-target]').forEach(button=>button.addEventListener('click',async()=>{
    const pre=document.getElementById(button.dataset.copyTarget);if(!pre)return;
    try{await navigator.clipboard.writeText(pre.textContent);button.textContent='تم النسخ';setTimeout(()=>button.textContent='نسخ الكود',1800);}
    catch{button.textContent='حدد الكود وانسخه يدوياً';}
  }));
  const steps=[...document.querySelectorAll('[data-step]')];
  function renderProgress(){
    if(!unit)return;
    const done=Array.isArray(state.done[unit])?state.done[unit]:[];
    document.querySelectorAll('[data-complete]').forEach(button=>{
      const checked=done.includes(button.dataset.complete);button.setAttribute('aria-pressed',String(checked));button.textContent=checked?'✓ مكتمل — إلغاء التحديد':'حدّد الدرس كمكتمل';
    });
    document.querySelectorAll('[data-done]').forEach(label=>label.textContent=done.includes(label.dataset.done)?'✓':'');
    const progress=document.querySelector('#unit-progress');if(progress)progress.value=steps.filter(step=>done.includes(step.id)).length;
    const label=document.querySelector('[data-progress-text]');if(label)label.textContent=`${progress.value} من ${steps.length} دروس حددتها كمكتملة`;
  }
  function showLesson(focus=false){
    if(!steps.length)return;
    let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{}
    const active=target?.closest('[data-step]')||(location.hash==='#content'?steps.find(step=>!step.hidden):null)||steps[0];
    steps.forEach(step=>step.hidden=step!==active);
    document.querySelectorAll('[data-lesson-link]').forEach(link=>{if(link.dataset.lessonLink===active.id)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
    if(unit){state.last={unit:Number(unit),anchor:active.id,title:active.querySelector('h2')?.textContent||document.title};persist();}
    if(focus){const heading=active.querySelector('h2');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});active.scrollIntoView({block:'start',behavior:'instant'});}
    // Pause the animation when its lesson is no longer visible.
    if(active.id!=='animation'&&typeof window.stopBallMotion==='function')window.stopBallMotion();
  }
  document.querySelectorAll('[data-complete]').forEach(button=>button.addEventListener('click',()=>{
    const done=Array.isArray(state.done[unit])?state.done[unit]:[];const id=button.dataset.complete;
    state.done[unit]=done.includes(id)?done.filter(value=>value!==id):[...done,id];persist();renderProgress();
  }));
  if(steps.length){showLesson();renderProgress();window.addEventListener('hashchange',()=>showLesson(true));}
  const toc=document.querySelector('[data-toc]');if(toc){const media=matchMedia('(max-width:850px)');const sync=()=>toc.open=!media.matches;sync();media.addEventListener('change',sync);}
  const resume=document.querySelector('[data-resume]');
  if(resume&&state.last&&Number.isInteger(state.last.unit)&&state.last.unit>=1&&state.last.unit<=5){
    resume.hidden=false;const p=document.createElement('p');p.textContent=`آخر درس فتحته: ${state.last.title}`;
    const a=document.createElement('a');a.className='button';a.href=`units/unit${state.last.unit}.html#${encodeURIComponent(state.last.anchor)}`;a.textContent='تابع من حيث توقفت ←';resume.append(p,a);
  }
  const normalize=text=>text.toLowerCase().normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي');
  const search=document.querySelector('#lesson-search');
  if(search){
    let index;let version=0;
    search.addEventListener('input',async()=>{
      const current=++version;const query=normalize(search.value.trim());const list=document.querySelector('[data-search-results]');const status=document.querySelector('[data-search-status]');list.replaceChildren();
      if(!query){status.textContent='اكتب موضوعاً لعرض الدروس المرتبطة به.';return;}
      status.textContent='جارٍ البحث…';
      try{if(!index){const response=await fetch(`${base}assets/js/search-index.json`);if(!response.ok)throw Error();index=await response.json();}if(current!==version)return;
        const words=query.split(/\s+/);const results=index.filter(item=>words.every(word=>normalize(item.title+' '+item.text).includes(word))).sort((a,b)=>Number(normalize(b.title).includes(query))-Number(normalize(a.title).includes(query)));
        status.textContent=results.length?`عدد الدروس المطابقة: ${results.length}${results.length>12?'، نعرض أول 12 نتيجة.':'.'}`:'لا توجد نتائج. جرّب كلمة أخرى مثل النماذج أو الحلقات.';
        for(const item of results.slice(0,12)){const li=document.createElement('li'),a=document.createElement('a'),small=document.createElement('small');a.href=item.url;a.textContent=item.title;small.textContent=`الوحدة ${item.unit}`;li.append(a,small);list.append(li);}
      }catch{if(current===version)status.textContent='تعذر تحميل البحث. افتح الوحدات من مسار الدراسة أدناه، أو أعد المحاولة.';}
    });
  }
  document.querySelectorAll('.quiz').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();const groups=[...form.querySelectorAll('fieldset')];if(!groups.length)return;let score=0;
    groups.forEach(group=>{
      const chosen=group.querySelector('input:checked');const correct=chosen?.value==='correct';if(correct)score++;
      group.dataset.result=correct?'correct':'wrong';let feedback=group.querySelector('.question-feedback');
      if(!feedback){feedback=document.createElement('p');feedback.className='question-feedback';const explanation=group.nextElementSibling?.matches('details')?group.nextElementSibling.querySelector('p')?.textContent:'';const answer=group.querySelector('input[value=correct]')?.closest('label')?.textContent?.trim();feedback.dataset.explanation=explanation||`الإجابة المناسبة: ${answer||'راجع الشرح'}.`;group.append(feedback);}
      if(!feedback.dataset.explanation)feedback.dataset.explanation=feedback.textContent;
      feedback.hidden=false;feedback.textContent=(correct?'✓ إجابة صحيحة. ':'راجع إجابتك. ')+feedback.dataset.explanation;
    });
    const out=form.querySelector('output');if(out)out.textContent=`نتيجتك: ${score} من ${groups.length}. `+(score===groups.length?'أحسنت. انتقل إلى التطبيق.':'اقرأ تفسير كل إجابة، ثم أعد المحاولة.');
  }));
  document.querySelector('[data-url-form]')?.addEventListener('submit',event=>{
    event.preventDefault();const output=document.querySelector('[data-url-result]');
    try{const url=new URL(document.querySelector('#url-input').value);if(!['http:','https:'].includes(url.protocol))throw Error();output.textContent=`البروتوكول: ${url.protocol}\nاسم المضيف: ${url.hostname}\nالمسار: ${url.pathname}\nالاستعلام: ${url.search||'لا يوجد'}\nالجزء: ${url.hash||'لا يوجد'}`;}catch{output.textContent='أدخل عنواناً كاملاً يبدأ بـ https:// أو http://';}
  });
  const lab=document.querySelector('[data-lab]');
  if(lab){
    const editor=lab.querySelector('#lab-code'),frame=lab.querySelector('iframe'),status=lab.querySelector('[data-lab-status]'),consoleOutput=lab.querySelector('[data-console]'),input=lab.querySelector('#prompt-values');
    const original=editor.value;let initial=original,exampleKey=null;const bridge=Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-');
    function kind(){return lab.querySelector('#lab-kind').value;}
    function run(){
      consoleOutput.textContent='';const values=input.value.split('\n');
      const bootstrap=`(()=>{const token=${JSON.stringify(bridge)},values=${JSON.stringify(values).replace(/</g,'\\u003c')};let i=0;const send=(type,message)=>parent.postMessage({token,type,message},'*');const stringify=x=>{try{return typeof x==='string'?x:JSON.stringify(x)}catch{return String(x)}};window.alert=message=>send('output',String(message));window.prompt=(question,defaultValue='')=>{const answer=values[i++];send('output',String(question)+' → '+(answer===undefined?'لم تدخل قيمة':answer));return answer===undefined?null:answer};console.log=(...args)=>send('output',args.map(stringify).join(' '));console.error=(...args)=>send('error',args.map(stringify).join(' '));window.addEventListener('error',event=>send('error',event.message));window.addEventListener('unhandledrejection',event=>send('error',String(event.reason)));})();`;
      const boot='<script>'+bootstrap+'<\/script>';
      let html=editor.value;
      if(kind()==='js')html='<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><body><p>تظهر رسائل البرنامج أسفل المعاينة.</p>'+boot+'<script>'+editor.value+'<\/script></body></html>';
      else if(/<head\b[^>]*>/i.test(html))html=html.replace(/<head\b[^>]*>/i,match=>match+'<meta charset="utf-8">'+boot);
      else html='<!doctype html><meta charset="utf-8">'+boot+html.replace(/<!doctype[^>]*>/i,'');
      frame.srcdoc=html;status.textContent='تم تشغيل الكود. راقب المعاينة ورسائل البرنامج.';
      state.draft={code:editor.value,kind:kind(),input:input.value,example:exampleKey};persist();
    }
    window.addEventListener('message',event=>{
      if(event.source!==frame.contentWindow||event.data?.token!==bridge||!['output','error'].includes(event.data.type))return;
      consoleOutput.textContent+=(event.data.type==='error'?'خطأ: ':'')+String(event.data.message)+'\n';
    });
    lab.querySelector('[data-run]').addEventListener('click',run);
    lab.querySelector('[data-stop]').addEventListener('click',()=>{frame.srcdoc='';status.textContent='أوقفت المعاينة.';});
    lab.querySelector('[data-reset]').addEventListener('click',()=>{editor.value=initial;consoleOutput.textContent='';frame.srcdoc='';status.textContent='تمت استعادة المثال. اضغط تشغيل لعرض النتيجة.';});
    lab.querySelector('[data-download]').addEventListener('click',()=>{const blob=new Blob([editor.value],{type:kind()==='js'?'text/javascript;charset=utf-8':'text/html;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=kind()==='js'?'my-example.js':'my-example.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    let saving;function saveDraft(){clearTimeout(saving);saving=setTimeout(()=>{state.draft={code:editor.value,kind:kind(),input:input.value,example:exampleKey};persist();status.textContent=storageAvailable?'حُفظت مسودتك على هذا الجهاز.':'تعذر الحفظ التلقائي. نزّل الكود للاحتفاظ به.';},500);}
    editor.addEventListener('input',saveDraft);input.addEventListener('input',saveDraft);lab.querySelector('#lab-kind').addEventListener('change',saveDraft);
    const params=new URLSearchParams(location.search);const id=params.get('example');
    if(id){
      lab.querySelector('[data-run]').disabled=true;status.textContent='جارٍ تحميل المثال…';fetch(`${base}assets/js/examples.json`).then(response=>{if(!response.ok)throw Error();return response.json();}).then(examples=>{
        const item=examples[id];if(!item)throw Error();initial=item.code;const sameDraft=state.draft?.example===id&&typeof state.draft.code==='string';editor.value=sameDraft?state.draft.code:initial;exampleKey=id;lab.querySelector('#lab-kind').value=sameDraft&&['html','js'].includes(state.draft.kind)?state.draft.kind:item.kind;if(sameDraft)input.value=state.draft.input||'';
        lab.querySelector('[data-example-title]').textContent=`الوحدة ${item.unit} · ${item.title}`;const back=lab.querySelector('[data-source-link]');back.href=item.source;back.hidden=false;lab.querySelector('[data-run]').disabled=false;status.textContent=sameDraft?'استعدنا مسودتك لهذا المثال. زر الاستعادة يعيد الكود الأصلي.':'المثال جاهز. عدّل قيم الإدخال إذا كان يستخدم prompt، ثم اضغط تشغيل.';
      }).catch(()=>{lab.querySelector('[data-run]').disabled=false;status.textContent='تعذر تحميل المثال. ارجع إلى الدرس وانسخ الكود، أو ابدأ تجربة جديدة.';});
    }else if(state.draft&&typeof state.draft.code==='string'){
      editor.value=state.draft.code;lab.querySelector('#lab-kind').value=state.draft.kind==='js'?'js':'html';input.value=state.draft.input||'';status.textContent='استعدنا آخر مسودة محفوظة على هذا الجهاز. زر الاستعادة يعيد المثال الابتدائي.';
    }else status.textContent='عدّل المثال ثم اضغط تشغيل.';
  }
})();

// Preserve source text for copying while making runnable examples the primary action.
window.Prism = window.Prism || {manual:true};
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('pre[id]').forEach(pre=>{
    const source=pre.textContent;
    let language='javascript';
    if(/^\s*<\?php/i.test(source))language='php';
    else if(/^\s*(?:CREATE|SELECT|INSERT|UPDATE|DELETE|DROP|USE|GRANT)\b/i.test(source))language='sql';
    else if(/^\s*</.test(source))language='markup';
    else if(/^\s*(?:[.#][\w-]+|body|html|p|h1|\*)\s*\{/.test(source))language='css';
    else if(/^\s*(?:http|nslookup|php\s)/.test(source))language='none';
    const toolbar=pre.previousElementSibling?.matches('.code-toolbar')?pre.previousElementSibling:null;
    if(toolbar){
      const run=toolbar.querySelector('a');const copy=toolbar.querySelector('button');
      if(run){run.className='button';toolbar.prepend(run);}
      if(copy)copy.classList.add('secondary');
      const label=document.createElement('span');label.className='code-language';label.textContent=({markup:'HTML',javascript:'JavaScript',php:'PHP',sql:'SQL',css:'CSS',none:'Text'})[language];toolbar.append(label);
    }
    const code=document.createElement('code');code.textContent=source;code.className='language-'+language;pre.replaceChildren(code);
    if(window.Prism?.languages?.[language])window.Prism.highlightElement(code);
  });
});
