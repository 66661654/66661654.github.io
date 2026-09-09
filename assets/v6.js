
(() => {
  const qs=(s,c=document)=>c.querySelector(s);
  const qsa=(s,c=document)=>[...c.querySelectorAll(s)];

  // Build a compact section rail automatically from the page structure.
  const rail=qs('.section-rail');
  const sections=qsa('main section[id]');
  if(rail && sections.length){
    sections.forEach((section,i)=>{
      const b=document.createElement('button');
      b.type='button';
      b.setAttribute('aria-label', section.querySelector('.section-title h2')?.textContent || `Section ${i+1}`);
      b.addEventListener('click',()=>section.scrollIntoView({behavior:'smooth',block:'start'}));
      rail.appendChild(b);
    });
  }

  // Section entrance + rail synchronization.
  const railButtons=qsa('.section-rail button');
  const sectionObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('section-in');
      const idx=sections.indexOf(entry.target);
      railButtons.forEach((b,i)=>b.classList.toggle('active',i===idx));
    });
  },{rootMargin:'-22% 0px -55% 0px',threshold:.04});
  sections.forEach(s=>sectionObserver.observe(s));

  // Mouse-position reactive illumination on academic cards.
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    qsa('.hover-light').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--mx',`${e.clientX-r.left}px`);
        card.style.setProperty('--my',`${e.clientY-r.top}px`);
      });
    });

    // Slightly broader tilt across the page, kept intentionally subtle.
    qsa('.mentor-card,.honor-feature,.project,.practice,.card').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(1100px) rotateX(${-y*2.2}deg) rotateY(${x*2.8}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
  }

  // Gentle parallax on the hero card and research question.
  const heroCard=qs('.profile-card');
  const researchQ=qs('.question');
  const parallax=()=>{
    const y=scrollY;
    if(heroCard && innerWidth>900) heroCard.style.translate=`0 ${Math.min(16,y*.018)}px`;
    if(researchQ && innerWidth>900){
      const r=researchQ.getBoundingClientRect();
      const d=(r.top+r.height/2-innerHeight/2)/innerHeight;
      researchQ.style.translate=`0 ${Math.max(-8,Math.min(8,-d*10))}px`;
    }
  };
  addEventListener('scroll',parallax,{passive:true}); parallax();

  // First section is immediately visible.
  qs('.hero')?.classList.add('section-in');
})();
