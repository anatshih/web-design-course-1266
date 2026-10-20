
    /* ---- أدوات عامة ---- */
    function setText(id, text){
      document.getElementById(id).textContent = text;
    }

    function toggleSolution(id){
      let el = document.getElementById(id);
      el.style.display = (el.style.display === 'none') ? 'block' : 'none';
    }

    function copyCode(containerId){
      const el   = document.getElementById(containerId);
      const text = el.innerText || el.textContent;
      navigator.clipboard.writeText(text).then(function(){
        alert('تم نسخ الكود بنجاح ✅');
      });
    }

    function openInTab(codeId){
      const code = document.getElementById(codeId).innerText || document.getElementById(codeId).textContent;
      const blob = new Blob([code], {type: 'text/html'});
      const url  = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }

    /* ---- GUI Demo ---- */
    function runGUIDemo(){
      const name  = document.getElementById('guiName').value.trim();
      const color = document.getElementById('guiColor').value;
      if(name === ''){
        setText('guiResult','الرجاء كتابة الاسم أولًا.');
        return;
      }
      setText('guiResult','مرحبًا ' + name + '، لونك المفضل هو ' + color + '. قرأت JavaScript القيم من عناصر GUI بنجاح ✅');
    }
    function resetGUIDemo(){
      document.getElementById('guiName').value='';
      document.getElementById('guiColor').selectedIndex=0;
      setText('guiResult','ستظهر النتيجة هنا بعد الضغط.');
    }

    /* ---- Validation Demo ---- */
    function validateFormDemo(){
      const name = document.getElementById('valName').value.trim();
      const age  = document.getElementById('valAge').value.trim();
      if(name === '' || age === ''){
        setText('validationResult','⚠️ يوجد حقل فارغ — يجب إدخال الاسم والعمر.');
      } else if(isNaN(age)){
        setText('validationResult','❌ العمر يجب أن يكون رقمًا، وليس نصًا.');
      } else if(Number(age) < 0 || Number(age) > 100){
        setText('validationResult','❌ العمر يجب أن يكون بين 0 و100.');
      } else {
        setText('validationResult','✅ البيانات صحيحة. يمكن قبول النموذج.');
      }
    }
    function resetValidationDemo(){
      document.getElementById('valName').value='';
      document.getElementById('valAge').value='';
      setText('validationResult','ستظهر نتيجة التحقق هنا.');
    }

    /* ---- DHTML Demo ---- */
    function changeDHTMLExample(){
      const area = document.getElementById('dhtmlArea');
      area.innerHTML = '⚡ تم تغيير جزء من الصفحة نفسها دون الانتقال لصفحة جديدة. هذه هي فكرة DHTML!';
      area.style.background = '#dbeafe';
      area.style.borderColor = '#93c5fd';
    }
    function resetDHTMLExample(){
      const area = document.getElementById('dhtmlArea');
      area.innerHTML = 'هذه رسالة أصلية داخل الصفحة.';
      area.style.background = '#effcf7';
      area.style.borderColor = '#d9e4ef';
    }

    /* ---- DOM Demo ---- */
    function changeDOMText(){
      const el = document.getElementById('domDemoText');
      el.innerHTML = 'تم تغيير النص باستخدام <strong>innerHTML</strong> عبر DOM ✅';
    }
    function resizeDOMBox(){
      const el = document.getElementById('domDemoText');
      el.style.fontSize = '1.3rem';
      el.style.padding  = '22px';
      el.style.background  = '#fef3c7';
      el.style.borderColor = '#fcd34d';
    }
    function resetDOMDemo(){
      const el = document.getElementById('domDemoText');
      el.innerHTML         = 'هذا النص سيتغير باستخدام DOM.';
      el.style.fontSize    = '1rem';
      el.style.padding     = '16px';
      el.style.background  = '#effcf7';
      el.style.borderColor = '#d9e4ef';
    }

    /* ---- Events Demo ---- */
    function eventMessage(msg){
      setText('eventResult', msg);
    }

    /* ---- Quiz Answers ---- */
    const answers = {
      gui:'b', validation:'b', dhtml:'b', dom:'a', events:'b', animation:'b'
    };
    function checkQuickAnswer(section, choice){
      const target = document.getElementById('quiz-' + section);
      if(choice === answers[section]){
        target.innerHTML = '✅ إجابة صحيحة!';
        target.style.background = '#f0fdf4';
      } else {
        target.textContent = 'راجع الفكرة الأساسية ثم أعد الاختيار: ' + ({gui:'عناصر GUI هي الحقول والأزرار والقوائم التي يتعامل معها المستخدم.',validation:'التحقق يفحص المدخلات قبل قبولها، مع ضرورة التحقق في الخادم أيضاً.',dhtml:'DHTML يجمع HTML وCSS وJavaScript لتحديث الصفحة.',dom:'DOM يمثل عناصر الوثيقة ويمكن الوصول إليها وتعديلها.',events:'الحدث مثل النقر أو تغيير القيمة يطلق معالجاً برمجياً.',animation:'الحركة تنتج من تغيير الموضع عبر الزمن.'}[section] || 'اقرأ الشرح أعلاه.');
        target.style.background = '#fff1f2';
      }
    }

    /* ---- Animation Demo ---- */
    let motionTimer = null;
    let ballPos     = 14;
    let direction   = 1;

    function moveBall(){
      const ball = document.getElementById('ball');
      ballPos += 6 * direction;
      if(ballPos >= Math.max(14, ball.parentElement.clientWidth - ball.offsetWidth - 14)) direction = -1;
      if(ballPos <= 14)  direction =  1;
      ball.style.right   = ballPos + 'px';
      motionTimer = setTimeout(moveBall, 35);
    }
    function startBallMotion(){
      if(motionTimer) return;
      setText('animationResult','▶ بدأت الحركة. الموضع يتغير كل 35ms باستخدام setTimeout.');
      moveBall();
    }
    function stopBallMotion(){
      clearTimeout(motionTimer);
      motionTimer = null;
      setText('animationResult','⏹ تم إيقاف الحركة باستخدام clearTimeout().');
    }
    function resetBallMotion(){
      clearTimeout(motionTimer);
      motionTimer = null;
      ballPos     = 14;
      direction   = 1;
      document.getElementById('ball').style.right = '14px';
      setText('animationResult','↩ تمت إعادة الكرة لموضعها الأصلي.');
    }

    /* ---- Final Quiz ---- */
    function gradeFinalQuiz(){
      let score = 0;
      if(document.getElementById('finalQ1').value === 'a') score++;
      if(document.getElementById('finalQ2').value === 'a') score++;
      if(document.getElementById('finalQ3').value === 'b') score++;
      if(document.getElementById('finalQ4').value === 'b') score++;
      const result = document.getElementById('finalQuizResult');
      if(score === 4){
        result.innerHTML = '<strong>نتيجتك 4/4 — ممتاز جدًا 🎉</strong><br>أحسنت! فهمت المفاهيم الأساسية للوحدة.';
        result.style.background = '#f0fdf4';
      } else if(score >= 2){
        result.innerHTML = '<strong>نتيجتك ' + score + '/4 — جيد</strong><br>لديك فهم جيد، راجع الأجزاء الضعيفة وأعد المحاولة.';
        result.style.background = '#fffbeb';
      } else {
        result.innerHTML = '<strong>نتيجتك ' + score + '/4</strong><br>يُفضَّل إعادة قراءة الأقسام الأساسية ثم المحاولة مجددًا.';
        result.style.background = '#fff1f2';
      }
    }
    function resetFinalQuiz(){
      ['finalQ1','finalQ2','finalQ3','finalQ4'].forEach(function(id){
        document.getElementById(id).selectedIndex = 0;
      });
      const result = document.getElementById('finalQuizResult');
      result.innerHTML  = 'أجب عن الأسئلة ثم اضغط "احسب نتيجتي".';
      result.style.background = '#effcf7';
    }
  // Explain each final answer rather than only reporting a total.
