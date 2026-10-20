const initial = [{title:'ورشة تصميم الويب',capacity:20},{title:'نادي القراءة',capacity:15}];
let activities = initial;

function render(query='') {
 const list=document.querySelector('#activities'); list.replaceChildren();
 const matches=activities.filter(activity=>activity.title.includes(query));
 for(const activity of matches){const li=document.createElement('li');li.textContent=activity.title+' — '+activity.capacity+' مقعداً';list.append(li);}
 if(!matches.length){const li=document.createElement('li');li.textContent='لا توجد أنشطة مطابقة.';list.append(li);}
}
document.querySelector('#search-button').addEventListener('click',()=>render(document.querySelector('#search').value.trim()));
document.querySelector('#activity-form').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#message').textContent='سنفعّل الإضافة في المرحلة الرابعة.';});
render();