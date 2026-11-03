(function(){
  const S=[
    {img:'/img/tito_kitchen.webp',tag:'Where it started',h:'My first delivery-only kitchen.',p:'No dining room, no foot traffic. Just the apps. We grew it to 80 to 100 orders a day, and I learned what makes a store sell.',st:[['80–100','orders a day']]},
    {img:'/img/tito_bnc.webp',tag:'Brands and lessons',h:'More brands. More mistakes.',p:'Chick\'n\'Crunch, Brick\'n\'Cheese, Tito\'s Kitchen, across Seattle, Vancouver and Toronto. Too many promos, ads that burned money, a brand we had to close. Every mistake became a rule.',st:[['5','brands of our own']]},
    {img:'/img/melt_bag.webp',tag:'The playbook, tested',h:'Melt Club, built from zero.',p:'A second brand we launched as a test, from a kitchen we already had. Same ingredients, same team, no Instagram, no influencers. Only the store and in-app ads. In its second month, sales went up 142%, about CA$2,000 more a week.',st:[['+142%','sales in 30 days'],['16.8x','return on ads']]},
    {img:'/img/story_team.webp',tag:'DeliveryEdge',h:'Now I build stores for restaurants.',p:'The same playbook, for kitchens that don\'t have the time to learn the apps. Our first clients are rebuilding with us in Ottawa.',st:[['14','days to go live, about']]}];
  const bs=[...document.querySelectorAll('.tl-years button')],card=$('tl-card');let i=0,hold=0;
  function go(n){i=n;const s=S[n];bs.forEach((b,j)=>b.setAttribute('aria-selected',j===n));$('tl-fill').style.width=((n+1)*25)+'%';
    $('tl-img').src=s.img;$('tl-img').classList.toggle('fit',/bag/.test(s.img));$('tl-tag').textContent=s.tag;$('tl-h').textContent=s.h;$('tl-p').textContent=s.p;
    $('tl-stat').innerHTML=s.st.map(x=>`<span><b>${x[0]}</b>${x[1]}</span>`).join('');card.classList.remove('swap');void card.offsetWidth;card.classList.add('swap')}
  bs.forEach((b,j)=>b.onclick=()=>{hold=Date.now()+8000;go(j)});go(0);setInterval(()=>{if(Date.now()>hold)go((i+1)%S.length)},4200);
})();