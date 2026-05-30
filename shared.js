/* WPC — Shared JavaScript */

(function(){
'use strict';

/* ── LOADER ────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('wpc-loader');
  if(!loader) return;
  let n = 0;
  const numEl = loader.querySelector('.loader-num');
  const iv = setInterval(()=>{
    n = Math.min(n + Math.floor(Math.random()*12)+4, 100);
    if(numEl) numEl.textContent = n + '%';
    if(n >= 100){
      clearInterval(iv);
      setTimeout(()=>{
        loader.style.transition = 'opacity 0.6s, transform 0.7s cubic-bezier(0.65,0,0.35,1)';
        loader.style.opacity = '0';
        loader.style.transform = 'translateY(-100%)';
        setTimeout(()=>loader.remove(), 700);
      }, 200);
    }
  }, 40);
});

/* ── CURSOR ────────────────────────────────────────── */
const cursor = document.getElementById('wpc-cursor');
const ring   = document.getElementById('wpc-cursor-ring');
let mx=0, my=0, rx=0, ry=0;

document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });

if(cursor && ring){
  (function tick(){
    rx += (mx-rx)*0.1; ry += (my-ry)*0.1;
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
  window.addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Services dropdown — use parent li to avoid gap issue
  const svcParent  = nav.querySelector('[data-dropdown="services"]')?.closest('li');
  const svcDrop    = nav.querySelector('.nav-dropdown');
  if(svcParent && svcDrop){
    let closeTimer;
    svcParent.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      svcDrop.classList.add('open');
    });
    svcParent.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => svcDrop.classList.remove('open'), 80);
    });
    svcDrop.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    svcDrop.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => svcDrop.classList.remove('open'), 80);
    });
  }

  // Active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav-links a').forEach(a=>{
    if(a.getAttribute('href') === path) a.classList.add('active');
  });
}

/* ── SCROLL REVEAL ─────────────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');
if(revealEls.length){
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('revealed'); observer.unobserve(e.target); }
    });
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
    reset(){
      this.x = Math.random()*W;
      this.y = Math.random()*H;
      this.r = Math.random()*1.8+0.4;
      this.vx= (Math.random()-0.5)*0.3;
      this.vy= (Math.random()-0.5)*0.3;
      this.alpha = Math.random()*0.35+0.05;
    }
    update(){
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(184,147,58,${this.alpha})`;
      ctx.fill();
    }
  }

  for(let i=0;i<80;i++) particles.push(new Particle());

  // Connection lines
  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{p.update();p.draw();});
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<100){
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(184,147,58,${0.08*(1-dist/100)})`;
          ctx.lineWidth=0.5;
          ctx.stroke();
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
      started=true;
      let current=0;
      const step=Math.ceil(target/60);
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
  if(!href||href.startsWith('#')||href.startsWith('mailto')||href.startsWith('http')) return;
  a.addEventListener('click',e=>{
    e.preventDefault();
    const overlay = document.createElement('div');
    overlay.className='page-transition';
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>{
      overlay.style.transition='transform 0.5s cubic-bezier(0.65,0,0.35,1)';
      overlay.style.transform='translateY(0)';
    });
    setTimeout(()=>window.location.href=href, 500);
  });
});

/* ── TILT CARDS ────────────────────────────────────── */
document.querySelectorAll('[data-tilt]').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const rect=el.getBoundingClientRect();
    const x=((e.clientX-rect.left)/rect.width-0.5)*12;
    const y=((e.clientY-rect.top)/rect.height-0.5)*-12;
    el.style.transform=`perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

/* ── TEXT SPLIT ANIMATION ──────────────────────────── */
document.querySelectorAll('[data-split]').forEach(el=>{
  const text=el.textContent;
  el.innerHTML=text.split('').map((c,i)=>
    `<span style="display:inline-block;transition:transform 0.6s ${0.03*i}s,opacity 0.6s ${0.03*i}s;transform:translateY(20px);opacity:0">${c==' '?'&nbsp;':c}</span>`
  ).join('');
  const obs=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      el.querySelectorAll('span').forEach(s=>{
        s.style.transform='translateY(0)';
        s.style.opacity='1';
      });
      obs.unobserve(el);
    }
  });
  obs.observe(el);
});

})();
