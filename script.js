/* CURSOR */
var cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
var cx=0,cy=0,tx=0,ty=0;
document.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;cur.style.left=tx+'px';cur.style.top=ty+'px';});
document.addEventListener('mousedown',function(){document.body.classList.add('clicking');});
document.addEventListener('mouseup',function(){document.body.classList.remove('clicking');});
(function loop(){cx+=(tx-cx)*.1;cy+=(ty-cy)*.1;cur2.style.left=cx+'px';cur2.style.top=cy+'px';requestAnimationFrame(loop);})();

/* THREE.JS */
try{(function(){
  if(window.innerWidth<900||typeof THREE==='undefined')return;
  var cv=document.getElementById('bg3d');
  var R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});
  R.setSize(innerWidth,innerHeight);R.setPixelRatio(Math.min(devicePixelRatio,2));
  var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,100);
  C.position.z=5;
  S.add(new THREE.AmbientLight(0xffffff,.35));
  var l1=new THREE.DirectionalLight(0xc9a84c,1.1);l1.position.set(5,5,5);S.add(l1);
  var l2=new THREE.DirectionalLight(0xb83228,.65);l2.position.set(-5,-3,2);S.add(l2);
  var geos=[new THREE.OctahedronGeometry(.07),new THREE.TetrahedronGeometry(.06),new THREE.IcosahedronGeometry(.055)];
  var mats=[
    new THREE.MeshStandardMaterial({color:0xc9a84c,metalness:.9,roughness:.1,transparent:true,opacity:.6}),
    new THREE.MeshStandardMaterial({color:0xb83228,metalness:.8,roughness:.2,transparent:true,opacity:.5}),
    new THREE.MeshStandardMaterial({color:0xeeeae0,metalness:.95,roughness:.05,transparent:true,opacity:.3})
  ];
  var pts=[];
  for(var i=0;i<65;i++){
    var m=new THREE.Mesh(geos[i%3],mats[i%3]);
    m.position.set((Math.random()-.5)*20,(Math.random()-.5)*14,(Math.random()-.5)*8-2);
    m.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);
    m.userData={vx:(Math.random()-.5)*.004,vy:(Math.random()-.5)*.003,rx:Math.random()*.008,ry:Math.random()*.007};
    S.add(m);pts.push(m);
  }
  var KG=new THREE.Group();
  KG.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(.032,3.5,.009),new THREE.MeshStandardMaterial({color:0xdde8f0,metalness:1,roughness:.04})),{}));
  var em=new THREE.Mesh(new THREE.BoxGeometry(.002,3.5,.001),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0x88aaff,emissiveIntensity:2}));
  em.position.x=.017;KG.add(em);
  KG.add(Object.assign(new THREE.Mesh(new THREE.TorusGeometry(.1,.026,8,20),new THREE.MeshStandardMaterial({color:0xc9a84c,metalness:.9,roughness:.15})),{position:{x:0,y:-1.75,z:0}}));
  var hm=new THREE.Mesh(new THREE.CylinderGeometry(.03,.036,.72,8),new THREE.MeshStandardMaterial({color:0x2a1d0f,metalness:.3,roughness:.8}));
  hm.position.y=-2.15;KG.add(hm);
  KG.position.set(3.1,0,-1);KG.rotation.z=.4;S.add(KG);
  var pG=new THREE.PlaneGeometry(.11,.08);
  var pM=new THREE.MeshStandardMaterial({color:0xffb0c0,side:THREE.DoubleSide,transparent:true,opacity:.6});
  var petals=[];
  for(var j=0;j<22;j++){
    var p=new THREE.Mesh(pG,pM);
    p.position.set((Math.random()-.5)*18,Math.random()*12-3,(Math.random()-.5)*5-2);
    p.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);
    p.userData={s:.005+Math.random()*.007,d:(Math.random()-.5)*.003,sp:Math.random()*.018};
    S.add(p);petals.push(p);
  }
  var mx=0,my=0;
  document.addEventListener('mousemove',function(e){mx=(e.clientX/innerWidth-.5)*2;my=-(e.clientY/innerHeight-.5)*2;});
  window.addEventListener('resize',function(){C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();R.setSize(innerWidth,innerHeight);});
  var t=0;
  (function anim(){requestAnimationFrame(anim);t+=.01;
    pts.forEach(function(p){p.position.x+=p.userData.vx;p.position.y+=p.userData.vy;p.rotation.x+=p.userData.rx;p.rotation.y+=p.userData.ry;if(Math.abs(p.position.x)>11)p.userData.vx*=-1;if(Math.abs(p.position.y)>8)p.userData.vy*=-1;});
    KG.rotation.z=.4+Math.sin(t*.55)*.04+my*.05;KG.rotation.y=mx*.08;KG.position.y=Math.sin(t*.48)*.15;
    em.material.emissiveIntensity=1.4+Math.sin(t*1.4)*.8;
    petals.forEach(function(p){p.position.y-=p.userData.s;p.position.x+=p.userData.d;p.rotation.z+=p.userData.sp;if(p.position.y<-8){p.position.y=8;p.position.x=(Math.random()-.5)*18;}});
    C.position.x+=(mx*.3-C.position.x)*.02;C.position.y+=(my*.2-C.position.y)*.02;
    R.render(S,C);
  })();
})();}catch(e){console.warn('Three.js:',e);}

