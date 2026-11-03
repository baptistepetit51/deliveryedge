(function(){
  const L={launch:{name:'Launch package',total:1800,items:[['Delivery menu built from zero','incl.'],['Modifiers, combos and add-ons','incl.'],['35 dish photos, one style','incl.'],['Brand look and banner','incl.'],['Uber Eats + DoorDash setup','incl.'],['14-day launch plan','incl.'],['30 days of tuning','incl.']]},
           grow:{name:'Grow package',total:1200,items:[['Menu rebuilt to sell','incl.'],['Combos and add-ons','incl.'],['25 dish photos, one style','incl.'],['New banner','incl.'],['Offers and in-app ads plan','incl.'],['Put live by us','incl.'],['30 days of tuning','incl.']]}};
  const tg=document.querySelector('.pr-toggle');if(!tg){const lp=document.querySelector('.plan[data-plan="launch"]');if(lp)lp.classList.add('pick')}
  if(tg){const bs=[...tg.querySelectorAll('button')],list=$('rc-list'),tot=$('rc-total');let cur='launch',auto=true;
  function show(w){cur=w;tg.classList.toggle('grow',w==='grow');bs.forEach(b=>b.setAttribute('aria-pressed',b.dataset.who===w));
    $('rc-plan').textContent=L[w].name;list.innerHTML='';L[w].items.forEach((it,i)=>{const li=document.createElement('li');li.style.animationDelay=(i*90)+'ms';li.innerHTML=`<span>${it[0]}</span><em>${it[1]}</em>`;list.appendChild(li)});
    tot.dataset.prefix='$';countUp(tot,w==='launch'?1200:1800,L[w].total,900);const rg=$('rc-reg');if(rg)rg.textContent=w==='launch'?'$2,200':'$1,500';
    document.querySelectorAll('.plan').forEach(p=>p.classList.toggle('pick',p.dataset.plan===w))}
  bs.forEach(b=>b.onclick=()=>{auto=false;show(b.dataset.who)});show('launch');
  setInterval(()=>{if(auto)show(cur==='launch'?'grow':'launch')},5000);}
  // payback
  const o=$('py-orders'),a=$('py-aov');let price=1200;
  const money=v=>'$'+Math.round(v).toLocaleString('en-US');
  function calc(){const keep=+o.value*30*+a.value*.4;$('py-o').textContent=o.value;$('py-a').textContent='$'+a.value;$('py-keep').textContent=money(keep);
    const days=Math.max(1,Math.round(price/(keep/30)));$('py-days').textContent=days<60?days+' days':(days/30).toFixed(1)+' months';
    $('py-year').textContent=(keep*12-price>=0?'+':'')+money(keep*12-price);
    const pct=Math.min(100,days/90*100);$('py-fill').style.width=Math.max(4,100-pct*0.85)+'%';const m=$('py-mark');m.style.left=Math.max(8,Math.min(92,100-pct*0.85))+'%';m.textContent='Paid back · day '+days}
  [o,a].forEach(x=>x.addEventListener('input',calc));
  document.querySelectorAll('.pay-plans button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.pay-plans button').forEach(x=>x.setAttribute('aria-pressed',x===b));price=+b.dataset.p;calc()});calc();
})();

(function(){
  const V={launch:{price:1800,rows:[['Account setup through our contacts','Uber Eats and DoorDash, skip the queue'],['Delivery menu built from zero','Categories, combos, modifiers, upsells'],['Up to 35 dish photos','One style, from your real food'],['Brand look','Logo cleanup, colors, banner'],['Prices after commission','Dish by dish, so every order pays'],['Store settings','Hours, prep time, tags'],['14-day launch plan','New-customer offers and in-app ads'],['30 days of tuning','We watch the numbers and fix what doesn\'t sell']]},
           grow:{price:1200,rows:[['Full store audit','Score out of 100 vs your competitors'],['Menu rebuilt to sell','Categories, combos, modifiers, add-ons'],['Up to 25 dish photos','One style, from your real food'],['New banner and store look','Your best dish, front and center'],['Prices checked','Against your margin after commission'],['Offers and ads plan','New-customer offers, in-app ads'],['Put live on both apps','We enter everything, you touch nothing'],['30 days of tuning','We watch the numbers and fix what doesn\'t sell']]}};
  const rows=$('sk-rows'),btns=[...document.querySelectorAll('.vs-tg button')],pay=document.querySelector('.sk-pay');let timer=[],ran=false,cur='launch';
  const money=v=>'$'+Math.round(v).toLocaleString('en-US');
  function play(w){cur=w;timer.forEach(clearTimeout);timer=[];btns.forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===w));const d=V[w];
    rows.innerHTML=d.rows.map(r=>`<div class="sk-row"><i>✓</i><div><b>${r[0]}</b><small>${r[1]}</small></div></div>`).join('');
    pay.classList.remove('on');$('vs-pay').textContent=money(d.price);$('vs-price').textContent=money(d.price);
    const vc=$('vv-chips'),P=[[2,6],[58,2],[-4,30],[64,26],[0,54],[66,50],[4,78],[60,74]];vc.innerHTML=d.rows.map((r,i)=>`<span class="vv-c" style="left:${P[i][0]}%;top:${P[i][1]}%"><i>✓</i>${r[0].replace(/ through our contacts| built from zero| rebuilt to sell/,'')}</span>`).join('');const live=document.querySelector('.vv-live');live.classList.remove('on');
    [...rows.children].forEach((el,i)=>timer.push(setTimeout(()=>{el.classList.add('on');vc.children[i]&&vc.children[i].classList.add('on')},200+i*200)));
    timer.push(setTimeout(()=>live.classList.add('on'),200+d.rows.length*200+300));
    timer.push(setTimeout(()=>pay.classList.add('on'),200+d.rows.length*200+150))}
  btns.forEach(b=>b.onclick=()=>play(b.dataset.v));
  document.querySelectorAll('.pr-toggle button').forEach(b=>b.addEventListener('click',()=>{if(ran)play(b.dataset.who)}));
  new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){ran=true;play(cur);o.disconnect()}},{threshold:.3}).observe($('stack'));
  const dl=Math.max(0,Math.ceil((new Date('2026-12-31T23:59:59')-new Date())/864e5));const fd=$('fd-days');if(fd)fd.textContent=dl;
})();

(function(){if(!matchMedia('(hover:hover)').matches)return;document.querySelectorAll('.plan').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-6px)`});c.addEventListener('mouseleave',()=>c.style.transform='')})})();

(function(){const b=document.querySelector('.chef-band');if(!b)return;const m=b.querySelector('.mascot');let t,last=0;
const go=()=>{const n=Date.now();if(n-last<2500)return;last=n;b.classList.add('talk');m&&m._replay&&m._replay();clearTimeout(t);t=setTimeout(()=>b.classList.remove('talk'),3200)};
b.addEventListener('mouseenter',go);b.addEventListener('click',e=>{if(!e.target.closest('a'))go()});
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){setTimeout(()=>{b.classList.add('talk');t=setTimeout(()=>b.classList.remove('talk'),3200)},1400);o.disconnect()}},{threshold:.5}).observe(b)})();