(function(){
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
// scroll progress
const bar=document.createElement('div');bar.className='mx-bar';document.body.appendChild(bar);
// parallax targets: [selector, speed]
const P=[['.hs',-.08],['.wn-stage',-.06],['.sb-st',-.05],['.sc-panel .sc-side',.06],['.hero .stage',-.05],['.stage',-.05]];
const els=[];if(innerWidth<760)P.length=0;P.forEach(([s,k])=>document.querySelectorAll(s).forEach(e=>{if(!els.some(x=>x.e===e))els.push({e,k})}));
let tick=false;const upd=()=>{tick=false;const h=document.documentElement,max=h.scrollHeight-innerHeight;bar.style.transform=`scaleX(${max>0?scrollY/max:0})`;
  const vh=innerHeight;els.forEach(({e,k})=>{const r=e.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;const c=(r.top+r.height/2-vh/2);e.style.translate=`0 ${(c*k).toFixed(1)}px`})};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd();
if(!fine)return;
// spotlight on cards
document.querySelectorAll('.plan,.calc-out,.us-card,.case-card,.bt,.ls,.sb,.cta-band,.hp2').forEach(c=>{if(c.querySelector('.mascot,video,.lean,.lean-h,.mloupe,.cb-img'))return;c.classList.add('mx-spot');const bg=getComputedStyle(c).backgroundColor;const m=bg.match(/[\d.]+/g);if(m&&(m.length<4||+m[3]>0.5)&&(+m[0]+ +m[1]+ +m[2])<200)c.classList.add('mx-dark');
  c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')})});
// magnetic primary buttons
document.querySelectorAll('.btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;b.style.transform=`translate(${x*8}px,${y*6}px)`});b.addEventListener('pointerleave',()=>{b.style.transform=''})});
// 3D tilt on hero phone + numbers phone + 3D stage
document.querySelectorAll('.stage .phone,.wn-phone,.hs').forEach(t=>{const host=t.closest('section')||t.parentElement;t.classList.add('mx-tilt');
  host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.setProperty('--tx',x);t.style.setProperty('--ty',y);t.style.rotate=`${(-y*4).toFixed(2)}deg ${(x*1).toFixed(2)}deg 0deg`;});
  host.addEventListener('pointerleave',()=>{t.style.rotate=''})});
})();