/* 2D PARTICLES */
(function(){
  if(window.innerWidth<900)return;
  var c=document.getElementById('bgp'),ctx=c.getContext('2d');
  c.width=innerWidth;c.height=innerHeight;
  var dots=[];
  for(var i=0;i<50;i++)dots.push({x:Math.random()*c.width,y:Math.random()*c.height,r:.5+Math.random()*1.1,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,a:.08+Math.random()*.3});
  (function draw(){
    requestAnimationFrame(draw);ctx.clearRect(0,0,c.width,c.height);
    dots.forEach(function(d){d.x+=d.vx;d.y+=d.vy;if(d.x<0||d.x>c.width)d.vx*=-1;if(d.y<0||d.y>c.height)d.vy*=-1;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle='rgba(201,168,76,'+d.a+')';ctx.fill();});
    for(var i=0;i<dots.length;i++)for(var j=i+1;j<dots.length;j++){var dx=dots[i].x-dots[j].x,dy=dots[i].y-dots[j].y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<105){ctx.beginPath();ctx.moveTo(dots[i].x,dots[i].y);ctx.lineTo(dots[j].x,dots[j].y);ctx.strokeStyle='rgba(201,168,76,'+(0.045*(1-dist/105))+')';ctx.lineWidth=.5;ctx.stroke();}}
  })();
  window.addEventListener('resize',function(){c.width=innerWidth;c.height=innerHeight;});
})();

