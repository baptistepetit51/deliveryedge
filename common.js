document.documentElement.classList.add('js');
window.$=id=>document.getElementById(id);
(function(){
  document.querySelectorAll('[data-dd]').forEach(b=>{const p=b.nextElementSibling;b.addEventListener('click',e=>{e.stopPropagation();const open=p.hidden;document.querySelectorAll('.dd-panel').forEach(x=>x.hidden=true);p.hidden=!open;b.setAttribute('aria-expanded',open)})});
  document.addEventListener('click',()=>document.querySelectorAll('.dd-panel').forEach(x=>x.hidden=true));
  const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15}):null;
  document.querySelectorAll('.rv').forEach(el=>io?io.observe(el):el.classList.add('in'));
  const fmt=(v,el)=>{const d=+(el.dataset.dec||0);let t=v.toFixed(d);if(!el.dataset.nosep)t=Number(t).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});return (el.dataset.prefix||'')+t+(el.dataset.suffix||'')};
  window.countUp=(el,from,to,ms=1400)=>{let s0=null;const step=t=>{s0=s0||t;const k=Math.min(1,(t-s0)/ms);el.textContent=fmt(from+(to-from)*(1-Math.pow(1-k,4)),el);if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)};
  const cio=io&&new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;el.style.minWidth=el.offsetWidth+'px';countUp(el,+(el.dataset.from||0),+el.dataset.count,1600);cio.unobserve(el)}),{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>{el.style.display='inline-block';el.style.fontVariantNumeric='tabular-nums';cio&&cio.observe(el)});
  // accordion
  document.querySelectorAll('.faq-q').forEach(q=>q.addEventListener('click',()=>{const it=q.parentElement;const o=it.classList.toggle('open');q.setAttribute('aria-expanded',o)}));
})();

(function(){const b=document.getElementById('burger'),m=document.getElementById('mnav');if(!b||!m)return;
  const set=o=>{m.hidden=!o;b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu');document.body.classList.toggle('mn-open',o)};
  b.addEventListener('click',e=>{e.stopPropagation();set(m.hidden)});m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});addEventListener('resize',()=>{if(innerWidth>960)set(false)})})();
(function(){const F={wave:['c_wave1','c_wave2'],idle:['c_idle'],blink:['c_blink'],think:['c_think'],tablet:['c_tablet'],bags:['c_bags'],ok:['c_ok'],look:['c_look']};
document.querySelectorAll('.mascot[data-seq]:not([data-video])').forEach(m=>{
  const seq=m.dataset.seq.split(','),need=new Set(['blink','idle']);seq.forEach(s=>need.add(s));
  const names=[...new Set([...need].flatMap(k=>F[k]))];
  m.innerHTML=names.map((n,i)=>`<img src="img/${n}.webp" data-n="${n}" alt="${i?'':(m.dataset.alt||'')}" ${i?'aria-hidden="true"':''}>`).join('');
  const im={};m.querySelectorAll('img').forEach(x=>im[x.dataset.n]=x);
  let cur=null;const show=n=>{if(cur===n)return;Object.values(im).forEach(x=>x.classList.toggle('on',x.dataset.n===n));cur=n};
  const T=[];const at=(ms,f)=>T.push(setTimeout(f,ms));
  const hop=()=>{m.classList.remove('hop');void m.offsetWidth;m.classList.add('hop')};
  function cycle(){T.forEach(clearTimeout);T.length=0;let t=0;
    seq.forEach((s,si)=>{
      if(s==='wave'){for(let i=0;i<8;i++)at(t+i*190,()=>show(F.wave[i%2]));t+=8*190}
      else{at(t,()=>{show(F[s][0]);hop()});
        const hold=si===seq.length-1?(+(m.dataset.hold||7000)):2600;
        if(s==='idle'){for(let b=900;b<hold-300;b+=2600){at(t+b,()=>show('c_blink'));at(t+b+140,()=>show('c_idle'))}}
        t+=hold}});
    at(t,cycle)}
  show(F[seq[0]][0]);
  const start=()=>{m.classList.add('in');setTimeout(()=>{m.classList.add('idle');cycle()},700)};
  if('IntersectionObserver' in window)new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){start();o.disconnect()}},{threshold:.25}).observe(m);else start()})})();

(function(){
const mk=(src,loop)=>{const v=document.createElement('video');v.muted=true;v.loop=loop;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('muted','');v.preload='none';v.className='mv';const b=src.replace(/\.mp4$/,'');v.poster=b+'.jpg';[['webm','video/webm'],['mp4','video/mp4']].forEach(([e,t])=>{const s=document.createElement('source');s.src=b+'.'+e;s.type=t;v.appendChild(s)});return v};
document.querySelectorAll('.mascot[data-video]').forEach(m=>{
  m.innerHTML='';const v=mk(m.dataset.video,false);v.setAttribute('aria-label',m.dataset.alt||'');
  const rate=+(m.dataset.rate||1),stop=+(m.dataset.stop||0);let played=false,done=false;
  let idle=null;if(m.dataset.idle){idle=mk(m.dataset.idle,true);idle.classList.add('idle-v');idle.setAttribute('aria-hidden','true');idle.addEventListener('error',()=>{idle.remove();idle=null},{once:true});m.appendChild(idle)}
  m.classList.add('has-video');v.addEventListener('loadeddata',()=>{v.playbackRate=rate},{once:true});
  v.addEventListener('error',()=>{v.remove();if(!m.querySelector('video')){m.classList.remove('has-video');const i=document.createElement('img');i.src=v.poster;i.className='on';i.alt=m.dataset.alt||'';m.appendChild(i);m.classList.add('breath')}},{once:true});
  const finish=()=>{if(done)return;done=true;
    if(idle&&idle.readyState>=2){idle.currentTime=0;idle.play().catch(()=>{});requestAnimationFrame(()=>{m.classList.add('idling')})}
    else{v.pause();m.classList.add('breath')}};
  if(stop)v.addEventListener('timeupdate',()=>{if(v.currentTime>=stop)finish()});
  v.addEventListener('ended',finish);
  m.appendChild(v);
  m._replay=()=>{if(!done)return;done=false;v.currentTime=0;v.playbackRate=rate;const p=v.play();(p&&p.then?p:Promise.resolve()).then(()=>{m.classList.remove('idling','breath');if(idle)setTimeout(()=>idle.pause(),50)}).catch(()=>{done=true})};
  new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){m.classList.add('in');if(!played){played=true;if(idle){idle.preload='auto';idle.load()}v.preload='auto';v.playbackRate=rate;v.play().catch(()=>{})}else if(done&&idle)idle.play().catch(()=>{})}else if(done&&idle)idle.pause()})},{threshold:.35}).observe(m)})})();


