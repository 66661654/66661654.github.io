
(() => {
  const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
  qsa('.honor-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      qsa('.honor-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.honorFilter;
      qsa('.honor-filter-item').forEach(item=>{
        const cats=(item.dataset.honorCategory||'').split(/\s+/);
        const show=f==='all'||cats.includes(f);
        item.classList.toggle('honor-hidden',!show);
        if(show){item.classList.remove('honor-focus');requestAnimationFrame(()=>item.classList.add('honor-focus'));}
      });
    });
  });
  const math=document.querySelector('.math-spotlight'), visual=document.querySelector('.math-visual');
  if(math&&visual&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    const parallax=()=>{const r=math.getBoundingClientRect(),d=(r.top+r.height/2-innerHeight/2)/innerHeight;visual.style.transform=`translateY(${Math.max(-8,Math.min(8,-d*14))}px)`;};
    addEventListener('scroll',parallax,{passive:true});parallax();
    qsa('.math-spotlight .cert-btn,.honor-filter').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.08,y=(e.clientY-r.top-r.height/2)*.08;el.style.transform=`translate(${x}px,${y}px)`;});
      el.addEventListener('pointerleave',()=>el.style.transform='');
    });
  }
  const years=qsa('.honor-year');
  if(years.length){
    const obs=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;years.forEach((y,i)=>{y.style.opacity='0';y.style.transform='translateY(12px)';setTimeout(()=>{y.style.transition='opacity .55s var(--ease),transform .55s var(--ease)';y.style.opacity='1';y.style.transform='none';},i*95);});obs.disconnect();}),{threshold:.2});
    obs.observe(years[0].parentElement);
  }
})();