/* SWORD DRAW */
(function(){
  var intro=document.getElementById('intro');
  var mainEl=document.getElementById('main');
  var blade=document.getElementById('blade');
  var slash=document.getElementById('slash');
  var sp=document.getElementById('speedlines');
  var sw=document.getElementById('sw');
  var dh=document.getElementById('dh');
  var fills=[document.getElementById('dp1'),document.getElementById('dp2'),document.getElementById('dp3'),document.getElementById('dp4')];
  var prog=0,drag=false,sx=0,spg=0,lx=0,lt=0,vel=0,flashed=false,done=false,SS=0.135;

  mainEl.style.opacity='0';
  mainEl.style.transition='opacity 1.2s ease';

  function sw_w(){return sw.offsetWidth||Math.min(580,window.innerWidth*0.88);}
  function place(){dh.style.position='absolute';dh.style.top='50%';dh.style.transform='translateY(-50%)';dh.style.left=(sw_w()*SS-29)+'px';}
  place();setTimeout(place,80);setTimeout(place,300);
  window.addEventListener('resize',place);

  function setP(p){
    if(done)return;
    prog=Math.max(0,Math.min(1,p));
    var w=sw_w(),mx=w*(0.875-SS);
    blade.style.width=(mx*prog)+'px';
    dh.style.left=(w*SS-29+mx*prog)+'px';
    var g=20+prog*70+Math.abs(vel)*150;
    blade.style.boxShadow='0 0 '+g+'px rgba(200,220,255,'+(0.12+prog*0.55)+'),0 0 '+(g/2)+'px rgba(180,200,255,'+(0.08+prog*0.3)+')';
    blade.style.filter='drop-shadow(0 0 '+(3+prog*8)+'px rgba(200,220,255,'+(0.4+prog*0.4)+'))';
    if(sp)sp.style.opacity=Math.min(1,Math.abs(vel)*30*prog)*0.4;
    fills.forEach(function(f,i){var t=(i+1)/4;f.style.width=prog>=t?'100%':(prog>=(i/4)?((prog-i/4)*4*100)+'%':'0%');});
    if(prog>0.78&&!flashed){flashed=true;slash.style.animation='slashAnim .55s ease forwards';dh.style.boxShadow='0 0 80px rgba(201,168,76,1)';setTimeout(function(){dh.style.boxShadow='';},300);}
    if(prog>=1)finish();
  }
  function finish(){
    if(done)return;done=true;
    setTimeout(function(){intro.style.opacity='0';intro.style.pointerEvents='none';mainEl.style.opacity='1';setTimeout(function(){intro.style.display='none';},1100);},500);
  }
  function skip(){if(done)return;done=true;intro.style.opacity='0';intro.style.pointerEvents='none';mainEl.style.opacity='1';setTimeout(function(){intro.style.display='none';},1100);}

  dh.addEventListener('mousedown',function(e){drag=true;sx=e.clientX;spg=prog;lx=e.clientX;lt=Date.now();e.preventDefault();});
  document.addEventListener('mousemove',function(e){if(!drag)return;var n=Date.now();vel=(e.clientX-lx)/Math.max(1,n-lt);lx=e.clientX;lt=n;setP(spg+(e.clientX-sx)/(sw_w()*(0.875-SS)));});
  document.addEventListener('mouseup',function(){drag=false;vel=0;});
  dh.addEventListener('touchstart',function(e){drag=true;sx=e.touches[0].clientX;spg=prog;lx=sx;lt=Date.now();e.preventDefault();},{passive:false});
  document.addEventListener('touchmove',function(e){if(!drag)return;var cx=e.touches[0].clientX,n=Date.now();vel=(cx-lx)/Math.max(1,n-lt);lx=cx;lt=n;setP(spg+(cx-sx)/(sw_w()*(0.875-SS)));e.preventDefault();},{passive:false});
  document.addEventListener('touchend',function(){drag=false;vel=0;});
  dh.addEventListener('click',function(){if(prog>0.05)return;var a=0;(function s(){a+=0.022;setP(a);if(a<1)requestAnimationFrame(s);})();});
  var sb=document.getElementById('skip-intro');if(sb)sb.addEventListener('click',skip);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'||e.key==='Enter')skip();});
  setTimeout(function(){if(mainEl.style.opacity!=='1'){mainEl.style.opacity='1';intro.style.display='none';}},18000);
})();

/* NAV */
(function(){
  var nav=document.getElementById('nav');
  var links=document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>60);});
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on');});var l=document.querySelector('.nav-links a[href="#'+e.target.id+'"]');if(l)l.classList.add('on');}});
  },{threshold:.35});
  document.querySelectorAll('section[id]').forEach(function(s){obs.observe(s);});
})();

/* SCROLL REVEAL */
(function(){
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');obs.unobserve(e.target);}});},{threshold:.1});
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(function(el){obs.observe(el);});
})();

