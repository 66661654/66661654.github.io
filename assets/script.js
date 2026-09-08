
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

window.addEventListener('load',()=>document.body.classList.remove('site-loading'));

// Mobile navigation
const btn=$('.menu-btn'), nav=$('.nav');
btn?.addEventListener('click',()=>nav.classList.toggle('open'));
$$('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

// Footer year
const year=$('#year'); if(year) year.textContent=new Date().getFullYear();

// Theme
const root=document.documentElement, themeBtn=$('.theme-toggle');
const savedTheme=localStorage.getItem('jf-theme');
if(savedTheme) root.dataset.theme=savedTheme;
themeBtn?.addEventListener('click',()=>{
  const next=root.dataset.theme==='dark'?'light':'dark';
  root.dataset.theme=next;
  localStorage.setItem('jf-theme',next);
});

// Scroll progress + header + back-to-top
const progress=$('.scroll-progress span'), topbar=$('.topbar'), backTop=$('.back-top');
const onScroll=()=>{
  const h=document.documentElement.scrollHeight-innerHeight;
  const pct=h>0?(scrollY/h)*100:0;
  if(progress) progress.style.width=`${pct}%`;
  topbar?.classList.toggle('scrolled',scrollY>18);
  backTop?.classList.toggle('visible',scrollY>650);
};
addEventListener('scroll',onScroll,{passive:true}); onScroll();
backTop?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

// Cursor ambient glow
const glow=$('.cursor-glow');
addEventListener('pointermove',e=>{
  if(!glow || innerWidth<700) return;
  glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px';
},{passive:true});

// Active nav
const links=$$('.nav a[href^="#"]');
const sectionObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${e.target.id}`));
  });
},{rootMargin:'-25% 0px -62% 0px'});
$$('main section[id]').forEach(s=>sectionObs.observe(s));

// Scroll reveal
const revealItems=$$('section, .card, .project, .practice, .pub, .honors>div, .pub-toolbar');
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      e.target.style.transitionDelay=`${Math.min(i%5,4)*45}ms`;
      e.target.classList.add('is-visible');
      revealObs.unobserve(e.target);
    }
  });
},{threshold:.08});
revealItems.forEach(el=>revealObs.observe(el));

// Subtle 3D tilt for desktop pointer devices
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  $$('.interactive-card,.profile-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${-y*3.2}deg) rotateY(${x*4.2}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}

// Publication filters
$$('.filter-btn').forEach(filter=>{
  filter.addEventListener('click',()=>{
    $$('.filter-btn').forEach(b=>b.classList.remove('active')); filter.classList.add('active');
    const val=filter.dataset.filter;
    $$('.pub[data-category]').forEach(card=>{
      card.classList.toggle('filtered-out',val!=='all' && card.dataset.category!==val);
    });
  });
});

// Expandable publication details
$$('.details-toggle').forEach(toggle=>{
  toggle.addEventListener('click',()=>{
    const details=toggle.closest('.pub')?.querySelector('.pub-details');
    if(!details)return;
    const opening=details.hidden;
    details.hidden=!opening;
    toggle.setAttribute('aria-expanded',opening?'true':'false');
    toggle.textContent=opening?'Key Findings ↑':'Key Findings ↓';
  });
});

// Acceptance letter modal
const openModal=id=>{
  const m=document.getElementById(id); if(!m)return;
  m.classList.add('open'); m.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  m.querySelector('.modal-close')?.focus();
};
const closeModal=m=>{
  m?.classList.remove('open'); m?.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
};
$$('[data-modal]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.modal)));
$$('[data-close-modal]').forEach(el=>el.addEventListener('click',()=>closeModal(el.closest('.modal'))));
addEventListener('keydown',e=>{
  if(e.key==='Escape') closeModal($('.modal.open'));
});

// Interactive research pipeline
const pipelineCopy=[
  ['STEP 01','Operational SOP ingestion','解析企业 SOP、表格和例外规则，保留版本、时间、适用范围与原始来源。'],
  ['STEP 02','Rule provenance graph','将自然语言拆为原子业务规则，并建立“句子—规则—变量—约束—数据字段”的可追溯映射。'],
  ['STEP 03','Independent dual formalization','由独立路径分别形成 intended semantics 与 candidate optimization model，降低单模型自审带来的循环偏差。'],
  ['STEP 04','Counterexample-grounded audit','调用 Z3 / optimization solver 主动寻找 candidate ∧ ¬intended 或 intended ∧ ¬candidate 的最小反例。'],
  ['STEP 05','Verified model & targeted repair','根据 omission、direction、scope、hard/soft、binding 等错误类型执行局部修补、重新绑定或重新生成。'],
  ['STEP 06','Decision-aware evaluation','将语义错误连接到业务决策：评估 regret、hard-rule violation、成本与服务损失，而不只看代码能否执行。']
];
const explainer=$('.pipeline-explainer');
const activateStep=step=>{
  $$('.pipeline-step').forEach(s=>s.classList.toggle('active',s===step));
  const d=pipelineCopy[Number(step.dataset.step)||0];
  if(!explainer)return;
  $('.pipeline-explainer-index',explainer).textContent=d[0];
  $('.pipeline-explainer-title',explainer).textContent=d[1];
  $('.pipeline-explainer-text',explainer).textContent=d[2];
};
$$('.pipeline-step').forEach(step=>{
  step.addEventListener('click',()=>activateStep(step));
  step.addEventListener('mouseenter',()=>activateStep(step));
  step.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')activateStep(step)});
});

// Count-up academic stats
const counters=$$('[data-count]');
const countObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target,target=Number(el.dataset.count),prefix=el.dataset.prefix||'',suffix=el.dataset.suffix||'';
    if(!Number.isFinite(target)){return}
    const dur=700,start=performance.now();
    const tick=t=>{
      const p=Math.min((t-start)/dur,1), eased=1-Math.pow(1-p,3);
      const val=Math.round(target*eased);
      el.textContent=`${prefix}${val}${suffix}`;
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick); countObs.unobserve(el);
  });
},{threshold:.5});
counters.forEach(c=>countObs.observe(c));
