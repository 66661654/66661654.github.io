const btn=document.querySelector('.menu-btn'),nav=document.querySelector('.nav');
btn?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();
const links=[...document.querySelectorAll('.nav a')];
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${e.target.id}`))}}),{rootMargin:'-25% 0px -65% 0px'});
document.querySelectorAll('main section[id]').forEach(s=>obs.observe(s));
