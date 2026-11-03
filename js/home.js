document.documentElement.classList.add('js');
(function(){
  const $=id=>document.getElementById(id);
  document.querySelectorAll('[data-dd]').forEach(b=>{const p=b.nextElementSibling;b.addEventListener('click',e=>{e.stopPropagation();const open=p.hidden;document.querySelectorAll('.dd-panel').forEach(x=>x.hidden=true);p.hidden=!open;b.setAttribute('aria-expanded',open)})});
  document.addEventListener('click',()=>document.querySelectorAll('.dd-panel').forEach(x=>x.hidden=true));
  const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15}):null;
  document.querySelectorAll('.rv').forEach(el=>io?io.observe(el):el.classList.add('in'));
  const fmt=(v,el)=>{const d=+(el.dataset.dec||0);let t=v.toFixed(d);if(!el.dataset.nosep)t=Number(t).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});return (el.dataset.prefix||'')+t+(el.dataset.suffix||'')};
  const cio=io&&new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,n=+el.dataset.count,f=+(el.dataset.from||0);el.style.minWidth=el.offsetWidth+'px';let s0=null;const step=t=>{s0=s0||t;const k=Math.min(1,(t-s0)/1600);el.textContent=fmt(f+(n-f)*(1-Math.pow(1-k,4)),el);if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step);cio.unobserve(el)}),{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>{el.style.display='inline-block';el.style.fontVariantNumeric='tabular-nums';cio&&cio.observe(el)});
  // rotating hero word (all words stacked in one cell, so layout never moves)
  (function(){const ws=[...document.querySelectorAll('h1 .rot em')];if(!ws.length)return;let k=0;
    setInterval(()=>{ws[k].classList.remove('on');ws[k].classList.add('off');const prev=ws[k];setTimeout(()=>prev.classList.remove('off'),500);k=(k+1)%ws.length;ws[k].classList.add('on')},2400)})();
  // gains: draw the curve on reveal, with a fallback
  (function(){const g=document.querySelector('.g-curve');if(!g)return;const card=g.closest('.gain');const line=g.querySelector('.g-line');const L=line.getTotalLength();line.style.strokeDasharray=L;line.style.strokeDashoffset=L;
    const go=()=>{card.classList.add('drawn');line.style.strokeDashoffset=0};
    if('IntersectionObserver' in window){const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){go();o.disconnect()}},{threshold:.3});o.observe(card);setTimeout(go,6000)}else go()})();
  // score section
  (function(){
    const comps=[["Golden Wok",4.8,91],["Noodle House",4.6,86],["Dumpling Bar",4.5,82],["Pho Corner",4.5,79],["Rice & Co",4.4,76],["Bao Box",4.4,73],["Wok Express",4.3,70],["Lucky Kitchen",4.3,66],["Spice Road",4.2,62]];
    const fixes=[["Photos missing on 9 dishes",12],["Menu: 39 items, no best sellers",10],["Prep time 22 min, area avg 14",9],["BOGO on everything, losing margin",8]];
    const on=fixes.map(()=>false);
    $('tk-items').innerHTML=fixes.map((f,i)=>`<button type="button" class="tk" aria-pressed="false" data-i="${i}"><i>✕</i>${f[0]}</button>`).join('');
    const ord=n=>n+(n%10==1&&n!=11?'st':n%10==2&&n!=12?'nd':n%10==3&&n!=13?'rd':'th');
    const RH=46;const all=[...comps.map(c=>({n:c[0],r:c[1],s:c[2]})),{n:'Your store',r:'4.1',s:54,you:1}];
    $('rank').innerHTML='<div class="rk-list">'+all.map((x,i)=>`<div class="rk${x.you?' you':''}" data-k="${i}"><span class="pos"></span><span>${x.n}<small><i class="rt">${x.r}</i> ★</small></span><span class="sc"><i class="sv">${x.s}</i>/100</span>${x.you?'<em class="rk-up"></em>':''}</div>`).join('')+'</div>';
    const rows=[...$('rank').querySelectorAll('.rk')],list=$('rank').querySelector('.rk-list'),me=all[all.length-1],meRow=rows[rows.length-1],sv=meRow.querySelector('.sv'),rt=meRow.querySelector('.rt'),up=meRow.querySelector('.rk-up');
    let last=null,shown=54,anim;
    const place=(val)=>{me.s=val;const o=[...all].sort((a,b)=>b.s-a.s||(b.you?1:-1));
      o.forEach((x,p)=>{const r=rows[all.indexOf(x)];const y=p*RH;if(r._y!==y){r._y=y;r.style.transform=`translate3d(0,${y}px,0)`}r.querySelector('.pos').textContent=ord(p+1)});
      const pos=o.indexOf(me)+1;if(last!==null&&pos<last){up.textContent='▲ '+ord(pos);meRow.classList.remove('climb');void meRow.offsetWidth;meRow.classList.add('climb')}
      const off=Math.max(0,Math.min(all.length-5,pos-3));if(list._o!==off){list._o=off;list.style.transform=`translate3d(0,${-off*RH}px,0)`}last=pos};
    function render(){
      const target=54+fixes.reduce((a,f,i)=>a+(on[i]?f[1]:0),0);rt.textContent=(4.1+on.filter(Boolean).length*0.1).toFixed(1);
      cancelAnimationFrame(anim);const f0=shown,t0=performance.now(),D=Math.max(500,Math.abs(target-f0)*110);
      const st=t=>{const k=Math.min(1,(t-t0)/D),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;const v=Math.round(f0+(target-f0)*e);if(v!==shown||k===1){shown=v;sv.textContent=v;place(v)}if(k<1)anim=requestAnimationFrame(st)};anim=requestAnimationFrame(st);
      const left=on.filter(x=>!x).length;$('tk-loss').textContent=left?`~$${(left*275).toLocaleString('en-US')}/mo`:'$0';
    }
    rows.forEach(r=>r.style.transition='none');list.style.transition='none';place(54);last=null;void list.offsetHeight;rows.forEach(r=>r.style.transition='');list.style.transition='';
    let auto=true,timers=[];const setFix=(i,v)=>{on[i]=v;const b=document.querySelector(`.tk[data-i="${i}"]`);b.setAttribute('aria-pressed',v);b.querySelector('i').textContent=v?'✓':'✕';render()};
    const play=()=>{if(!auto)return;timers.forEach(clearTimeout);timers=[];fixes.forEach((_,i)=>timers.push(setTimeout(()=>auto&&setFix(i,true),900+i*2000)));timers.push(setTimeout(()=>{if(!auto)return;fixes.forEach((_,i)=>{on[i]=false;const b=document.querySelector(`.tk[data-i="${i}"]`);b.setAttribute('aria-pressed',false);b.querySelector('i').textContent='✕'});render();timers.push(setTimeout(play,900))},900+fixes.length*2000+3600))};
    document.querySelectorAll('.tk').forEach(b=>b.onclick=()=>{auto=false;timers.forEach(clearTimeout);const i=+b.dataset.i;setFix(i,!on[i])});
    new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){play();o.disconnect()}},{threshold:.45}).observe($('sc-phone'));
    render();
    const ph=$('sc-phone');const sec=$('score');
    const onScroll=()=>{const r=sec.getBoundingClientRect(),vh=innerHeight;let t=1-Math.min(1,Math.max(0,(r.top+r.height*0.35)/vh));const e=1-Math.pow(1-t,2);ph.style.transform=`translateY(${(1-e)*90}px) scale(${0.9+e*0.1})`};
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){addEventListener('scroll',onScroll,{passive:true});onScroll()}
  })();
  // hero: alternate Melt Club / Tito's page
  (function(){const sw=[...document.querySelectorAll('.melt-scroll .swap')];if(sw.length<2)return;let k=0;setInterval(()=>{sw[k].classList.remove('on');k=(k+1)%sw.length;sw[k].classList.add('on')},16000)})();
  // laptop before/after
  (function(){const el=$('lap');if(!el)return;const a=$('lap-a'),b=$('lap-b'),l=$('lap-l');let d=false,auto=true,t=0;
    const set=v=>{a.style.clipPath=`inset(0 0 0 ${v}%)`;l.style.left=v+'%'};
    const fx=x=>{const r=el.getBoundingClientRect();set(Math.max(0,Math.min(100,(x-r.left)/r.width*100)))};
    el.addEventListener('pointerdown',e=>{auto=false;d=true;try{el.setPointerCapture(e.pointerId)}catch(_){}fx(e.clientX)});el.addEventListener('pointermove',e=>{if(d)fx(e.clientX)});el.addEventListener('pointerup',()=>d=false);el.addEventListener('pointercancel',()=>d=false);
    set(50);
    document.querySelectorAll('.tabs2 button').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.tabs2 button').forEach(x=>x.setAttribute('aria-selected',x===btn));const k=btn.dataset.ba;b.src=`/img/${k}_b.webp`;a.src=`/img/${k}_a.webp`;set(50);el.classList.remove('swap');void el.offsetWidth;el.classList.add('swap');sweep()});
    function sweep(){const seq=[[50,0],[22,550],[78,1250],[50,1800]];let s0=null;const run=t=>{s0=s0||t;const e=t-s0;let i=seq.findIndex(x=>x[1]>e);if(i<0){set(50);return}const [v1,t1]=seq[i],[v0,t0]=seq[i-1]||seq[0];const k=t1===t0?1:(e-t0)/(t1-t0);const kk=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;set(v0+(v1-v0)*kk);requestAnimationFrame(run)};setTimeout(()=>requestAnimationFrame(run),250)}})();
  // menu sheet
  (function(){const tot=$('sh-total');if(!tot)return;const boxes=[...document.querySelectorAll('.sh-opt input')];let touched=false;
    const drop=()=>{const sh=tot.closest('.sheet');for(let n=0;n<7;n++){const c=document.createElement('span');c.className='cash-drop';c.textContent=n%3?'💵':'🪙';c.style.left=(20+Math.random()*60)+'%';c.style.animationDelay=(n*70)+'ms';sh.appendChild(c);setTimeout(()=>c.remove(),1600)}};
    const was=new WeakMap();const upd=()=>{let v=15.45;let added=false;boxes.forEach(b=>{if(b.checked&&!was.get(b))added=true;was.set(b,b.checked);b.closest('.sh-opt').classList.toggle('on',b.checked);if(b.checked)v+=+b.dataset.p});tot.textContent='CA$'+v.toFixed(2);if(added)drop();tot.classList.add('bump');setTimeout(()=>tot.classList.remove('bump'),300)};
    boxes.forEach(b=>b.addEventListener('change',()=>{touched=true;upd()}));
    const sec=$('menu');let ran=false;if('IntersectionObserver' in window){const o=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!ran){ran=true;setTimeout(()=>{if(!touched){boxes[0].checked=true;upd()}},900);setTimeout(()=>{if(!touched){boxes[1].checked=true;upd()}},1900)}},{threshold:.4});o.observe(sec)}})();
  // launch stepper with designed mini-scenes, always cycling
  (function(){const root=$('stepper');if(!root)return;
    const V=[
      `<div class="v v1"><div class="bub">Here's our menu and dish photos 📎</div><div class="files"><span class="fl"><img loading="lazy" decoding="async" src="/img/combo_b.webp" alt=""><i style="--d:0s"></i></span><span class="fl"><img loading="lazy" decoding="async" src="/img/burger_b.webp" alt=""><i style="--d:.4s"></i></span><span class="fl doc"><em>MENU</em><u></u><s></s><s></s><s></s><u></u><s></s><s></s><b>PDF</b><i style="--d:.8s"></i></span></div></div>`,
      `<div class="v v2"><div class="prev"><img loading="lazy" decoding="async" src="/img/melt_page.webp" alt=""></div><div class="col"><div class="bub them">Your new store is ready 👇</div><button type="button" class="ok" tabindex="-1">Approve</button></div></div>`,
      `<div class="v v3"><div class="store"><img loading="lazy" decoding="async" src="/img/c_melt.webp" alt=""><div><b>Your store</b><span class="live">● Live on Uber Eats &amp; DoorDash</span></div></div><div class="notif">🔔 New order · $36.20</div><div class="notif n2">🔔 New order · $24.90</div></div>`,
      `<div class="v v4"><div class="bars"><i style="--h:30%"></i><i style="--h:45%"></i><i style="--h:62%"></i><i style="--h:85%"></i></div><div class="chips"><span>Photo swapped ✓</span><span>Promo adjusted ✓</span></div></div>`];
    const steps=[
      ['You send your menu and your dishes','Your current menu and simple phone photos of each dish. That\'s all we need from you.'],
      ['You approve everything in one message','Menu with combos and add-ons, photos in one style, prices and launch offers. You say yes or ask for changes.'],
      ['You\'re live on Uber Eats and DoorDash','We set up the store through our contacts at both platforms, so you skip the general queue.'],
      ['Tuned for 30 days','We watch the numbers and fix what doesn\'t sell: photos, prices, offers, ads.']];
    const btns=[...root.querySelectorAll('.st-days button')],card=$('st-card');let i=0,pauseUntil=0;
    const go=n=>{i=n;btns.forEach((b,j)=>b.setAttribute('aria-selected',j===i));$('st-fill').style.width=((i+1)*25)+'%';$('st-vis').innerHTML=V[i];$('st-h').textContent=steps[i][0];$('st-p').textContent=steps[i][1];card.classList.remove('swap');void card.offsetWidth;card.classList.add('swap')};
    btns.forEach((b,j)=>b.onclick=()=>{pauseUntil=Date.now()+7000;go(j)});
    go(0);setInterval(()=>{if(Date.now()>pauseUntil)go((i+1)%4)},3600)})();
  // earnings calculator
  (function(){const o=$('c-orders');if(!o)return;const a=$('c-aov'),lev=[...document.querySelectorAll('.lev input')];
    const money=v=>'$'+Math.round(v).toLocaleString('en-US');
    const cols=['#FF5A00','#FF8A3D','#FFB37A','#FFD4B0','#5BE38E'];
    function renderBrk(od,av){let o=od,b=av,parts=[];lev.forEach((x,i)=>{const name=x.parentElement.querySelector('span').textContent;let gain=0;if(x.checked){if(x.dataset.o){gain=(o*(+x.dataset.o))*b*30;o*=1+(+x.dataset.o)}if(x.dataset.b){gain=o*b*(+x.dataset.b)*30;b*=1+(+x.dataset.b)}}parts.push([name,gain,cols[i]])});
      const tot=parts.reduce((a,p)=>a+p[1],0)||1;
      $('brk').innerHTML='<div class="brk-bar">'+parts.map(p=>`<i style="width:${p[1]/tot*100}%;background:${p[2]}"></i>`).join('')+'</div>'+parts.map(p=>`<div class="brk-row"><span><i style="background:${p[2]}"></i>${p[0]}</span><b>${p[1]?'+'+money(p[1]):'—'}</b></div>`).join('')}
    function upd(){const od=+o.value,av=+a.value;$('c-orders-v').textContent=od;$('c-aov-v').textContent='$'+av;
      let mo=1,mb=1;lev.forEach(x=>{if(x.checked){if(x.dataset.o)mo*=1+(+x.dataset.o);if(x.dataset.b)mb*=1+(+x.dataset.b)}});
      const now=od*av*30,nw=od*mo*av*mb*30,extra=nw-now;$('c-month').textContent='+'+money(extra);$('c-year').textContent=`That's about ${money(extra*12)} a year.`;
      renderBrk(od,av)}
    [o,a,...lev].forEach(x=>x.addEventListener('input',upd));lev.forEach(x=>x.addEventListener('change',upd));upd()})();
  // add-on basket animation (auto loop, click to replay)
  (function(){const box=$('addon');if(!box)return;const fly=$('ad-fly'),bk=$('ad-basket'),tot=$('ad-tot'),plus=$('ad-plus');let busy=false;
    const count=(a,b)=>{let s0=null;const st=t=>{s0=s0||t;const k=Math.min(1,(t-s0)/700);tot.textContent='$'+(a+(b-a)*k).toFixed(2);if(k<1)requestAnimationFrame(st)};requestAnimationFrame(st)};
    function play(){if(busy)return;busy=true;tot.textContent='$15.45';fly.classList.remove('go');void fly.offsetWidth;fly.classList.add('go');
      setTimeout(()=>{bk.classList.remove('hit');void bk.offsetWidth;bk.classList.add('hit');plus.classList.remove('go');void plus.offsetWidth;plus.classList.add('go');const c=$('ad-cash');c.classList.remove('go');void c.offsetWidth;c.classList.add('go');count(15.45,23.44)},1150);
      setTimeout(()=>busy=false,2200)}
    box.addEventListener('click',play);box.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
    play();setInterval(play,4200)})();
  // hero: the screen stays still; each detail pops out a little bigger, with a buzz and a label
  (function(){const gx=$('gx');if(!gx)return;const img=$('gx-img'),stage=gx.closest('.stage'),pop=$('pop'),cap=$('pop-cap');
    // [centerX%, centerY%, width%, height%] of the page image, label, scale
    const pages=[
      {src:'/img/melt_page.webp',name:'Melt Club · Uber Eats',steps:[[50,5,100,10,'An attractive banner',1.03],[29,13.35,22,1.9,'4.7★ · good ratings',1.18],[26,42.6,46,17.6,'Photos that make you hungry',1.06],['scroll'],[50,69.4,94,11.6,'One clean photo style',1.04],[26,79.9,46,5,'Descriptions that sell',1.1],['top']]},
      {src:'/img/titos_page.webp',name:"Tito's Kitchen · Uber Eats",steps:[[15.5,22.8,26,2.3,'4.5★ · 1,000+ ratings',1.18],[22,24.5,40,2.3,'600+ people reordered',1.15],[40,50.6,80,4.6,'Best sellers up front',1.07],['scroll'],[26,71,46,12,'Combos that raise the basket',1.06],[24,81.5,44,3.2,'Clear deals: save $2.50',1.12],['top']]}];
    let pi=0,si=0,score=5.0;
    const setScore=v=>{$('gx-score').textContent=v.toFixed(1);$('gx-bar').style.width=v*10+'%'};
    const hide=()=>{pop.classList.remove('show');cap.classList.remove('show')};
    function show(cx,cy,w,h,txt,z){const sr=stage.getBoundingClientRect(),ir=img.getBoundingClientRect();
      const L=ir.left-sr.left+ir.width*(cx-w/2)/100,T=ir.top-sr.top+ir.height*(cy-h/2)/100,PW=ir.width*w/100,PH=ir.height*h/100;
      Object.assign(pop.style,{left:L+'px',top:T+'px',width:PW+'px',height:PH+'px',backgroundImage:`url(${img.src})`,backgroundSize:`${ir.width}px ${ir.height}px`,backgroundPosition:`${-ir.width*(cx-w/2)/100}px ${-ir.height*(cy-h/2)/100}px`});
      pop.style.setProperty('--z',z);cap.textContent=txt;
      const below=T+PH/2<sr.height*0.6;const capTop=below?T+PH/2+PH*z/2+10:T+PH/2-PH*z/2-44;cap.style.left=(L+PW/2)+'px';cap.style.top=capTop+'px';
      void pop.offsetWidth;pop.classList.add('show');cap.classList.add('show')}
    function step(){const pg=pages[pi],st=pg.steps[si];hide();
      if(st[0]==='scroll')gx.style.transform='translateY(-43%)';
      else if(st[0]==='top')gx.style.transform='none';
      else{setTimeout(()=>show(...st),350);score=Math.min(9.2,score+0.85);setScore(score)}
      si++;if(si>=pg.steps.length){si=0;setTimeout(()=>{pi=(pi+1)%pages.length;img.style.opacity=.01;setTimeout(()=>{img.src=pages[pi].src;$('gx-store').textContent=pages[pi].name;img.style.opacity=1;score=5.0;setScore(score)},600)},1300)}}
    gx.style.transform='none';$('gx-store').textContent=pages[0].name;setTimeout(()=>{step();setInterval(step,2700)},900)})();
  // Melt Club: rotating results + clickable chips
  (function(){const ws=[...document.querySelectorAll('#mrot em')],cs=[...document.querySelectorAll('#mchips button')];if(!ws.length)return;let k=0,hold=0;
    const go=n=>{if(n===k)return;const prev=ws[k];prev.classList.remove('on');prev.classList.add('off');setTimeout(()=>prev.classList.remove('off'),500);cs[k].classList.remove('on');k=n;ws[k].classList.add('on');cs[k].classList.add('on')};
    cs.forEach((c,j)=>c.onclick=()=>{hold=Date.now()+6000;go(j)});
    setInterval(()=>{if(Date.now()>hold)go((k+1)%ws.length)},1800)})();
  // stat underline when counted
  document.querySelectorAll('.stat b[data-count]').forEach(b=>{const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){setTimeout(()=>b.classList.add('counted'),300);o.disconnect()}},{threshold:.5});o.observe(b)});
  // laptop: peek once when it enters view
  (function(){const el=$('lap');if(!el)return;const a=$('lap-a'),l=$('lap-l');let touched=false;el.addEventListener('pointerdown',()=>touched=true);
    const set=v=>{a.style.clipPath=`inset(0 0 0 ${v}%)`;l.style.left=v+'%'};
    const peek=()=>{const seq=[[50,0],[18,700],[82,1500],[50,2200]];let s0=null,from=50;const run=t=>{if(touched)return;s0=s0||t;const e=t-s0;let i=seq.findIndex(x=>x[1]>e);if(i<0){set(50);return}const [v1,t1]=seq[i],[v0,t0]=seq[i-1]||seq[0];const k=t1===t0?1:(e-t0)/(t1-t0);const kk=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;set(v0+(v1-v0)*kk);requestAnimationFrame(run)};requestAnimationFrame(run)};
    if('IntersectionObserver' in window){const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){setTimeout(peek,400);o.disconnect()}},{threshold:.5});o.observe(el)}})();
  // hand: crisp screenshot mapped onto the phone with a perspective transform
  (function(){const box=document.querySelector('.hand'),bg=$('hand-bg'),scr=$('hand-scr');if(!box||!scr)return;
    const QQ=[[574.9,86.6],[752.9,61.0],[877.2,474.4],[704.2,514.5]].map(p=>[p[0]/1024,p[1]/640]);
    function solve(A,b){const n=8;for(let i=0;i<n;i++){let m=i;for(let r=i+1;r<n;r++)if(Math.abs(A[r][i])>Math.abs(A[m][i]))m=r;[A[i],A[m]]=[A[m],A[i]];[b[i],b[m]]=[b[m],b[i]];for(let r=i+1;r<n;r++){const f=A[r][i]/A[i][i];for(let c=i;c<n;c++)A[r][c]-=f*A[i][c];b[r]-=f*b[i]}}const x=Array(n).fill(0);for(let i=n-1;i>=0;i--){let v=b[i];for(let c=i+1;c<n;c++)v-=A[i][c]*x[c];x[i]=v/A[i][i]}return x}
    function place(){const W=box.clientWidth,H=box.clientHeight;const iw=1024,ih=640;const sc=Math.max(W/iw,H/ih);const ox=(W-iw*sc)/2,oy=(H-ih*sc)/2;
      const pos=getComputedStyle(bg).objectPosition.split(' ');const px=parseFloat(pos[0])/100||.5;const ox2=(W-iw*sc)*px;
      const dst=QQ.map(p=>[ox2+p[0]*iw*sc,oy+p[1]*ih*sc]);const w=280,h=Math.round(w*2.17);const src=[[0,0],[w,0],[w,h],[0,h]];
      const A=[],b=[];for(let i=0;i<4;i++){const [x,y]=src[i],[u,v]=dst[i];A.push([x,y,1,0,0,0,-u*x,-u*y]);b.push(u);A.push([0,0,0,x,y,1,-v*x,-v*y]);b.push(v)}
      const k=solve(A,b);scr.style.width=w+'px';scr.style.height=h+'px';scr.style.transform=`matrix3d(${k[0]},${k[3]},0,${k[6]},${k[1]},${k[4]},0,${k[7]},0,0,1,0,${k[2]},${k[5]},0,1)`}
    bg.style.transform='none';bg.style.transition='none';place();addEventListener('resize',place);if(!bg.complete)bg.addEventListener('load',place);new ResizeObserver(place).observe(box);
    box.addEventListener('mousemove',e=>{const r=box.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;box.style.transform=`perspective(1200px) rotateY(${x*3}deg) rotateX(${-y*3}deg)`});box.addEventListener('mouseleave',()=>box.style.transform='none')})();
  // band: Evergreen before/after toggle
  (function(){const bp=[...document.querySelectorAll('.bp')];if(bp.length<2)return;let k=0;setInterval(()=>{bp[k].classList.remove('on');k=1-k;bp[k].classList.add('on');const l=$('bp-lbl');l.textContent=k?'After':'Before';l.classList.toggle('after',!!k)},2600)})();
  const fl=$('f-launch'),fg=$('f-grow');if(fl){const setF=k=>{fl.setAttribute('aria-pressed',k==='launch');fg.setAttribute('aria-pressed',k==='grow');$('q-launch').hidden=k!=='launch';$('q-grow').hidden=k!=='grow'};fl.onclick=()=>setF('launch');fg.onclick=()=>setF('grow');
  $('form').addEventListener('submit',async e=>{e.preventDefault();
    const v=id=>{const x=$(id);return x?x.value.trim():''};const name=v('f-fullname'),email=v('f-email');
    if(!name||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){$('form-err').hidden=false;return}$('form-err').hidden=true;
    const cal='https://calendly.com/hello-deliveryedge/30min?name='+encodeURIComponent(name)+'&email='+encodeURIComponent(email);
    if(v('f-gotcha')){location.href=cal;return}
    const btn=$('f-submit');btn.disabled=true;btn.textContent='Sending...';
    const launch=$('f-launch').getAttribute('aria-pressed')==='true';const parts=name.split(/\s+/);
    const plan=(document.querySelector('.ofr [aria-checked=true]')||{}).dataset?.plan||'unsure';
    const PL={audit:'Store Audit',grow:'Grow',launch:'Launch',concept:'Brand concept',unsure:'Not sure yet'};
    const GO={audit:'full_audit',grow:'more_orders',launch:'full_launch',concept:'full_launch',unsure:launch?'full_launch':'more_orders'};
    const fd=new FormData();const add=(k,x)=>{if(x)fd.append(k,x)};
    add('_subject','New DeliveryEdge Strategy Call Request');add('_replyto','hello@deliveryedge.co');
    add('first_name',parts[0]);add('last_name',parts.slice(1).join(' '));add('email',email);add('phone',v('f-phone'));
    add('brand_name',v('f-name'));add('notes',v('f-notes'));add('plan',PL[plan]);add('goal',GO[plan]);add('source','website v2');
    if(launch){add('profile','launching_new');add('cuisine',v('f-cuisine'));add('city',v('f-city'))}else{add('profile','existing_ghost');add('store_link',v('f-link'))}
    try{const r=await fetch('https://formspree.io/f/mvzddwne',{method:'POST',body:fd,headers:{Accept:'application/json'}});if(!r.ok)console.error('Formspree',r.status,await r.text())}catch(err){console.error(err)}
    location.href=cal})}
})();