/* SKILL BARS */
(function(){
  var bars=document.getElementById('bars');if(!bars)return;
  var obs=new IntersectionObserver(function(entries){
    if(!entries[0].isIntersecting)return;
    document.querySelectorAll('.bar-fill').forEach(function(b,i){setTimeout(function(){b.style.width=b.dataset.w+'%';},i*80);});
    document.querySelectorAll('.ca').forEach(function(arc,i){var v=parseInt(arc.dataset.v),c=2*Math.PI*18;setTimeout(function(){arc.style.transition='stroke-dasharray 1.3s cubic-bezier(.4,0,.2,1)';arc.style.strokeDasharray=(v/100*c)+' '+c;},i*100);});
    obs.disconnect();
  },{threshold:.2});
  obs.observe(bars);
})();

/* CARD TILT */
document.querySelectorAll('.proj-card,.stat-card,.exp-item,.lead-item').forEach(function(card){
  card.addEventListener('mousemove',function(e){var r=card.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5;var y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(800px) rotateY('+(x*8)+'deg) rotateX('+(-y*8)+'deg) translateZ(4px)';});
  card.addEventListener('mouseleave',function(){card.style.transform='';});
});

/* MOBILE MENU */
var hb=document.getElementById('ham-btn');
var mm=document.getElementById('mobile-menu');
var mc=document.getElementById('mobile-close');
if(hb)hb.addEventListener('click',function(){mm.classList.add('open');});
if(mc)mc.addEventListener('click',function(){mm.classList.remove('open');});
if(mm)mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mm.classList.remove('open');});});

/* GUESTBOOK */
function submitGB(){
  var name=document.getElementById('gb-name').value.trim();
  var email=document.getElementById('gb-email').value.trim();
  var contact=document.getElementById('gb-contact').value.trim();
  var msg=document.getElementById('gb-msg').value.trim();
  var pub=document.getElementById('gb-public').checked;
  var st=document.getElementById('gb-status');
  if(!name||!email||!msg){st.style.color='#b83228';st.textContent='Please fill in name, email and message.';return;}
  var re=/^[^@]+@[^@]+\.[^@]+$/;
  if(!re.test(email)){st.style.color='#b83228';st.textContent='Please enter a valid email.';return;}
  st.style.color='var(--gold)';st.textContent='Sending...';
  var fd=new FormData();
  fd.append('name',name);fd.append('email',email);fd.append('_replyto',email);
  fd.append('contact',contact||'Not provided');fd.append('message',msg);
  fd.append('public',pub?'Yes':'No');fd.append('_subject','Portfolio message from '+name);
  fetch('https://formspree.io/f/xojkyewj',{method:'POST',body:fd,headers:{Accept:'application/json'}})
  .then(function(r){
    if(r.ok){
      st.style.color='var(--gold)';st.textContent='Message sent! I will get back to you soon.';
      document.getElementById('gb-name').value='';document.getElementById('gb-email').value='';
      document.getElementById('gb-contact').value='';document.getElementById('gb-msg').value='';
      document.getElementById('gb-public').checked=false;
      if(pub)addC(name,msg);
    }else{st.style.color='#b83228';st.textContent='Something went wrong. Email me directly.';}
  }).catch(function(){st.style.color='#b83228';st.textContent='Something went wrong. Email me directly.';});
}
function addC(name,msg){
  var c=JSON.parse(localStorage.getItem('gb')||'[]');
  c.unshift({name:name,msg:msg,time:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})});
  if(c.length>30)c=c.slice(0,30);
  localStorage.setItem('gb',JSON.stringify(c));renderC();
}
function renderC(){
  var c=JSON.parse(localStorage.getItem('gb')||'[]');
  var el=document.getElementById('gb-comments');
  var em=document.getElementById('gb-empty');
  var cn=document.getElementById('gb-count');
  if(!el)return;
  if(!c.length){if(em)em.style.display='block';if(cn)cn.textContent='';return;}
  if(em)em.style.display='none';if(cn)cn.textContent='('+c.length+')';
  el.innerHTML=c.map(function(x){return'<div class="gb-comment"><div class="gb-comment-name">'+esc(x.name)+'</div><div class="gb-comment-msg">'+esc(x.msg)+'</div><div class="gb-comment-time">'+x.time+'</div></div>';}).join('');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
renderC();