function gradeFinalQuiz(){
 const questions=[['finalQ1','a','DOM يمثل عناصر الوثيقة ويتيح الوصول إليها وتعديل نصها.'],['finalQ2','a','onclick يستجيب للنقر. ويمكن ربط click أيضاً عبر addEventListener.'],['finalQ3','b','isNaN يفحص هل القيمة ليست عدداً بعد التحويل؛ تحقق من الحقل الفارغ أولاً.'],['finalQ4','b','clearTimeout يلغي الاستدعاء المؤجل الذي أنشأه setTimeout.']];
 let score=0;
 questions.forEach(([id,answer,reason])=>{
  const select=document.getElementById(id);const correct=select.value===answer;if(correct)score++;
  let feedback=document.getElementById(id+'-feedback');if(!feedback){feedback=document.createElement('p');feedback.id=id+'-feedback';feedback.className='question-feedback';feedback.setAttribute('role','status');select.after(feedback);select.setAttribute('aria-describedby',feedback.id);}
  feedback.textContent=(correct?'✓ إجابة صحيحة. ':select.value?'راجع إجابتك. ':'اختر إجابة أولاً. ')+reason;
 });
 const result=document.getElementById('finalQuizResult');result.textContent=`نتيجتك: ${score} من 4. راجع تفسير كل إجابة أعلاه.`;
}
function resetFinalQuiz(){
 ['finalQ1','finalQ2','finalQ3','finalQ4'].forEach(id=>{document.getElementById(id).selectedIndex=0;document.getElementById(id+'-feedback')?.remove();});
 document.getElementById('finalQuizResult').textContent='أجب عن الأسئلة ثم اضغط احسب نتيجتي.';
}
