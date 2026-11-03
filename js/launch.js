(function(){
  const c=document.querySelectorAll('.sv-chk span');let k=0;
  const tick=()=>{c.forEach((s,i)=>s.classList.toggle('on',i<=k));k=(k+1)%(c.length+1);if(k===0)setTimeout(()=>c.forEach(s=>s.classList.remove('on')),600)};
  if(c.length){setInterval(tick,700)}
  const f=document.querySelector('.funnel');if(f){new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){f.querySelectorAll('i').forEach(i=>i.style.width=i.dataset.w);o.disconnect()}},{threshold:.4}).observe(f)}
})();

(function(){const c=document.getElementById('sv-chef');if(!c)return;const box=c.parentElement;let t=0;
  box.addEventListener('mousemove',e=>{const r=box.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`translate(${x*14}px,${y*10}px) rotate(${x*6}deg)`});
  box.addEventListener('mouseleave',()=>c.style.transform='');
  (function bob(ts){t=ts/1000;if(!box.matches(':hover'))c.style.transform=`translateY(${Math.sin(t*1.4)*10}px) rotate(${Math.sin(t*.9)*2}deg)`;requestAnimationFrame(bob)})(0)})();