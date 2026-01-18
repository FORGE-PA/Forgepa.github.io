const chat = document.getElementById("chat");
const input = document.getElementById("input");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tasksUI = document.getElementById("tasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

/* ---------- CHAT ---------- */
function add(sender,text,type){
  const d=document.createElement("div");
  d.className="msg "+type;
  d.innerHTML=`<b>${sender}:</b> ${text}`;
  chat.appendChild(d);
  void d.offsetWidth; // trigger animation
  chat.scrollTop=chat.scrollHeight;
}

function send(){
  if(!input.value) return;
  add("You",input.value,"user");
  const r=brain(input.value.toLowerCase());
  add("FORGE",r,"bot");
  input.value="";
}

/* ---------- VOICE ---------- */
function voice(){
  if(!window.webkitSpeechRecognition) return;
  const r=new webkitSpeechRecognition();
  r.onresult=e=>input.value=e.results[0][0].transcript;
  r.start();
}

function speak(){
  const u=new SpeechSynthesisUtterance(
    chat.lastChild.innerText.replace("FORGE:","")
  );
  speechSynthesis.speak(u);
}

/* ---------- BRAIN ---------- */
function brain(t){
  if(t.startsWith("add task")){
    const task=t.replace("add task","").trim();
    tasks.push(task); save();
    return "Task added.";
  }
  if(t.includes("business")){
    return "Define goal → break into weekly actions → execute daily → review weekly.";
  }
  if(t.includes("help")){
    return "Tasks, planning, voice, games, offline use.";
  }
  return "Understood. Continue.";
}

/* ---------- TASKS ---------- */
function renderTasks(){
  tasksUI.innerHTML="";
  tasks.forEach((t,i)=>{
    const li=document.createElement("li");
    li.textContent=(i+1)+". "+t;
    li.style.animationDelay = (i*0.1)+"s";
    tasksUI.appendChild(li);
  });
}
function save(){
  localStorage.setItem("tasks",JSON.stringify(tasks));
  renderTasks();
}

/* ---------- GAMES ---------- */
let loop;

/* GAME SWITCH */
function startGame(g){
  clearInterval(loop);
  canvas.style.opacity=0;
  ctx.clearRect(0,0,320,320);

  setTimeout(()=>{
    canvas.style.transition="opacity 0.5s";
    canvas.style.opacity=1;
    if(g==="snake") snake();
    if(g==="reaction") reaction();
    if(g==="shooter") shooter();
  },50);
}

/* SNAKE */
function snake(){
  let s=[{x:160,y:160}],dx=10,dy=0,f=rand();
  document.onkeydown=e=>{
    if(e.key=="ArrowUp")dx=0,dy=-10;
    if(e.key=="ArrowDown")dx=0,dy=10;
    if(e.key=="ArrowLeft")dx=-10,dy=0;
    if(e.key=="ArrowRight")dx=10,dy=0;
  };
  loop=setInterval(()=>{
    ctx.clearRect(0,0,320,320);
    const h={x:s[0].x+dx,y:s[0].y+dy};
    s.unshift(h);
    if(h.x==f.x && h.y==f.y) f=rand(); else s.pop();
    ctx.fillStyle="red"; ctx.fillRect(f.x,f.y,10,10);
    ctx.fillStyle="lime"; s.forEach(p=>ctx.fillRect(p.x,p.y,10,10));
  },100);
}
function rand(){
  return {x:Math.floor(Math.random()*32)*10,
          y:Math.floor(Math.random()*32)*10};
}

/* REACTION */
function reaction(){
  ctx.fillText("WAIT...",120,160);
  setTimeout(()=>{
    const s=Date.now();
    ctx.clearRect(0,0,320,320);
    ctx.fillText("CLICK!",120,160);
    canvas.onclick=()=>alert(Date.now()-s+" ms");
  },Math.random()*3000+1000);
}

/* COD-STYLE MINI SHOOTER */
function shooter(){
  let p={x:160,y:280}, bullets=[], enemies=[];
  document.onmousemove=e=>p.x=e.offsetX;
  canvas.onclick=()=>bullets.push({x:p.x,y:p.y});
  loop=setInterval(()=>{
    ctx.clearRect(0,0,320,320);

    if(Math.random()<0.05) enemies.push({x:Math.random()*300,y:0});

    bullets.forEach(b=>b.y-=6);
    enemies.forEach(en=>en.y+=2);

    bullets=enemies.filter(en=>{
      return !bullets.some(b=>{
        const hit=Math.abs(b.x-en.x)<10 && Math.abs(b.y-en.y)<10;
        return hit;
      });
    });

    ctx.fillStyle="cyan";
    ctx.fillRect(p.x-10,p.y,20,10);

    ctx.fillStyle="yellow";
    bullets.forEach(b=>ctx.fillRect(b.x,b.y,4,8));

    ctx.fillStyle="red";
    enemies.forEach(en=>ctx.fillRect(en.x,en.y,15,15));
  },30);
}
