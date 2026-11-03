(function(){
  // filter
  const cs=[...document.querySelectorAll('.case')];
  document.querySelectorAll('.chips button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.chips button').forEach(x=>x.setAttribute('aria-pressed',x===b));const f=b.dataset.f;cs.forEach(c=>c.classList.toggle('hide',f!=='all'&&c.dataset.type!==f))});
  // melt bars
  const M=[{a:3866,b:9356,p:'CA$',d:'+142%',dec:0},{a:112,b:255,p:'',d:'+128%',dec:0},{a:34.61,b:36.69,p:'CA$',d:'+6%',dec:2}];
  const btn=[...document.querySelectorAll('.seg3 button')];let k=0,hold=0,shown=false;
  function show(i){k=i;btn.forEach((x,j)=>x.setAttribute('aria-pressed',j===i));const m=M[i];const mx=Math.max(m.a,m.b);
    const ha=i===2?62:m.a/mx*100,hb=i===2?66:100;$('b0').style.height=ha+'%';$('b1').style.height=hb+'%';
    [$('v0'),$('v1')].forEach((el,j)=>{el.dataset.prefix=m.p;el.dataset.dec=m.dec;countUp(el,0,j?m.b:m.a,900)});
    const d=$('dl');d.textContent=m.d;d.style.animation='none';void d.offsetWidth;d.style.animation=''}
  btn.forEach((x,j)=>x.onclick=()=>{hold=Date.now()+8000;show(j)});
  $('b0').style.height='0';$('b1').style.height='0';
  const o=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!shown){shown=true;show(0);setInterval(()=>{if(Date.now()>hold)show((k+1)%3)},3200)}},{threshold:.4});o.observe($('bars'));
  // before/after drag
  document.querySelectorAll('.lapmini').forEach(el=>{const a=el.querySelector('.a'),l=el.querySelector('.ln');let d=false,touched=false;
    const set=v=>{a.style.clipPath=`inset(0 0 0 ${v}%)`;l.style.left=v+'%'};const fx=x=>{const r=el.getBoundingClientRect();set(Math.max(0,Math.min(100,(x-r.left)/r.width*100)))};
    el.addEventListener('pointerdown',e=>{d=true;touched=true;try{el.setPointerCapture(e.pointerId)}catch(_){}fx(e.clientX)});el.addEventListener('pointermove',e=>{if(d)fx(e.clientX)});el.addEventListener('pointerup',()=>d=false);
    const peek=()=>{const seq=[[50,0],[20,700],[80,1500],[50,2200]];let s0=null;const run=t=>{if(touched)return;s0=s0||t;const e=t-s0;let i=seq.findIndex(x=>x[1]>e);if(i<0){set(50);return}const [v1,t1]=seq[i],[v0,t0]=seq[i-1]||seq[0];const q=t1===t0?1:(e-t0)/(t1-t0);const qq=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2;set(v0+(v1-v0)*qq);requestAnimationFrame(run)};requestAnimationFrame(run)};
    new IntersectionObserver((es,ob)=>{if(es[0].isIntersecting){setTimeout(peek,400);ob.disconnect()}},{threshold:.5}).observe(el)});
  // evergreen before/after phone
  const pbs=[...document.querySelectorAll('#ev .pb')],eb=[...document.querySelectorAll('.ev-btns button')];let e=0,eh=0;
  const ev=i=>{e=i;pbs.forEach((p,j)=>p.classList.toggle('on',j===i));eb.forEach((b,j)=>b.setAttribute('aria-pressed',j===i));const l=$('ev-l');l.textContent=i?'After':'Before';l.classList.toggle('after',!!i)};
  eb.forEach((b,j)=>b.onclick=()=>{eh=Date.now()+8000;ev(j)});setInterval(()=>{if(Date.now()>eh)ev(1-e)},2800);
})();

(function(){const l=document.querySelector('.mloupe');if(!l)return;const h=l.closest('section');h.classList.add('ph');requestAnimationFrame(()=>requestAnimationFrame(()=>h.classList.add('up')))})();

(function(){const b=document.querySelector('.wn-band');if(!b)return;const n=b.querySelector('.wn-n');
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){b.classList.add('in');const to=+n.dataset.to,t0=performance.now()+600;const f=t=>{const k=Math.max(0,Math.min(1,(t-t0)/1600));n.textContent='CA$'+Math.round(to*(1-Math.pow(1-k,3))).toLocaleString('en-US');if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f);o.disconnect()}},{threshold:.35}).observe(b)})();

(function(){const r=document.querySelector('.sb-r');if(!r)return;const n=r.querySelector('.sb-n'),lv=r.querySelector('.sb-lv'),bs=[...r.querySelectorAll('.sb-sw button')];let cur=0,raf,auto=true,seen=false;
const count=(to)=>{cancelAnimationFrame(raf);const f0=cur,t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1200),e=1-Math.pow(1-k,3);cur=Math.round(f0+(to-f0)*e);n.textContent='CA$'+cur.toLocaleString('en-US');if(k<1)raf=requestAnimationFrame(f)};raf=requestAnimationFrame(f)};
const set=k=>{r.dataset.n=k;bs.forEach(b=>b.setAttribute('aria-pressed',b.dataset.n==k));lv.textContent=k==2?'80%':'52%';count(k==2?2000:0)};
bs.forEach(b=>b.addEventListener('click',()=>{auto=false;set(b.dataset.n)}));
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting&&!seen){seen=true;set(1);setTimeout(()=>{set(2)},1600);setInterval(()=>{if(auto&&!document.hidden)set(r.dataset.n==2?1:2)},5000);o.disconnect()}},{threshold:.4}).observe(r)})();

requestAnimationFrame(()=>{const v=document.querySelector(".cs2");if(v)setTimeout(()=>v.classList.add("on"),200)})