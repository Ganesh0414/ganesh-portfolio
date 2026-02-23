import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  FaCss3Alt, FaGithub, FaHtml5, FaJava, FaJs,
  FaLinkedin, FaPython, FaReact,
} from 'react-icons/fa';
import { SiLeetcode, SiSpringboot } from 'react-icons/si';

// Initialize EmailJS
emailjs.init('pr2BqeLSzX6ierVmR'); // Public key

/* ─── Typewriter ─── */
function useTypewriter(text: string, speed = 70, pause = 1200) {
  const [out, setOut] = useState('');
  const [dir, setDir] = useState<'type' | 'erase'>('type');
  useEffect(() => {
    let t: number | undefined;
    if (dir === 'type') {
      if (out.length < text.length) t = window.setTimeout(() => setOut(text.slice(0, out.length + 1)), speed);
      else t = window.setTimeout(() => setDir('erase'), pause);
    } else {
      if (out.length > 0) t = window.setTimeout(() => setOut(text.slice(0, out.length - 1)), speed * 0.55);
      else t = window.setTimeout(() => setDir('type'), 250);
    }
    return () => { if (t) window.clearTimeout(t); };
  }, [dir, out, pause, speed, text]);
  return out;
}

/* ─── Aurora Canvas ─── */
function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let raf = 0, time = 0;
    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); window.addEventListener('resize', resize);
    const particles = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: 0.5 + Math.random() * 1.8, vx: (-0.3 + Math.random() * 0.6) * 0.6,
      vy: (-0.3 + Math.random() * 0.6) * 0.6, a: 0.08 + Math.random() * 0.18,
      pulse: Math.random() * Math.PI * 2,
    }));
    interface SS { x:number;y:number;vx:number;vy:number;len:number;a:number;active:boolean;timer:number; }
    const stars: SS[] = Array.from({ length: 5 }).map(() => ({ x:0,y:0,vx:0,vy:0,len:0,a:0,active:false,timer:Math.random()*200 }));
    const launch = (s: SS) => {
      s.x=Math.random()*window.innerWidth*0.7; s.y=Math.random()*window.innerHeight*0.5;
      const ang=(Math.PI/4)+(Math.random()-0.5)*0.4, spd=8+Math.random()*10;
      s.vx=Math.cos(ang)*spd; s.vy=Math.sin(ang)*spd; s.len=60+Math.random()*100; s.a=0.9; s.active=true;
    };
    const draw = () => {
      time+=0.008; ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
      [
        {cx:0.2+Math.sin(time*0.7)*0.1,cy:0.15+Math.cos(time*0.5)*0.08,r:0.55,c1:'rgba(34,211,238,0.13)',c2:'rgba(99,102,241,0.07)'},
        {cx:0.8+Math.cos(time*0.6)*0.08,cy:0.25+Math.sin(time*0.8)*0.06,r:0.50,c1:'rgba(168,85,247,0.12)',c2:'rgba(34,211,238,0.05)'},
        {cx:0.5+Math.sin(time*0.4)*0.12,cy:0.85+Math.cos(time*0.6)*0.06,r:0.45,c1:'rgba(244,114,182,0.10)',c2:'rgba(99,102,241,0.06)'},
        {cx:0.1+Math.cos(time*0.9)*0.06,cy:0.6+Math.sin(time*0.7)*0.08,r:0.35,c1:'rgba(52,211,153,0.09)',c2:'rgba(34,211,238,0.04)'},
      ].forEach(b => {
        const cx=b.cx*window.innerWidth, cy=b.cy*window.innerHeight, rad=b.r*Math.max(window.innerWidth,window.innerHeight);
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rad);
        g.addColorStop(0,b.c1); g.addColorStop(0.5,b.c2); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g; ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
      });
      ctx.strokeStyle='rgba(255,255,255,0.018)'; ctx.lineWidth=1;
      for(let x=0;x<window.innerWidth;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,window.innerHeight);ctx.stroke();}
      for(let y=0;y<window.innerHeight;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(window.innerWidth,y);ctx.stroke();}
      for(const p of particles){
        p.x+=p.vx; p.y+=p.vy; p.pulse+=0.02;
        if(p.x<-20)p.x=window.innerWidth+20; if(p.x>window.innerWidth+20)p.x=-20;
        if(p.y<-20)p.y=window.innerHeight+20; if(p.y>window.innerHeight+20)p.y=-20;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${p.a*(0.7+0.3*Math.sin(p.pulse))})`; ctx.fill();
      }
      for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
        const a=particles[i],b=particles[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<100){ctx.strokeStyle=`rgba(255,255,255,${(1-d/100)*0.07})`;ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
      }
      for(const s of stars){
        if(!s.active){s.timer--;if(s.timer<=0){launch(s);s.timer=150+Math.random()*250;}}
        else{
          s.x+=s.vx;s.y+=s.vy;s.a*=0.96;if(s.a<0.05){s.active=false;continue;}
          const g=ctx.createLinearGradient(s.x,s.y,s.x-s.vx*(s.len/10),s.y-s.vy*(s.len/10));
          g.addColorStop(0,`rgba(255,255,255,${s.a})`);g.addColorStop(1,'rgba(255,255,255,0)');
          ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.vx*(s.len/10),s.y-s.vy*(s.len/10));ctx.stroke();
        }
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={canvasRef} className="fixed inset-0 -z-30" aria-hidden="true"/>;
}

/* ─── Floating Orbs ─── */
function FloatingOrbs() {
  type OrbConfig = {size:string;from:string;to:string;dx:number[];dy:number[];dur:number} & ({left:string;top:string;right?:never;bottom?:never}|{right:string;bottom:string;left?:never;top?:never}|{left:string;bottom:string;top?:never;right?:never}|{right:string;top:string;left?:never;bottom?:never});
  const orbsData = [
    {left:'-200px',top:'-200px',size:'600px',from:'rgba(34,211,238,0.18)',to:'rgba(99,102,241,0.08)',dx:[0,50,0],dy:[0,30,0],dur:12} as OrbConfig,
    {right:'-250px',bottom:'-250px',size:'700px',from:'rgba(168,85,247,0.16)',to:'rgba(244,114,182,0.06)',dx:[0,-40,0],dy:[0,-25,0],dur:15} as OrbConfig,
    {left:'20%',bottom:'-300px',size:'500px',from:'rgba(52,211,153,0.12)',to:'rgba(34,211,238,0.05)',dx:[0,30,0],dy:[0,-20,0],dur:11} as OrbConfig,
    {right:'15%',top:'20%',size:'400px',from:'rgba(244,114,182,0.10)',to:'rgba(99,102,241,0.04)',dx:[0,-20,0],dy:[0,15,0],dur:9} as OrbConfig,
  ] as const;
  return (
    <>
      {orbsData.map((orb,i)=>{
        const style: Record<string, any> = {width:orb.size,height:orb.size,background:`radial-gradient(circle at 35% 35%, ${orb.from}, ${orb.to}, transparent 70%)`,opacity:0.7};
        if('left' in orb && orb.left) style.left = orb.left;
        if('right' in orb && orb.right) style.right = orb.right;
        if('top' in orb && orb.top) style.top = orb.top;
        if('bottom' in orb && orb.bottom) style.bottom = orb.bottom;
        return <motion.div key={i} aria-hidden className="fixed -z-20 rounded-full blur-3xl"
          style={style}
          animate={{x:orb.dx,y:orb.dy}} transition={{duration:orb.dur,repeat:Infinity,ease:'easeInOut'}}/>;
      })}
    </>
  );
}

/* ─── Types & variants ─── */
type Direction = 1 | -1;
const createVariants = (dir: Direction) => ({
  initial: { opacity: 0, x: dir * 60, scale: 0.97, filter: 'blur(8px)' },
  animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
  exit:    { opacity: 0, x: dir * -60, scale: 0.97, filter: 'blur(8px)' },
});
type TabKey = 'home'|'skills'|'projects'|'experience'|'links'|'contact';
const TAB_ORDER: TabKey[] = ['home','skills','projects','experience','links','contact'];

/* ─── Skill Bar ─── */
function SkillBar({pct,delay}:{pct:number;delay:number}) {
  return (
    <div className="mt-5 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1.3,delay,ease:[0.22,1,0.36,1]}}
        className="h-1.5 rounded-full" style={{background:'linear-gradient(90deg,rgba(34,211,238,0.85),rgba(168,85,247,0.70),rgba(244,114,182,0.60))'}}/>
    </div>
  );
}

/* ─── Glow Button ─── */
function GlowButton({children,onClick,href,className=''}:{children:React.ReactNode;onClick?:()=>void;href?:string;className?:string}) {
  const base=`relative group px-7 py-3 rounded-2xl font-semibold text-black overflow-hidden ${className}`;
  const inner = (
    <>
      <span className="absolute inset-0 rounded-2xl" style={{background:'linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,255,255,0.72))'}}/>
      <motion.span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:'linear-gradient(135deg,rgba(34,211,238,0.25),rgba(168,85,247,0.20))'}}/>
      <span className="relative">{children}</span>
    </>
  );
  if (href) return <motion.a href={href} target="_blank" rel="noreferrer" whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}} className={base}>{inner}</motion.a>;
  return <motion.button onClick={onClick} whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}} className={base}>{inner}</motion.button>;
}

/* ─── Projects Data ─── */
const PROJECTS = [
  {
    id: 0, title: 'AI-Powered Chat Application', tag: 'Full-Stack', color: '#22d3ee', terminal: 'ai-chat-app',
    desc: 'A full-stack AI-powered Chat Application using Spring Boot REST API integrated with the ChatGPT OpenAI API to provide intelligent, real-time conversational responses.',
    stack: ['React','Spring Boot','Java','OpenAI API','CSS','JavaScript'],
    highlights: ['Secure REST APIs for real-time AI responses','ChatGPT integration for intelligent conversations','Clean UI/UX for smooth chat flow','Scalable backend architecture'],
    link: 'https://github.com/Ganesh0414/CodeAlpha_Artificial-Intelligence',
    screenLines: [
      {t:80,   text:'$ cd ai-chat-app',                             color:'#22d3ee'},
      {t:200,  text:'$ mvn spring-boot:run',                        color:'#a78bfa'},
      {t:420,  text:'  ✓ Spring Boot started on :8080',             color:'#34d399'},
      {t:620,  text:'$ npm run dev',                                 color:'#22d3ee'},
      {t:820,  text:'  ✓ Vite ready on :5173',                      color:'#34d399'},
      {t:1020, text:'$ curl /api/chat -d "Hello AI"',               color:'#f472b6'},
      {t:1300, text:'  {"reply":"Hello! How can I help you today?"}',color:'#fbbf24'},
      {t:1580, text:'  ● ChatGPT connected ✓',                      color:'#34d399'},
      {t:1850, text:'  ● Real-time responses active',                color:'#34d399'},
      {t:2080, text:'_',                                              color:'#22d3ee',blink:true},
    ],
  },
  {
    id: 1, title: 'Python Geolocation Tool', tag: 'Python', color: '#a78bfa', terminal: 'geo-tracker',
    desc: 'A Python-based Geolocation Tool that retrieves and analyzes geographical location information using Geolocation APIs and networking packages.',
    stack: ['Python','Geolocation API','Networking Libs','CLI'],
    highlights: ['Real-time IP-based location detection','Extracts country, city, region & ISP','Clean command-line interface','Modular & extendable architecture'],
    link: 'https://github.com/Ganesh0414/Track_phone',
    screenLines: [
      {t:80,   text:'$ python tracker.py',             color:'#a78bfa'},
      {t:260,  text:'  Initializing geo engine...',    color:'#94a3b8'},
      {t:500,  text:'  ✓ API connected',                color:'#34d399'},
      {t:700,  text:'  Enter IP: 8.8.8.8',             color:'#f472b6'},
      {t:900,  text:'  ┌─ Location Data ───────────┐', color:'#a78bfa'},
      {t:1060, text:'  │ Country   : United States  │', color:'#e2e8f0'},
      {t:1210, text:'  │ City      : Mountain View  │', color:'#e2e8f0'},
      {t:1360, text:'  │ ISP       : Google LLC      │', color:'#e2e8f0'},
      {t:1510, text:'  │ Lat/Lon   : 37.42 / -122.08│', color:'#fbbf24'},
      {t:1700, text:'  └────────────────────────────┘', color:'#a78bfa'},
      {t:1900, text:'_',                                 color:'#a78bfa',blink:true},
    ],
  },
];

/* ─── Terminal Lines Animator ─── */
function TerminalLines({lines,running}:{lines:typeof PROJECTS[0]['screenLines'];running:boolean}) {
  const [shown,setShown] = useState<number[]>([]);
  useEffect(()=>{
    if(!running){setShown([]);return;}
    setShown([]);
    const timers=lines.map((l,i)=>window.setTimeout(()=>setShown(p=>[...p,i]),l.t));
    return ()=>timers.forEach(clearTimeout);
  },[running,lines]);
  return (
    <div className="font-mono text-[11px] sm:text-xs space-y-[3px] leading-relaxed overflow-hidden">
      {lines.map((l,i)=>shown.includes(i)?(
        <motion.div key={i} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{duration:0.2}}>
          {l.blink
            ? <motion.span style={{color:l.color}} animate={{opacity:[1,0,1]}} transition={{duration:0.8,repeat:Infinity}}>{l.text}</motion.span>
            : <span style={{color:l.color}}>{l.text}</span>}
        </motion.div>
      ):null)}
    </div>
  );
}

/* ─── Keyboard Key ─── */
function Key({label,wide,pressed,accent}:{label:string;wide?:boolean;pressed?:boolean;accent?:string}) {
  return (
    <motion.div
      animate={pressed?{y:3,scale:0.93}:{y:0,scale:1}}
      transition={{type:'spring',stiffness:600,damping:20}}
      className={[
        'relative flex items-center justify-center rounded-[5px] select-none cursor-default border border-white/[0.12]',
        wide?'px-3 py-[7px] min-w-[44px] h-8 sm:h-9':'w-[25px] h-7 sm:w-[28px] sm:h-8',
        pressed?'bg-white/20 border-white/30 text-white':'bg-white/[0.06] text-white/55',
      ].join(' ')}
      style={{boxShadow:pressed&&accent?`0 0 14px ${accent}70,0 2px 0 rgba(0,0,0,0.6)`:'0 2px 0 rgba(0,0,0,0.6)'}}>
      <span className="text-[9px] sm:text-[10px] font-semibold leading-none" style={pressed&&accent?{color:accent}:{}}>
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Projects Showcase ─── */
function ProjectsShowcase({glass}:{glass:string}) {
  void glass; // Acknowledge parameter for future use
  const [current,setCurrent]   = useState(0);
  const [direction,setDirection] = useState(1);
  const [pressedKey,setPressedKey] = useState<string|null>(null);
  const [screenOn,setScreenOn]   = useState(false);
  const [termRunning,setTermRunning] = useState(false);
  const [restarting,setRestarting]   = useState(false);
  const proj = PROJECTS[current];

  useEffect(()=>{
    const t1=setTimeout(()=>setScreenOn(true),400);
    const t2=setTimeout(()=>setTermRunning(true),900);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);

  const goTo = useCallback((idx:number,dir:number)=>{
    setTermRunning(false); setDirection(dir);
    setTimeout(()=>{setCurrent(idx);setTermRunning(true);},320);
  },[]);
  const nextProject = useCallback(()=>goTo((current+1)%PROJECTS.length,1),[current,goTo]);
  const prevProject = useCallback(()=>goTo((current-1+PROJECTS.length)%PROJECTS.length,-1),[current,goTo]);
  const restartTerminal = ()=>{setRestarting(true);setTermRunning(false);setTimeout(()=>{setRestarting(false);setTermRunning(true);},900);};

  useEffect(()=>{
    const down=(e:KeyboardEvent)=>{
      if(e.key==='Enter'||e.key==='ArrowRight'){e.preventDefault();setPressedKey('enter');nextProject();}
      if(e.key==='ArrowLeft'){e.preventDefault();setPressedKey('left');prevProject();}
    };
    const up=()=>setTimeout(()=>setPressedKey(null),200);
    window.addEventListener('keydown',down); window.addEventListener('keyup',up);
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);};
  },[nextProject,prevProject]);

  const screenV={
    enter:(d:number)=>({opacity:0,x:d*28,filter:'blur(5px)'}),
    center:{opacity:1,x:0,filter:'blur(0px)'},
    exit:(d:number)=>({opacity:0,x:d*-28,filter:'blur(5px)'}),
  };

  const keyRows=[
    ['`','1','2','3','4','5','6','7','8','9','0','-','='],
    ['Q','W','E','R','T','Y','U','I','O','P','[',']'],
    ['A','S','D','F','G','H','J','K','L',';'],
    ['Z','X','C','V','B','N','M',',','.','/'],
  ];

  return (
    <motion.section key="projects"
      variants={{initial:{opacity:0,y:24,filter:'blur(8px)'},animate:{opacity:1,y:0,filter:'blur(0px)'},exit:{opacity:0,y:-10,filter:'blur(8px)'}}}
      initial="initial" animate="animate" exit="exit"
      transition={{duration:0.55,ease:[0.22,1,0.36,1]}}
      className="py-4 sm:py-8 max-w-4xl mx-auto">

      {/* Header */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="text-center mb-5">
        <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent"
          style={{backgroundImage:'linear-gradient(90deg,rgba(34,211,238,0.95),rgba(168,85,247,0.85))'}}>
          Projects
        </h2>
        <p className="text-white/35 mt-1.5 text-[11px] sm:text-xs tracking-wide">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white/55 font-mono text-[10px]">Enter</kbd> or{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white/55 font-mono text-[10px]">→</kbd> to navigate
        </p>
      </motion.div>

      <div className="flex flex-col items-center">

        {/* ══ MONITOR ══ */}
        <motion.div initial={{opacity:0,y:-28,scale:0.94}} animate={{opacity:1,y:0,scale:1}}
          transition={{duration:0.7,ease:[0.22,1,0.36,1]}} className="relative w-full max-w-[680px]">

          <div className="relative rounded-[20px] p-[2px]"
            style={{background:'linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03),rgba(255,255,255,0.09))'}}>
            <div className="rounded-[19px] overflow-hidden"
              style={{background:'linear-gradient(170deg,#0d1018 0%,#080b12 100%)',boxShadow:'0 32px 90px -20px rgba(0,0,0,0.95),inset 0 1px 0 rgba(255,255,255,0.07)'}}>

              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]"
                style={{background:'rgba(255,255,255,0.022)'}}>
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/75"/>
                  <span className="h-3 w-3 rounded-full bg-yellow-500/75"/>
                  <motion.span className="h-3 w-3 rounded-full bg-green-500/75 cursor-pointer hover:bg-green-400 transition"
                    whileHover={{scale:1.2}} title="Restart terminal" onClick={restartTerminal}/>
                </div>
                <span className="flex-1"/>
                <span className="font-mono text-[10px] text-white/28 select-none">~/projects/{proj.terminal}</span>
                <span className="flex-1"/>
                <span className="font-mono text-[10px] text-white/22 select-none">{current+1} / {PROJECTS.length}</span>
              </div>

              {/* Screen */}
              <div className="relative overflow-hidden" style={{minHeight:'310px'}}>
                {/* Glow */}
                <motion.div aria-hidden className="absolute inset-0 pointer-events-none"
                  style={{background:`radial-gradient(ellipse at 50% 35%, ${proj.color}14, transparent 60%)`}}
                  animate={{opacity:screenOn?1:0}} transition={{duration:0.6}}/>
                {/* CRT scanlines */}
                <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.022]"
                  style={{backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.35) 2px,rgba(255,255,255,0.35) 3px)',backgroundSize:'100% 3px'}}/>

                {/* Boot */}
                {!screenOn&&(
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <motion.div initial={{opacity:0}} animate={{opacity:[0,1,0.5,1]}} transition={{duration:0.8}}
                      className="font-mono text-green-400/70 text-sm tracking-widest">INITIALIZING...</motion.div>
                    <div className="flex gap-1">
                      {[0,1,2,3].map(i=>(
                        <motion.div key={i} className="h-1 w-1 rounded-full bg-green-400/50"
                          animate={{scale:[1,1.5,1],opacity:[0.4,1,0.4]}}
                          transition={{duration:0.6,repeat:Infinity,delay:i*0.15}}/>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                <AnimatePresence mode="wait" custom={direction}>
                  {screenOn&&(
                    <motion.div key={current} custom={direction} variants={screenV}
                      initial="enter" animate="center" exit="exit"
                      transition={{duration:0.32,ease:[0.22,1,0.36,1]}}
                      className="grid sm:grid-cols-2 h-full">

                      {/* Terminal panel */}
                      <div className="p-4 sm:p-5 border-r border-white/[0.04] flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                          <motion.div className="h-2 w-2 rounded-full flex-shrink-0" style={{background:proj.color}}
                            animate={{boxShadow:[`0 0 4px ${proj.color}60`,`0 0 14px ${proj.color}`,`0 0 4px ${proj.color}60`]}}
                            transition={{duration:1.4,repeat:Infinity}}/>
                          <span className="font-mono text-[10px] text-white/28 select-none">bash — {proj.terminal}</span>
                        </div>
                        <div className="flex-1">
                          {restarting
                            ? <motion.div initial={{opacity:0}} animate={{opacity:[0,1,0,1,0,1]}} transition={{duration:0.8}}
                                className="font-mono text-[11px] text-green-400/60">Restarting process...</motion.div>
                            : <TerminalLines lines={proj.screenLines} running={termRunning}/>}
                        </div>
                      </div>

                      {/* Info panel */}
                      <div className="p-4 sm:p-5 flex flex-col gap-2.5">
                        <span className="self-start rounded-full px-3 py-1 text-[10px] font-bold border tracking-wide"
                          style={{color:proj.color,borderColor:`${proj.color}35`,background:`${proj.color}10`}}>
                          {proj.tag}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white/95 leading-snug">{proj.title}</h3>
                        <p className="text-white/52 text-[11px] sm:text-[12px] leading-relaxed">{proj.desc}</p>
                        <div className="flex flex-wrap gap-1">
                          {proj.stack.map(s=>(
                            <span key={s} className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono border border-white/[0.09] text-white/45 bg-white/[0.03]">{s}</span>
                          ))}
                        </div>
                        <ul className="space-y-1.5 flex-1">
                          {proj.highlights.map((h,hi)=>(
                            <motion.li key={h} initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} transition={{delay:hi*0.07+0.15}}
                              className="flex items-start gap-1.5 text-white/58 text-[11px]">
                              <motion.span className="mt-[3px] h-1.5 w-1.5 rounded-full flex-shrink-0" style={{background:proj.color}}
                                animate={{scale:[1,1.45,1],opacity:[0.6,1,0.6]}} transition={{duration:2,repeat:Infinity,delay:hi*0.25}}/>
                              {h}
                            </motion.li>
                          ))}
                        </ul>
                        <motion.a href={proj.link} target="_blank" rel="noreferrer"
                          whileHover={{scale:1.04,x:2}} whileTap={{scale:0.96}}
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-3 py-1.5 border border-white/10 bg-white/[0.04] text-white/55 hover:text-white hover:bg-white/[0.09] w-fit transition">
                          <FaGithub size={11}/> View on GitHub →
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-3 border-t border-white/[0.03]" style={{background:'rgba(255,255,255,0.012)'}}/>
            </div>
          </div>

          {/* Stand */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-6 rounded-b-lg" style={{background:'linear-gradient(180deg,#181c28,#10131c)',boxShadow:'inset 0 -1px 0 rgba(255,255,255,0.04)'}}/>
            <div className="w-32 h-2.5 rounded-full" style={{background:'linear-gradient(180deg,#1a1e2c,#12151f)',boxShadow:'0 4px 18px rgba(0,0,0,0.7)'}}/>
          </div>
        </motion.div>

        {/* ══ KEYBOARD ══ */}
        <motion.div initial={{opacity:0,y:32}} animate={{opacity:1,y:0}}
          transition={{duration:0.7,delay:0.22,ease:[0.22,1,0.36,1]}}
          className="mt-4 w-full max-w-[660px]">
          <div className="rounded-[13px] p-[2px]"
            style={{background:'linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))'}}>
            <div className="rounded-[12px] px-4 pt-4 pb-3"
              style={{background:'linear-gradient(160deg,#131620 0%,#0c0f18 100%)',boxShadow:'0 20px 55px -10px rgba(0,0,0,0.9),inset 0 1px 0 rgba(255,255,255,0.055)'}}>

              {/* Alpha rows */}
              {keyRows.map((row,ri)=>(
                <div key={ri} className="flex gap-[3px] justify-center mb-[3px]">
                  {ri===0&&<Key label="ESC" wide/>}
                  {row.map(k=><Key key={k} label={k} pressed={pressedKey===k.toLowerCase()}/>)}
                  {ri===0&&<Key label="⌫" wide/>}
                  {ri===1&&<Key label="↵" wide/>}
                </div>
              ))}

              {/* Bottom row */}
              <div className="flex gap-[3px] justify-center mt-[3px] items-center">
                <Key label="⌃" wide/><Key label="⌥" wide/><Key label="⌘" wide/>
                <motion.div className="h-8 sm:h-9 flex-1 max-w-[180px] rounded-[5px] border border-white/[0.10] flex items-center justify-center select-none"
                  style={{background:'rgba(255,255,255,0.045)',boxShadow:'0 2px 0 rgba(0,0,0,0.6)'}}
                  whileHover={{background:'rgba(255,255,255,0.08)'}} whileTap={{y:3,scale:0.98}}>
                  <span className="text-white/18 text-[8px] font-mono tracking-[0.2em]">SPACE</span>
                </motion.div>

                {/* ← */}
                <motion.button
                  onClick={()=>{setPressedKey('left');prevProject();setTimeout(()=>setPressedKey(null),280);}}
                  whileTap={{y:3,scale:0.91}}
                  className="w-10 h-8 sm:h-9 rounded-[5px] border flex items-center justify-center text-sm transition"
                  style={{
                    background:pressedKey==='left'?`${proj.color}25`:'rgba(255,255,255,0.055)',
                    border:pressedKey==='left'?`1px solid ${proj.color}50`:'1px solid rgba(255,255,255,0.10)',
                    color:pressedKey==='left'?proj.color:'rgba(255,255,255,0.55)',
                    boxShadow:pressedKey==='left'?`0 0 16px ${proj.color}50,0 2px 0 rgba(0,0,0,0.6)`:'0 2px 0 rgba(0,0,0,0.6)',
                  }}>←</motion.button>

                {/* ENTER */}
                <motion.button
                  onClick={()=>{setPressedKey('enter');nextProject();setTimeout(()=>setPressedKey(null),280);}}
                  whileHover={{scale:1.06}} whileTap={{y:4,scale:0.92}}
                  className="relative h-8 sm:h-9 px-4 sm:px-5 rounded-[5px] font-bold text-[11px] overflow-hidden"
                  style={{
                    background:pressedKey==='enter'?`linear-gradient(135deg,${proj.color},${proj.color}bb)`:`linear-gradient(135deg,${proj.color}25,${proj.color}12)`,
                    border:`1px solid ${proj.color}55`,
                    color:pressedKey==='enter'?'#000':proj.color,
                    boxShadow:pressedKey==='enter'?`0 0 28px ${proj.color}90,0 2px 0 rgba(0,0,0,0.6)`:`0 0 12px ${proj.color}35,0 2px 0 rgba(0,0,0,0.6)`,
                  }}>
                  <motion.div aria-hidden className="absolute inset-0"
                    style={{background:`radial-gradient(circle at 50% 50%,${proj.color}35,transparent 70%)`}}
                    animate={{opacity:[0.3,1,0.3]}} transition={{duration:1.7,repeat:Infinity}}/>
                  <span className="relative tracking-wide">ENTER →</span>
                </motion.button>
              </div>

              <div className="mt-2.5 flex items-center justify-center gap-5">
                <span className="text-[9px] font-mono text-white/20">← prev</span>
                <motion.span className="text-[9px] font-mono" style={{color:`${proj.color}70`}}
                  animate={{opacity:[0.45,1,0.45]}} transition={{duration:2.2,repeat:Infinity}}>
                  ⏎ ENTER → next project
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Desk line */}
        <motion.div initial={{opacity:0,scaleX:0}} animate={{opacity:1,scaleX:1}} transition={{delay:0.6,duration:0.8}}
          className="w-full max-w-[760px] h-px mt-1"
          style={{background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)'}}/>

        {/* Dot indicators */}
        <div className="flex gap-3 mt-5">
          {PROJECTS.map((_,i)=>(
            <motion.button key={i} onClick={()=>goTo(i,i>current?1:-1)}
              whileHover={{scale:1.35}} whileTap={{scale:0.88}}
              className="relative h-2 rounded-full transition-all duration-500"
              style={{width:i===current?'30px':'8px',background:i===current?proj.color:'rgba(255,255,255,0.14)',boxShadow:i===current?`0 0 12px ${proj.color}65`:'none'}}>
              {i===current&&<motion.div className="absolute inset-0 rounded-full" style={{background:proj.color}}
                animate={{opacity:[0.4,1,0.4]}} transition={{duration:1.6,repeat:Infinity}}/>}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ══════════════════════════════════════════
   MAIN PORTFOLIO
══════════════════════════════════════════ */
export default function Portfolio() {
  const [activeTab,setActiveTab] = useState<TabKey>('home');
  const [prevTab,setPrevTab]     = useState<TabKey>('home');
  const [formData,setFormData]   = useState({name:'',email:'',message:''});
  const [sentMsg,setSentMsg]     = useState('');
  const [sending,setSending]     = useState(false);
  const [linksViews,setLinksViews] = useState(0);

  useEffect(()=>{ try{const v=Number(localStorage.getItem('gk_lv')||'0');setLinksViews(Number.isFinite(v)?v:0);}catch{} },[]);
  useEffect(()=>{
    if(activeTab!=='links')return;
    const key='gk_lv_session';
    if(sessionStorage.getItem(key)==='1')return;
    sessionStorage.setItem(key,'1');
    setLinksViews(p=>{const n=p+1;try{localStorage.setItem('gk_lv',String(n));}catch{}return n;});
  },[activeTab]);

  const navigate=(tab:TabKey)=>{setPrevTab(activeTab);setActiveTab(tab);};
  const dir:Direction=TAB_ORDER.indexOf(activeTab)>=TAB_ORDER.indexOf(prevTab)?1:-1;
  const variants=createVariants(dir);

  const typedName=useTypewriter('Ganesh Kannan J',60,1500);
  const roles=useMemo(()=>['Aspiring Software Developer','Java • Spring Boot Developer','Web Development Enthusiast','Open Source Contributor'],[]);
  const [roleIdx,setRoleIdx]=useState(0);
  const typedRole=useTypewriter(roles[roleIdx],52,850);
  useEffect(()=>{const id=window.setInterval(()=>setRoleIdx(i=>(i+1)%roles.length),4200);return()=>window.clearInterval(id);},[roles.length]);

  const skills=[
    {name:'Java',       icon:<FaJava size={44}/>,      pct:88},
    {name:'Spring Boot',icon:<SiSpringboot size={44}/>,pct:82},
    {name:'Python',     icon:<FaPython size={44}/>,    pct:75},
    {name:'React',      icon:<FaReact size={44}/>,     pct:78},
    {name:'HTML',       icon:<FaHtml5 size={44}/>,     pct:90},
    {name:'CSS',        icon:<FaCss3Alt size={44}/>,   pct:85},
    {name:'JavaScript', icon:<FaJs size={44}/>,        pct:80},
  ];

  const glass     ='rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl shadow-[0_2px_0_0_rgba(255,255,255,0.04)_inset,0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_-30px_rgba(0,0,0,0.9)]';
  const glassInner='rounded-2xl border border-white/[0.07] bg-black/20 backdrop-blur-xl';

  return (
    <div className="min-h-screen text-white font-sans relative overflow-x-hidden"
      style={{background:'linear-gradient(160deg,#030612 0%,#050914 40%,#060a10 70%,#040810 100%)'}}>

      <AuroraBackground/>
      <FloatingOrbs/>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
        style={{backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27180%27 height=%27180%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27180%27 height=%27180%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")'}}/>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-5xl px-3 pt-3">
          <div className={`${glass} px-2 py-2`}>
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto justify-start md:justify-center whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TAB_ORDER.map(tab=>(
                <motion.button key={tab} onClick={()=>navigate(tab)} whileHover={{y:-1}} whileTap={{scale:0.97}}
                  className={['relative px-4 sm:px-5 py-2 rounded-2xl text-[13px] sm:text-sm transition font-medium',activeTab===tab?'text-black':'text-white/70 hover:text-white'].join(' ')}>
                  {activeTab===tab&&(
                    <motion.span layoutId="navPill" className="absolute inset-0 rounded-2xl"
                      style={{background:'linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.78))'}}
                      transition={{type:'spring',stiffness:420,damping:32}}/>
                  )}
                  <span className="relative">{tab.charAt(0).toUpperCase()+tab.slice(1)}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Nav gradient line */}
      <motion.div className="fixed top-[72px] sm:top-[76px] left-0 right-0 z-40 h-[1px]"
        style={{background:'linear-gradient(90deg,transparent,rgba(34,211,238,0.4),rgba(168,85,247,0.4),rgba(244,114,182,0.3),transparent)'}}
        animate={{opacity:[0.3,0.8,0.3]}} transition={{duration:3,repeat:Infinity,ease:'easeInOut'}}/>

      <div className="pt-[88px] sm:pt-[92px] px-3 sm:px-4">
        <AnimatePresence mode="wait">

          {/* ── HOME ── */}
          {activeTab==='home'&&(
            <motion.section key="home" variants={variants} initial="initial" animate="animate" exit="exit"
              transition={{duration:0.55,ease:[0.22,1,0.36,1]}} className="min-h-[calc(100vh-92px)] max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-8 sm:py-12">

                {/* Photo */}
                <div className="order-1 flex justify-center lg:justify-end">
                  <motion.div initial={{opacity:0,scale:0.92,y:20}} animate={{opacity:1,scale:1,y:0}}
                    transition={{duration:0.7,ease:[0.22,1,0.36,1]}}
                    className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px]">
                    <motion.div aria-hidden className="absolute -inset-4 rounded-[40px]"
                      style={{background:'conic-gradient(from 0deg,rgba(34,211,238,0.0),rgba(34,211,238,0.5),rgba(168,85,247,0.5),rgba(244,114,182,0.4),rgba(34,211,238,0.0))',padding:'1.5px',borderRadius:'40px'}}
                      animate={{rotate:360}} transition={{duration:10,repeat:Infinity,ease:'linear'}}>
                      <div className="w-full h-full rounded-[38px]" style={{background:'#030612'}}/>
                    </motion.div>
                    <motion.div aria-hidden className="absolute -inset-8 rounded-[44px] blur-3xl opacity-50"
                      style={{background:'radial-gradient(circle at 30% 20%,rgba(34,211,238,0.4),rgba(168,85,247,0.25),rgba(244,114,182,0.15),transparent 70%)'}}
                      animate={{scale:[1,1.08,1]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}/>
                    <motion.div animate={{y:[0,-10,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}
                      className={`relative ${glass} p-3`}>
                      <div className="relative overflow-hidden rounded-[26px]">
                        <div aria-hidden className="pointer-events-none absolute inset-0 z-10"
                          style={{background:'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 40%,transparent 60%,rgba(255,255,255,0.06) 100%)'}}/>
                        <img src="/profile.jpg" alt="Ganesh Kannan J"
                          className="w-full aspect-[4/5] sm:aspect-[3/4] object-cover rounded-[26px]" loading="lazy"/>
                      </div>
                      <motion.div className="mt-3 flex justify-center" animate={{scale:[1,1.02,1]}} transition={{duration:2,repeat:Infinity}}>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${glassInner} text-white/70 text-xs sm:text-[13px]`}>
                          <motion.span className="h-2 w-2 rounded-full bg-emerald-400"
                            animate={{boxShadow:['0 0 6px rgba(52,211,153,0.4)','0 0 20px rgba(52,211,153,0.8)','0 0 6px rgba(52,211,153,0.4)']}}
                            transition={{duration:1.5,repeat:Infinity}}/>
                          Open to internships • Open Source
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Text */}
                <motion.div className="order-2 text-center lg:text-left"
                  initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:0.7,delay:0.1,ease:[0.22,1,0.36,1]}}>
                  <div className="relative inline-block mb-5">
                    <h1 className="text-[38px] sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                      <span className="bg-clip-text text-transparent"
                        style={{backgroundImage:'linear-gradient(90deg,#e2e8f0 0%,#ffffff 40%,rgba(255,255,255,0.80) 100%)'}}>
                        {typedName||' '}
                      </span>
                      <motion.span className="inline-block w-1 h-[0.85em] bg-white/70 ml-1 align-middle rounded-sm"
                        animate={{opacity:[1,0,1]}} transition={{duration:0.8,repeat:Infinity}}/>
                    </h1>
                  </div>
                  <div className="h-7 mb-6 flex items-center justify-center lg:justify-start">
                    <p className="text-sm sm:text-base"
                      style={{background:'linear-gradient(90deg,rgba(34,211,238,0.9),rgba(168,85,247,0.8))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                      {typedRole}<span style={{WebkitTextFillColor:'rgba(255,255,255,0.55)'}}>|</span>
                    </p>
                  </div>
                  <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                    className={`${glass} p-5 sm:p-6 mb-8`}>
                    <motion.div className="h-[1px] w-0 rounded-full mb-4"
                      style={{background:'linear-gradient(90deg,rgba(34,211,238,0.8),rgba(168,85,247,0.6))'}}
                      animate={{width:'100%'}} transition={{duration:1.2,delay:0.5,ease:[0.22,1,0.36,1]}}/>
                    <p className="text-white/72 text-[14px] sm:text-[15px] leading-relaxed">
                      Aspiring Software Developer with a strong foundation in{' '}
                      <span className="text-cyan-300/80">Java</span>,{' '}
                      <span className="text-violet-300/80">Spring Boot</span>, and{' '}
                      <span className="text-pink-300/80">Web Development</span>. Passionate about building scalable,
                      efficient applications, contributing to open-source, and creating impactful digital solutions.
                    </p>
                  </motion.div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <GlowButton href="https://drive.google.com/file/d/1CPFhY2HmVkMMtTyPpfC_6Aiifj7C0yJL/view?usp=sharing">
                      Download Resume
                    </GlowButton>
                    <motion.button onClick={()=>navigate('projects')} whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
                      className="px-7 py-3 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl text-white text-sm font-medium hover:bg-white/[0.10] transition">
                      View Projects →
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* ── SKILLS ── */}
          {activeTab==='skills'&&(
            <motion.section key="skills" variants={variants} initial="initial" animate="animate" exit="exit"
              transition={{duration:0.55,ease:[0.22,1,0.36,1]}} className="py-10 sm:py-14 max-w-5xl mx-auto">
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent"
                  style={{backgroundImage:'linear-gradient(90deg,rgba(34,211,238,0.95),rgba(168,85,247,0.85),rgba(244,114,182,0.80))'}}>
                  Tech Stack
                </h2>
                <p className="text-white/50 mt-2 text-sm">Technologies I work with</p>
              </motion.div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {skills.map((s,i)=>(
                  <motion.div key={s.name} initial={{opacity:0,y:24,scale:0.95}} animate={{opacity:1,y:0,scale:1}}
                    transition={{delay:i*0.07,duration:0.5,ease:[0.22,1,0.36,1]}} whileHover={{y:-8,scale:1.02}}
                    className={`${glass} p-6 text-center group relative overflow-hidden cursor-default`}>
                    <motion.div aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                      style={{background:'radial-gradient(circle at 50% 0%,rgba(34,211,238,0.08),transparent 70%)'}}/>
                    <motion.div className="text-white/80 flex justify-center mb-3 group-hover:text-white transition-colors duration-300"
                      whileHover={{rotate:[0,-8,8,0],scale:1.1}} transition={{duration:0.4}}>{s.icon}</motion.div>
                    <h3 className="font-semibold text-white/90 text-base">{s.name}</h3>
                    <SkillBar pct={s.pct} delay={i*0.07+0.3}/>
                    <p className="text-white/40 text-xs mt-2">{s.pct}%</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ── PROJECTS ── */}
          {activeTab==='projects'&&<ProjectsShowcase glass={glass}/>}

          {/* ── EXPERIENCE ── */}
          {activeTab==='experience'&&(
            <motion.section key="experience" variants={variants} initial="initial" animate="animate" exit="exit"
              transition={{duration:0.55,ease:[0.22,1,0.36,1]}} className="py-10 sm:py-14 max-w-5xl mx-auto">
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent"
                  style={{backgroundImage:'linear-gradient(90deg,rgba(168,85,247,0.95),rgba(34,211,238,0.85))'}}>Experience</h2>
                <p className="text-white/50 mt-2 text-sm">My journey so far</p>
              </motion.div>
              <div className="relative">
                <div className="absolute left-6 md:left-1/2 top-0 h-full w-[1px]"
                  style={{background:'linear-gradient(to bottom,transparent,rgba(34,211,238,0.4),rgba(168,85,247,0.4),rgba(244,114,182,0.3),transparent)'}}/>
                {[
                  {side:'left',title:"Open Source Contributor – SWOC '26",badge:'2026',
                   desc:"Actively contributing to open-source projects under SWOC '26, building scalable software solutions. Gained hands-on experience collaborating with global developers, implementing features, fixing bugs, and improving documentation.",
                   stack:'Java, Spring Boot, HTML, CSS, Git, GitHub',
                   highlights:['Enhanced code quality across multiple repositories','Developed Spring Boot backend services','Collaborated via GitHub PRs and code reviews'],
                   color:'rgba(34,211,238,0.7)'},
                  {side:'right',title:'Software Development Intern – CodeAlpha',badge:'Internship',
                   desc:'Completed an industry-focused internship gaining hands-on experience in Java, collections, REST APIs, and Spring Boot. Developed and optimized backend services following clean architecture principles.',
                   stack:'Java, Spring Boot, REST API, Collections',
                   highlights:['Built and tested RESTful APIs for application modules','Applied Java collections for efficient data handling','Followed industry-standard coding practices'],
                   color:'rgba(168,85,247,0.7)'},
                ].map((exp,i)=>(
                  <motion.div key={exp.title} initial={{opacity:0,x:exp.side==='left'?-40:40}} animate={{opacity:1,x:0}}
                    transition={{delay:i*0.15,duration:0.6,ease:[0.22,1,0.36,1]}}
                    className={`relative mb-10 md:w-[46%] ${exp.side==='right'?'md:ml-auto md:pl-10':'md:pr-10'}`}>
                    <motion.div className="absolute left-3 md:left-auto top-5 h-5 w-5 rounded-full border-2 border-white/20 flex items-center justify-center"
                      style={{background:exp.color,...(exp.side==='right'?{left:'-10px'}:{left:'16px'})}}
                      animate={{boxShadow:[`0 0 0px ${exp.color}`,`0 0 20px ${exp.color}`,`0 0 0px ${exp.color}`]}}
                      transition={{duration:2,repeat:Infinity,delay:i*0.5}}>
                      <span className="h-2 w-2 rounded-full bg-white/80"/>
                    </motion.div>
                    <div className={`${glass} p-6 ml-8 md:ml-0 group relative overflow-hidden`}>
                      <motion.div aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"
                        style={{background:`radial-gradient(circle at 50% 0%,${exp.color.replace('0.7','0.06')},transparent 70%)`}}/>
                      <div className="relative">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h2 className="text-lg sm:text-xl font-bold text-white/95 leading-tight">{exp.title}</h2>
                          <span className="flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-medium border border-white/10 text-white/60 backdrop-blur-xl bg-white/5">{exp.badge}</span>
                        </div>
                        <p className="text-white/65 text-sm leading-relaxed mb-3">{exp.desc}</p>
                        <p className="text-white/45 text-xs mb-3"><span className="text-white/70">Stack:</span> {exp.stack}</p>
                        <ul className="space-y-1.5">
                          {exp.highlights.map(h=>(
                            <li key={h} className="flex items-start gap-2 text-white/65 text-sm">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{background:exp.color}}/>{h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ── LINKS ── */}
          {activeTab==='links'&&(
            <motion.section key="links" variants={variants} initial="initial" animate="animate" exit="exit"
              transition={{duration:0.55,ease:[0.22,1,0.36,1]}} className="py-10 sm:py-14 max-w-4xl mx-auto">
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent"
                  style={{backgroundImage:'linear-gradient(90deg,rgba(244,114,182,0.95),rgba(168,85,247,0.85),rgba(34,211,238,0.80))'}}>Connect</h2>
                <p className="text-white/50 mt-2 text-sm">Find me across the web</p>
              </motion.div>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.05}} className={`${glass} p-6`}>
                  <p className="text-white/50 text-xs uppercase tracking-wider">Profile Views (This Device)</p>
                  <motion.p className="text-5xl font-bold mt-3 bg-clip-text text-transparent"
                    style={{backgroundImage:'linear-gradient(90deg,rgba(34,211,238,0.95),rgba(168,85,247,0.85))'}}
                    initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}} transition={{delay:0.2,type:'spring',stiffness:200}}>
                    {linksViews}
                  </motion.p>
                  <p className="text-white/35 text-xs mt-2">No backend — stored locally on your device</p>
                </motion.div>
                <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.1}} className={`${glass} p-6 flex flex-col justify-center`}>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Quick Links</p>
                  <p className="text-white/75 text-sm">Open any of my professional profiles with a single click below.</p>
                </motion.div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
                {[
                  {icon:<FaLinkedin size={36}/>,title:'LinkedIn',desc:'Connect professionally',sub:'ganesh-jayachandran',href:'https://www.linkedin.com/in/ganesh-jayachandran/',color:'rgba(34,211,238,0.12)',glow:'rgba(34,211,238,0.4)'},
                  {icon:<SiLeetcode size={36}/>,title:'LeetCode',desc:'Coding practice & problem solving',sub:'ganesgg982',href:'https://leetcode.com/u/ganesgg982/',color:'rgba(244,114,182,0.12)',glow:'rgba(244,114,182,0.4)'},
                  {icon:<FaGithub size={36}/>,title:'GitHub',desc:'Projects & open-source work',sub:'Ganesh0414',href:'https://github.com/Ganesh0414',color:'rgba(168,85,247,0.12)',glow:'rgba(168,85,247,0.4)'},
                ].map((link,i)=>(
                  <motion.a key={link.title} href={link.href} target="_blank" rel="noreferrer"
                    initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:i*0.08,duration:0.55,ease:[0.22,1,0.36,1]}}
                    whileHover={{y:-8,scale:1.02}} whileTap={{scale:0.97}}
                    className={`${glass} p-7 text-center group relative overflow-hidden cursor-pointer`} style={{textDecoration:'none'}}>
                    <motion.div aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                      style={{background:`radial-gradient(circle at 50% 30%,${link.color},transparent 70%)`}}/>
                    <div className="relative">
                      <motion.div className="flex justify-center mb-3 text-white/80 group-hover:text-white transition-colors duration-300"
                        whileHover={{scale:1.15}} transition={{type:'spring',stiffness:300}}>{link.icon}</motion.div>
                      <h3 className="text-xl font-bold text-white/95 mb-1">{link.title}</h3>
                      <p className="text-white/60 text-sm mb-2">{link.desc}</p>
                      <p className="text-white/35 text-xs font-mono">@{link.sub}</p>
                      <motion.div className="mt-4 h-[1px] w-0 rounded-full mx-auto" style={{background:link.glow}}
                        whileHover={{width:'80%'}} transition={{duration:0.3}}/>
                      <p className="text-white/40 text-xs mt-3 group-hover:text-white/60 transition">Open profile →</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.section>
          )}

          {/* ── CONTACT ── */}
          {activeTab==='contact'&&(
            <motion.section key="contact" variants={variants} initial="initial" animate="animate" exit="exit"
              transition={{duration:0.55,ease:[0.22,1,0.36,1]}} className="py-10 sm:py-14 max-w-lg mx-auto">
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent"
                  style={{backgroundImage:'linear-gradient(90deg,rgba(244,114,182,0.95),rgba(168,85,247,0.85))'}}>
                  Contact Me
                </h2>
                <p className="text-white/50 mt-2 text-sm">Let's build something together</p>
                <motion.a href="mailto:ganesgg982@gmail.com"
                  className="inline-block mt-2 text-xs text-white/35 hover:text-cyan-300/70 transition" whileHover={{scale:1.04}}>
                  ganesgg982@gmail.com
                </motion.a>
              </motion.div>
              <motion.form onSubmit={async(e)=>{e.preventDefault();if(!formData.name||!formData.email||!formData.message){setSentMsg('Please fill in all fields');return;}setSending(true);try{await emailjs.send('service_s1yt25g','template_ij3lcut',{name:formData.name,email:formData.email,message:formData.message});setSentMsg(`Thank you ${formData.name}! Your message has been sent.`);setFormData({name:'',email:'',message:''});setTimeout(()=>setSentMsg(''),5000);}catch(err){setSentMsg('Failed to send message. Please try again.');}finally{setSending(false);}}}
                initial={{opacity:0,scale:0.97,y:20}} animate={{opacity:1,scale:1,y:0}} transition={{duration:0.55,ease:[0.22,1,0.36,1]}}
                className={`${glass} p-6 sm:p-8 space-y-4`}>
                <motion.div className="h-[1px] rounded-full mb-2"
                  style={{background:'linear-gradient(90deg,rgba(244,114,182,0.7),rgba(168,85,247,0.6),rgba(34,211,238,0.5))'}}
                  initial={{scaleX:0,originX:0}} animate={{scaleX:1}} transition={{duration:0.9,ease:[0.22,1,0.36,1]}}/>
                <input type="text" placeholder="Your Name" value={formData.name}
                  onChange={(e)=>setFormData({...formData,name:e.target.value})}
                  className={`block w-full p-4 rounded-2xl ${glassInner} text-white/90 placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-pink-400/40 transition`}/>
                <input type="email" placeholder="Your Email" value={formData.email}
                  onChange={(e)=>setFormData({...formData,email:e.target.value})}
                  className={`block w-full p-4 rounded-2xl ${glassInner} text-white/90 placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400/40 transition`}/>
                <textarea placeholder="Your Message" value={formData.message}
                  onChange={(e)=>setFormData({...formData,message:e.target.value})}
                  className={`block w-full p-4 rounded-2xl ${glassInner} text-white/90 placeholder:text-white/30 text-sm h-36 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition resize-none`}/>
                <AnimatePresence>
                  {sentMsg&&(
                    <motion.div initial={{opacity:0,y:6,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0}}
                      className="flex items-center gap-2 text-emerald-300 text-sm justify-center px-4 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                      <motion.span className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"
                        animate={{scale:[1,1.5,1]}} transition={{duration:1,repeat:Infinity}}/>{sentMsg}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button type="submit" disabled={sending} whileHover={{scale:1.03,y:-1}} whileTap={{scale:0.97}}
                  className="relative w-full px-7 py-3.5 rounded-2xl font-semibold text-black overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{background:'linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.72))'}}>
                  {sending?'Sending...':'Send Message'}
                </motion.button>
                <p className="text-center text-white/30 text-xs pt-1">
                  Or email directly:{' '}
                  <a href="mailto:ganesgg982@gmail.com" className="text-white/50 hover:text-cyan-300/70 transition underline underline-offset-2">
                    ganesgg982@gmail.com
                  </a>
                </p>
              </motion.form>
            </motion.section>
          )}

        </AnimatePresence>
      </div>

      <div className="pb-12 pt-6 text-center text-white/30 text-xs">
        © {new Date().getFullYear()} Ganesh Kannan J • Built with React & Framer Motion
      </div>
    </div>
  );
}
