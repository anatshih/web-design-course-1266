const initial = [{title:'ورشة تصميم الويب',capacity:20},{title:'نادي القراءة',capacity:15}];
let activities = initial;
try { const saved=JSON.parse(localStorage.getItem('my-activities')); if(Array.isArray(saved)&&saved.every(a=>typeof a.title==='string'&&Number.isInteger(a.capacity)))activities=saved; } catch { document.querySelector('#message').textContent='تعذر استعادة البيانات المحلية.'; }
function render(query='') {
 const list=document.querySelector('#activities'); list.replaceChildren();
 const matches=activities.filter(activity=>activity.title.includes(query));
 for(const activity of matches){const li=document.createElement('li');li.textContent=activity.title+' — '+activity.capacity+' مقعداً';list.append(li);}
 if(!matches.length){const li=document.createElement('li');li.textContent='لا توجد أنشطة مطابقة.';list.append(li);}
}
document.querySelector('#search-button').addEventListener('click',()=>render(document.querySelector('#search').value.trim()));
document.querySelector('#search').addEventListener('input',event=>render(event.target.value.trim()));
document.querySelector('#activity-form').addEventListener('submit',event=>{
 event.preventDefault(); const form=event.currentTarget,title=form.elements.title.value.trim(),capacity=Number(form.elements.capacity.value);
 if(!title||!Number.isInteger(capacity)||capacity<1||capacity>1000){document.querySelector('#message').textContent='أدخل عنواناً وعدداً صحيحاً من 1 إلى 1000.';return;}
 activities.push({title,capacity});try{localStorage.setItem('my-activities',JSON.stringify(activities));document.querySelector('#message').textContent='حُفظ النشاط على هذا الجهاز.';}catch{document.querySelector('#message').textContent='أُضيف النشاط لهذه الجلسة؛ تعذر حفظه محلياً.';}
 form.reset();render(document.querySelector('#search').value.trim());
});
render();