(function(){const b=document.getElementById('burger'),m=document.getElementById('mnav');if(!b||!m)return;
  const set=o=>{m.hidden=!o;b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu');document.body.classList.toggle('mn-open',o)};
  b.addEventListener('click',e=>{e.stopPropagation();set(m.hidden)});m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});addEventListener('resize',()=>{if(innerWidth>960)set(false)})})();
(function(){const F={wave:['c_wave1','c_wave2'],idle:['c_idle'],blink:['c_blink'],think:['c_think'],tablet:['c_tablet'],bags:['c_bags'],ok:['c_ok'],look:['c_look']};
document.querySelectorAll('.mascot[data-seq]:not([data-video])').forEach(m=>{
  const seq=m.dataset.seq.split(','),need=new Set(['blink','idle']);seq.forEach(s=>need.add(s));
  const names=[...new Set([...need].flatMap(k=>F[k]))];
  m.innerHTML=names.map((n,i)=>`<img loading="lazy" decoding="async" src="/img/${n}.webp" data-n="${n}" alt="${i?'':(m.dataset.alt||'')}" ${i?'aria-hidden="true"':''}>`).join('');
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

(function(){const li=[...document.querySelectorAll('#hiw-steps li')];if(!li.length)return;let k=0,hold=false;const sec=document.getElementById('how');sec.addEventListener('mouseenter',()=>hold=true);sec.addEventListener('mouseleave',()=>hold=false);setInterval(()=>{if(hold||document.hidden)return;li[k].classList.remove('on');k=(k+1)%li.length;li[k].classList.add('on')},4200);
  li.forEach((x,j)=>x.addEventListener('mouseenter',()=>{li.forEach(y=>y.classList.remove('on'));x.classList.add('on');k=j}));
})();
(function(){
const mk=(src,loop)=>{const v=document.createElement('video');v.muted=true;v.loop=loop;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('muted','');v.preload='none';v.className='mv';const b=src.replace(/\.mp4$/,'');v.poster=b+'.webp';[['webm','video/webm'],['mp4','video/mp4']].forEach(([e,t])=>{const s=document.createElement('source');s.src=b+'.'+e;s.type=t;v.appendChild(s)});return v};
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



(function(){const D={kitchen:[["We find the concept your kitchen can carry","We look at what people order near you and what's missing. You get 3 brand ideas that use your equipment and staff."],["We write the menu and shoot nothing","Name, menu, combos, prices and photos, built from your phone pictures."],["We put it live next to your dine-in","A second brand from the same kitchen and the same ingredients. Our own test, Melt Club, adds about CA$2,000 a week."]],
recipe:[["We check if your dish sells in your area","Before you spend a dollar, we look at demand and competitors around your address."],["We turn one recipe into a full menu","Sizes, sides, combos and add-ons, so every order is worth more."],["We find you a kitchen setup that fits","Your own space, a shared kitchen or a partner restaurant. We tell you what makes sense."]],
idea:[["We test the idea on paper first","A 30-minute call: we tell you honestly if it can work on delivery, and why."],["We shape it into a brand","Name, look and a short menu built for the apps, not for a dining room."],["You launch only when the numbers make sense","No store goes live until you know what it costs and what it can bring in."]]};
const bs=[...document.querySelectorAll('.us-pick button')];if(!bs.length)return;const cards=[...document.querySelectorAll('.us-card')];
const set=k=>{bs.forEach(b=>b.setAttribute('aria-selected',b.dataset.k===k));cards.forEach((c,i)=>{c.classList.add('flip');setTimeout(()=>{document.getElementById('us-'+(i+1)).textContent=D[k][i][0];document.getElementById('us-'+(i+1)+'p').textContent=D[k][i][1];c.classList.remove('flip')},140+i*70)})};
bs.forEach(b=>b.addEventListener('click',()=>set(b.dataset.k)));set('kitchen')})();
(function(){const l=document.getElementById('lean');if(!l)return;const c=l.closest('.calc');let t;
 const nod=()=>{clearTimeout(t);l.classList.remove('nod');void l.offsetWidth;l.classList.add('nod');t=setTimeout(()=>l.classList.remove('nod'),520)};
 c.querySelectorAll('input').forEach(i=>i.addEventListener('change',nod));
 new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){c.classList.add('in');o.disconnect()}},{threshold:.3}).observe(c)})();

(function(){const b=document.querySelector('.u3 .u-num b');if(!b)return;const li=b.closest('li');let r;
const run=()=>{cancelAnimationFrame(r);const a=+b.dataset.a,z=+b.dataset.b,t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/2200);b.textContent=Math.round(a+(z-a)*(1-Math.pow(1-k,3)));if(k<1)r=requestAnimationFrame(f)};r=requestAnimationFrame(f)};
new MutationObserver(()=>{if(li.classList.contains('on'))run()}).observe(li,{attributes:true,attributeFilter:['class']})})();

(function(){const hp=document.getElementById('hp');if(!hp)return;const li=[...document.querySelectorAll('#hiw-steps li')];
const sync=()=>{const k=li.findIndex(x=>x.classList.contains('on'));if(k>-1&&hp.dataset.s!=k)hp.dataset.s=k};
li.forEach(x=>new MutationObserver(sync).observe(x,{attributes:true,attributeFilter:['class']}));sync()})();

(function(){const cs=[...document.querySelectorAll('.us-card')];if(!cs.length)return;let k=0,hold=false;const sec=document.getElementById('unsure');
const out=document.querySelector('.us-out');const act=i=>{cs.forEach((c,j)=>c.classList.toggle('act',j===i));if(out)out.dataset.k=i};act(0);
cs.forEach((c,i)=>c.addEventListener('mouseenter',()=>{hold=true;k=i;act(i)}));sec.querySelector('.us-out').addEventListener('mouseleave',()=>hold=false);
const L={kitchen:'Get 3 brand ideas for my kitchen',recipe:'Check if my recipe sells near me',idea:'Test my idea on a free call'};const cta=document.getElementById('us-cta');
document.querySelectorAll('.us-pick button').forEach(b=>b.addEventListener('click',()=>{k=0;act(0);if(cta){cta.textContent=L[b.dataset.k];cta.classList.remove('pop');void cta.offsetWidth;cta.classList.add('pop')}}));
setInterval(()=>{if(hold||document.hidden)return;k=(k+1)%cs.length;act(k)},3200)})();

(function(){const t=document.querySelector('.wf-tabs');if(!t)return;const bs=[...t.querySelectorAll('button')],u=t.querySelector('u');
const mv=b=>{u.style.width=b.offsetWidth+'px';u.style.transform=`translateX(${b.offsetLeft-5}px)`};
const go=b=>{bs.forEach(x=>{x.setAttribute('aria-selected',x===b);document.getElementById(x.dataset.p).classList.toggle('on',x===b)});mv(b);
  const p=document.getElementById(b.dataset.p);p.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));};
bs.forEach(b=>b.addEventListener('click',()=>go(b)));requestAnimationFrame(()=>mv(bs[0]));addEventListener('resize',()=>mv(bs.find(b=>b.getAttribute('aria-selected')==='true')));
if(location.hash==='#menu')go(bs[1])})();

(function(){const bs=[...document.querySelectorAll('.ofr button')];if(!bs.length)return;const pick=k=>bs.forEach(b=>b.setAttribute('aria-checked',b.dataset.plan===k));bs.forEach(b=>b.addEventListener('click',()=>pick(b.dataset.plan)));
const q=new URLSearchParams(location.search).get('plan');if(q&&bs.some(b=>b.dataset.plan===q)){pick(q);if(q==='launch'||q==='concept'){const l=document.getElementById('f-launch');l&&l.click()}}})();