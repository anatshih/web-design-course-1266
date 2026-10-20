(() => {
  const unit = /unit([1-5])\.html$/.exec(location.pathname)?.[1];
  const base = location.pathname.includes('/units/') ? '../' : '';
  const nav = document.createElement('nav'); nav.className = 'course-nav'; nav.setAttribute('aria-label','التنقل بين وحدات المقرر');
  nav.innerHTML = `<a href="${base}index.html">الرئيسية</a>` + ['الإنترنت والويب','HTML و CSS','أساسيات JavaScript','الويب الديناميكي','PHP و SQL'].map((name,i)=>`<a href="${base}units/unit${i+1}.html" ${unit==i+1?'aria-current="page"':''}>${i+1}. ${name}</a>`).join('') + `<a href="${base}practical.html">المشروع العملي</a>`;
  document.body.prepend(nav);
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText(button.nextElementSibling.textContent); button.textContent='تم النسخ';} catch {button.textContent='حدد الكود وانسخه يدوياً';}
  }));
  document.querySelectorAll('[data-run]').forEach(button => button.addEventListener('click',()=>{
    const lab=button.closest('[data-lab]'); lab.querySelector('iframe').srcdoc=lab.querySelector('textarea').value;
  }));
  document.querySelectorAll('[data-reset]').forEach(button=>button.addEventListener('click',()=>{const lab=button.closest('[data-lab]');const area=lab.querySelector('textarea');area.value=area.defaultValue;lab.querySelector('iframe').srcdoc=area.value;}));
  document.querySelectorAll('[data-lab]').forEach(lab=>lab.querySelector('iframe').srcdoc=lab.querySelector('textarea').value);
  document.querySelectorAll('.quiz').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault(); let score=0; const groups=form.querySelectorAll('fieldset');
    groups.forEach(group=>{const chosen=group.querySelector('input:checked'); if(chosen?.value==='correct')score++;});
    form.querySelector('output').textContent=`نتيجتك: ${score} من ${groups.length}. `+(score===groups.length?'أحسنت، انتقل إلى التطبيق.':'راجع الشرح والحلول ثم أعد المحاولة.');
  }));
  document.querySelector('[data-url-form]')?.addEventListener('submit',event=>{
    event.preventDefault(); const output=document.querySelector('[data-url-result]');
    try{const url=new URL(document.querySelector('#url-input').value); if(!['http:','https:'].includes(url.protocol))throw Error(); output.textContent=`البروتوكول: ${url.protocol}\nاسم المضيف: ${url.hostname}\nالمسار: ${url.pathname}\nالاستعلام: ${url.search || 'لا يوجد'}\nالجزء: ${url.hash || 'لا يوجد'}`;}catch{output.textContent='أدخل عنواناً كاملاً يبدأ بـ https:// أو http://';}
  });
})();
