/* WPC — Shared JavaScript (Design System v2 "Orbit") */

(function(){
'use strict';

/* ── LOADER ────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('wpc-loader');
  if(!loader) return;
  let n = 0;
  const numEl = loader.querySelector('.loader-num');
  const iv = setInterval(()=>{
    n = Math.min(n + Math.floor(Math.random()*14)+5, 100);
    if(numEl) numEl.textContent = n + '%';
    if(n >= 100){
      clearInterval(iv);
      setTimeout(()=>{
        loader.style.transition = 'opacity 0.5s, transform 0.6s cubic-bezier(0.65,0,0.35,1)';
        loader.style.opacity = '0';
        loader.style.transform = 'translateY(-100%)';
        setTimeout(()=>loader.remove(), 600);
      }, 150);
    }
  }, 35);
});

/* ── CURSOR ────────────────────────────────────────── */
const cursor = document.getElementById('wpc-cursor');
const ring   = document.getElementById('wpc-cursor-ring');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
if(cursor && ring){
  (function tick(){
    rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
    cursor.style.left = mx+'px'; cursor.style.top = my+'px';
    ring.style.left   = rx+'px'; ring.style.top  = ry+'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button,[data-hover]').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
  document.addEventListener('mousedown',()=>document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',()=>document.body.classList.remove('cursor-click'));
}

/* ── NAV ───────────────────────────────────────────── */
const nav = document.getElementById('wpc-nav');
if(nav){
  window.addEventListener('scroll',()=>{ nav.classList.toggle('scrolled', window.scrollY > 40); });
  const svcParent = nav.querySelector('[data-dropdown="services"]')?.closest('li');
  const svcDrop   = nav.querySelector('.nav-dropdown');
  if(svcParent && svcDrop){
    let closeTimer;
    svcParent.addEventListener('mouseenter', () => { clearTimeout(closeTimer); svcDrop.classList.add('open'); });
    svcParent.addEventListener('mouseleave', () => { closeTimer = setTimeout(() => svcDrop.classList.remove('open'), 100); });
    svcDrop.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    svcDrop.addEventListener('mouseleave', () => { closeTimer = setTimeout(() => svcDrop.classList.remove('open'), 100); });
  }
  const path = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav-links a').forEach(a=>{ if(a.getAttribute('href') === path) a.classList.add('active'); });
}

/* ── SCROLL REVEAL ─────────────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');
if(revealEls.length){
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('revealed'); observer.unobserve(e.target); } });
  },{ threshold: 0.12 });
  revealEls.forEach(el=>observer.observe(el));
}

/* ── BACK TO TOP ───────────────────────────────────── */
const btt = document.getElementById('back-top');
if(btt){
  window.addEventListener('scroll',()=>btt.classList.toggle('visible', window.scrollY>600));
  btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

/* ── PARTICLES ─────────────────────────────────────── */
const canvas = document.getElementById('particles-canvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  let W, H, particles=[];
  function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  class Particle {
    constructor(){this.reset();}
    reset(){ this.x=Math.random()*W; this.y=Math.random()*H; this.r=Math.random()*1.6+0.4;
      this.vx=(Math.random()-0.5)*0.25; this.vy=(Math.random()-0.5)*0.25; this.alpha=Math.random()*0.35+0.08; }
    update(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset(); }
    draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(245,166,35,${this.alpha})`; ctx.fill(); }
  }
  for(let i=0;i<70;i++) particles.push(new Particle());
  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{p.update();p.draw();});
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<100){
          ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(139,92,246,${0.08*(1-dist/100)})`; ctx.lineWidth=0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── PARALLAX ──────────────────────────────────────── */
document.querySelectorAll('[data-parallax]').forEach(el=>{
  const speed = parseFloat(el.dataset.parallax)||0.3;
  window.addEventListener('scroll',()=>{
    const rect = el.getBoundingClientRect();
    const offset = (rect.top + rect.height/2 - window.innerHeight/2) * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
});

/* ── COUNTER ANIMATION ─────────────────────────────── */
document.querySelectorAll('[data-counter]').forEach(el=>{
  const target = parseInt(el.dataset.counter);
  const suffix = el.dataset.suffix||'';
  let started = false;
  const observer = new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting && !started){
      started=true; let current=0; const step=Math.ceil(target/60);
      const iv=setInterval(()=>{
        current=Math.min(current+step,target);
        el.textContent=current.toLocaleString()+suffix;
        if(current>=target) clearInterval(iv);
      },24);
    }
  });
  observer.observe(el);
});

/* ── SMOOTH LINK TRANSITIONS ───────────────────────── */
document.querySelectorAll('a[href]').forEach(a=>{
  const href=a.getAttribute('href');
  if(!href||href.startsWith('#')||href.startsWith('mailto')||href.startsWith('http')||href.startsWith('tel')) return;
  a.addEventListener('click',e=>{
    e.preventDefault();
    const overlay = document.createElement('div');
    overlay.className='page-transition';
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>{
      overlay.style.transition='transform 0.5s cubic-bezier(0.65,0,0.35,1)';
      overlay.style.transform='translateY(0)';
    });
    setTimeout(()=>window.location.href=href, 460);
  });
});

/* ── TILT CARDS (bento tiles) ──────────────────────── */
document.querySelectorAll('[data-tilt]').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const rect=el.getBoundingClientRect();
    const x=((e.clientX-rect.left)/rect.width-0.5)*8;
    const y=((e.clientY-rect.top)/rect.height-0.5)*-8;
    el.style.transform=`perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

/* ── SPOTLIGHT TESTIMONIAL ─────────────────────────── */
(function(){
  const wrap = document.querySelector('.spotlight[data-slides]');
  if(!wrap) return;
  let slides;
  try { slides = JSON.parse(wrap.dataset.slides); } catch(err) { return; }
  const textEl = wrap.querySelector('.spotlight-text');
  const nameEl = wrap.querySelector('.sp-name');
  const roleEl = wrap.querySelector('.sp-role');
  const avatarEl = wrap.querySelector('.sp-avatar');
  const dotsWrap = wrap.querySelector('.sp-progress');
  let idx = 0, timer;

  function render(i){
    idx = i;
    const s = slides[idx];
    textEl.style.opacity = 0;
    setTimeout(()=>{
      textEl.textContent = '"' + s.text + '"';
      nameEl.textContent = s.name;
      roleEl.textContent = s.role;
      avatarEl.textContent = s.name.charAt(0);
      textEl.style.opacity = 1;
    }, 200);
    dotsWrap.querySelectorAll('.sp-dot').forEach((d,di)=>d.classList.toggle('active', di===idx));
  }
  function next(){ render((idx+1) % slides.length); reset(); }
  function prev(){ render((idx-1+slides.length) % slides.length); reset(); }
  function reset(){ clearInterval(timer); timer = setInterval(next, 5500); }

  slides.forEach((s,i)=>{
    const dot = document.createElement('span');
    dot.className = 'sp-dot' + (i===0?' active':'');
    dot.addEventListener('click', ()=>{ render(i); reset(); });
    dotsWrap.appendChild(dot);
  });
  wrap.querySelector('.sp-arrow.prev')?.addEventListener('click', prev);
  wrap.querySelector('.sp-arrow.next')?.addEventListener('click', next);
  textEl.style.transition = 'opacity 0.2s';
  render(0);
  reset();
})();

/* ── FAQ ACCORDION ─────────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item=>{
  const q = item.querySelector('.faq-q');
  if(!q) return;
  q.addEventListener('click', ()=>{
    const isOpen = item.classList.contains('open');
    item.closest('.faq-list')?.querySelectorAll('.faq-item.open').forEach(o=>{ if(o!==item) o.classList.remove('open'); });
    item.classList.toggle('open', !isOpen);
  });
});

/* ── TEXT SPLIT ANIMATION ──────────────────────────── */
document.querySelectorAll('[data-split]').forEach(el=>{
  const text=el.textContent;
  el.innerHTML=text.split('').map((c,i)=>
    `<span style="display:inline-block;transition:transform 0.6s ${0.03*i}s,opacity 0.6s ${0.03*i}s;transform:translateY(20px);opacity:0">${c==' '?'&nbsp;':c}</span>`
  ).join('');
  const obs=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      el.querySelectorAll('span').forEach(s=>{ s.style.transform='translateY(0)'; s.style.opacity='1'; });
      obs.unobserve(el);
    }
  });
  obs.observe(el);
});

})();
