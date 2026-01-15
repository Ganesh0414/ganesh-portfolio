import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaCss3Alt,
  FaGithub,
  FaHtml5,
  FaJava,
  FaJs,
  FaLinkedin,
  FaPython,
  FaReact,
} from 'react-icons/fa';
import { SiLeetcode, SiSpringboot } from 'react-icons/si';

function useTypewriter(text: string, speed = 70, pause = 1200) {
  const [out, setOut] = useState('');
  const [dir, setDir] = useState<'type' | 'erase'>('type');

  useEffect(() => {
    let t: number | undefined;

    if (dir === 'type') {
      if (out.length < text.length) {
        t = window.setTimeout(() => setOut(text.slice(0, out.length + 1)), speed);
      } else {
        t = window.setTimeout(() => setDir('erase'), pause);
      }
    } else {
      if (out.length > 0) {
        t = window.setTimeout(() => setOut(text.slice(0, out.length - 1)), speed * 0.55);
      } else {
        t = window.setTimeout(() => setDir('type'), 250);
      }
    }

    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [dir, out, pause, speed, text]);

  return out;
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.7 + Math.random() * 2.1,
      vx: (-0.35 + Math.random() * 0.7) * 0.75,
      vy: (-0.35 + Math.random() * 0.7) * 0.75,
      a: 0.10 + Math.random() * 0.22,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // softer glow wash for glassmorphism
      const grd = ctx.createRadialGradient(
        window.innerWidth * 0.35,
        window.innerHeight * 0.22,
        60,
        window.innerWidth * 0.35,
        window.innerHeight * 0.22,
        Math.max(window.innerWidth, window.innerHeight)
      );
      grd.addColorStop(0, 'rgba(99,102,241,0.10)');
      grd.addColorStop(0.45, 'rgba(34,211,238,0.08)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;
        if (p.y < -20) p.y = window.innerHeight + 20;
        if (p.y > window.innerHeight + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.10;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-30 opacity-70" aria-hidden="true" />;
}

function FloatingBlobs() {
  return (
    <>
      <motion.div
        aria-hidden
        className="fixed -z-30 left-[-220px] top-[-220px] h-[520px] w-[520px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(34,211,238,0.55), rgba(99,102,241,0.25), rgba(0,0,0,0))',
        }}
        animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="fixed -z-30 right-[-240px] bottom-[-240px] h-[600px] w-[600px] rounded-full blur-3xl opacity-25"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(168,85,247,0.55), rgba(34,211,238,0.18), rgba(0,0,0,0))',
        }}
        animate={{ x: [0, -45, 0], y: [0, -28, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="fixed -z-30 left-[15%] bottom-[-260px] h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(244,114,182,0.45), rgba(99,102,241,0.18), rgba(0,0,0,0))',
        }}
        animate={{ x: [0, 28, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

type TabKey = 'home' | 'skills' | 'projects' | 'experience' | 'links' | 'contact';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const [formData, setFormData] = useState({ name: '', email: 'ganesh@email.com', message: '' });
  const [sentMsg, setSentMsg] = useState('');

  const [linksViews, setLinksViews] = useState(0);

  const tabs = useMemo(() => ['home', 'skills', 'projects', 'experience', 'links', 'contact'] as const, []);

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem('gk_links_views') || '0');
      setLinksViews(Number.isFinite(v) ? v : 0);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'links') return;
    const key = 'gk_links_viewed_this_session';
    if (sessionStorage.getItem(key) === '1') return;
    sessionStorage.setItem(key, '1');

    setLinksViews((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('gk_links_views', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, [activeTab]);

  const typedName = useTypewriter('Ganesh Kannan J', 60, 1500);
  const roles = useMemo(
    () => ['Aspiring Software Developer', 'Java • Spring Boot Developer', 'Web Development Enthusiast', 'Open Source Contributor'],
    []
  );
  const [roleIdx, setRoleIdx] = useState(0);
  const typedRole = useTypewriter(roles[roleIdx], 52, 850);

  useEffect(() => {
    const id = window.setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 4200);
    return () => window.clearInterval(id);
  }, [roles.length]);

  const skills = useMemo(
    () => [
      { name: 'Java', icon: <FaJava size={46} className="mx-auto mb-2" /> },
      { name: 'Spring Boot', icon: <SiSpringboot size={46} className="mx-auto mb-2" /> },
      { name: 'Python', icon: <FaPython size={46} className="mx-auto mb-2" /> },
      { name: 'React', icon: <FaReact size={46} className="mx-auto mb-2" /> },
      { name: 'HTML', icon: <FaHtml5 size={46} className="mx-auto mb-2" /> },
      { name: 'CSS', icon: <FaCss3Alt size={46} className="mx-auto mb-2" /> },
      { name: 'JavaScript', icon: <FaJs size={46} className="mx-auto mb-2" /> },
    ],
    []
  );

  const pageVariants = {
    initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -10, filter: 'blur(6px)' },
  } as const;

  const glassCard =
    'rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-[0_1px_0_0_rgba(255,255,255,0.06),0_20px_60px_-30px_rgba(0,0,0,0.8)]';
  const glassInner =
    'rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)]';

  return (
    <div
      className={[
        'min-h-screen text-white font-sans relative overflow-hidden',
        // unique bg: deep navy + aurora gradients
        'bg-[radial-gradient(1200px_circle_at_15%_15%,rgba(34,211,238,0.14),transparent_55%),radial-gradient(1000px_circle_at_85%_20%,rgba(168,85,247,0.12),transparent_50%),radial-gradient(900px_circle_at_50%_95%,rgba(99,102,241,0.10),transparent_55%),linear-gradient(180deg,#050712_0%,#060818_35%,#070A0F_100%)]',
      ].join(' ')}
    >
      <ParticleBackground />
      <FloatingBlobs />

      {/* subtle grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27%3E%3Cfilter id=%27n%27 x=%270%27 y=%270%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27160%27 height=%27160%27 filter=%27url(%23n)%27 opacity=%270.35%27/%3E%3C/svg%3E")',
        }}
      />

      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 pt-3">
          <div className={`${glassCard} px-2 py-2`}>
            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto md:overflow-visible justify-start md:justify-center whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={[
                    'relative px-4 sm:px-5 py-2 rounded-2xl text-sm sm:text-[15px] transition',
                    'border border-transparent',
                    activeTab === tab
                      ? 'text-black'
                      : 'text-white/80 hover:text-white hover:border-white/10',
                  ].join(' ')}
                >
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tabPill"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* spacing for fixed nav */}
      <div className="pt-[88px] sm:pt-[92px] px-3 sm:px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.section
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="min-h-[calc(100vh-92px)] max-w-6xl mx-auto"
            >
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center py-6 sm:py-10">
                {/* Photo (mobile first) */}
                <div className="order-1 flex justify-center lg:justify-end">
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[520px]"
                  >
                    {/* halo */}
                    <motion.div
                      aria-hidden
                      className="absolute -inset-6 rounded-[34px] blur-3xl opacity-40"
                      style={{
                        background:
                          'radial-gradient(circle at 25% 15%, rgba(34,211,238,0.55), rgba(168,85,247,0.28), rgba(99,102,241,0.18), rgba(0,0,0,0))',
                      }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* glass frame */}
                    <motion.div
                      animate={{ y: [0, -7, 0] }}
                      transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                      className={[
                        'relative',
                        'rounded-[34px]',
                        'p-3 sm:p-4',
                        'border border-white/10',
                        'bg-white/[0.06]',
                        'backdrop-blur-2xl',
                        'shadow-[0_1px_0_0_rgba(255,255,255,0.06),0_30px_80px_-45px_rgba(0,0,0,0.9)]',
                      ].join(' ')}
                    >
                      <div className="relative overflow-hidden rounded-[26px]">
                        {/* subtle shine */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-60"
                          style={{
                            background:
                              'linear-gradient(120deg, rgba(255,255,255,0.20), rgba(255,255,255,0) 35%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.12))',
                          }}
                        />
                        <img
                          src="/profile.jpg"
                          alt="Ganesh Kannan J"
                          className="w-full aspect-[4/5] sm:aspect-[3/4] object-cover rounded-[26px]"
                          loading="lazy"
                        />
                      </div>

                      {/* badge */}
                      <div className="mt-3 flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/25 backdrop-blur-xl text-white/70 text-xs sm:text-sm">
                          <span className="h-2 w-2 rounded-full bg-emerald-400/80 shadow-[0_0_18px_rgba(52,211,153,0.55)]" />
                          Open to internships • Open Source
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Text */}
                <div className="order-2 text-center lg:text-left">
                  <motion.div
                    className="relative inline-block"
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                  >
                    <motion.div
                      aria-hidden
                      className="absolute -inset-10 rounded-full opacity-35 blur-2xl"
                      style={{
                        background:
                          'conic-gradient(from 180deg, rgba(34,211,238,0.60), rgba(168,85,247,0.55), rgba(99,102,241,0.55), rgba(34,211,238,0.60))',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                    />

                    <h1 className="relative text-[40px] leading-[1.05] sm:text-6xl md:text-7xl font-extrabold tracking-tight">
                      <span className="bg-[linear-gradient(90deg,rgba(255,255,255,0.98),rgba(255,255,255,0.82),rgba(255,255,255,0.98))] bg-clip-text text-transparent">
                        <span className="inline-block whitespace-nowrap overflow-hidden border-r-4 border-white/70 pr-2">
                          {typedName || ' '}
                        </span>
                      </span>
                    </h1>
                  </motion.div>

                  <motion.p
                    className="mt-5 text-white/80 text-sm sm:text-base md:text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <span className="text-white/70">{typedRole}</span>
                    <span className="inline-block w-3 text-white/80">|</span>
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    className={`mt-6 ${glassCard} p-5 sm:p-6`}
                  >
                    <p className="text-white/75 text-[14px] sm:text-[15px] md:text-base leading-relaxed">
                      I am an aspiring Software Developer with a strong foundation in Java, Spring Boot, and Web Development.
                      I am passionate about building scalable, efficient applications. I enjoy contributing to open-source
                      projects, collaborating with developer communities, and learning modern technologies to create
                      impactful digital solutions.
                    </p>
                  </motion.div>

                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                    <motion.a
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      href="https://drive.google.com/file/d/1CPFhY2HmVkMMtTyPpfC_6Aiifj7C0yJL/view?usp=sharing"
                      target="_blank"
                      rel="noreferrer"
                      className="group relative px-7 sm:px-8 py-3 rounded-2xl font-semibold text-black"
                    >
                      <span
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.70))',
                        }}
                      />
                      <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-white/10" />
                      <span className="relative">Download Resume</span>
                    </motion.a>

                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('projects')}
                      className={[
                        'px-7 sm:px-8 py-3 rounded-2xl',
                        'border border-white/12',
                        'bg-white/[0.06] backdrop-blur-2xl',
                        'text-white',
                        'hover:bg-white/[0.10] transition',
                        'shadow-[0_1px_0_0_rgba(255,255,255,0.05)]',
                      ].join(' ')}
                    >
                      View Projects
                    </motion.button>
                  </div>

                  <p className="mt-4 text-xs text-white/45">
                    Tip: Put your photo as <b className="text-white/70">/public/profile.jpg</b> (or change the src).
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'skills' && (
            <motion.section
              key="skills"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="py-10 sm:py-14 max-w-6xl mx-auto"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7">
                {skills.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 140, damping: 16 }}
                    whileHover={{ y: -6, rotateX: 6, rotateY: -6 }}
                    className={`${glassCard} p-6 sm:p-7 text-center overflow-hidden relative`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute -top-16 -left-20 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-16 -right-20 h-44 w-44 rounded-full bg-white/5 blur-3xl" />

                    <div className="relative" style={{ transform: 'translateZ(18px)' }}>
                      {s.icon}
                      <h3 className="mt-2 text-xl font-semibold text-white/95">{s.name}</h3>

                      <div className="mt-6 h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${72 + (i % 4) * 6}%` }}
                          transition={{ duration: 1.15, delay: i * 0.08 }}
                          className="h-2.5 rounded-full"
                          style={{
                            background:
                              'linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55))',
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section
              key="projects"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="py-10 sm:py-14 space-y-6 sm:space-y-8 max-w-6xl mx-auto"
            >
              <motion.div whileHover={{ y: -4 }} className={`${glassCard} p-6 sm:p-8`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-[linear-gradient(90deg,rgba(255,255,255,0.95),rgba(255,255,255,0.65))] bg-clip-text text-transparent">
                      AI-Powered Chat Application
                    </h2>
                    <p className="text-white/60 mt-1">Spring Boot REST API • OpenAI ChatGPT • React UI</p>
                  </div>
                  <span className="self-start rounded-full px-4 py-2 text-sm bg-black/25 border border-white/10 text-white/70 backdrop-blur-xl">
                    Full-Stack
                  </span>
                </div>

                <p className="text-white/75 leading-relaxed mt-5">
                  Developed a full-stack AI-powered Chat Application using Spring Boot REST API integrated with the ChatGPT
                  OpenAI API to provide intelligent, real-time conversational responses.
                </p>

                <div className="mt-5 grid md:grid-cols-2 gap-4">
                  <div className={`${glassInner} p-5`}>
                    <p className="text-white/75">
                      <b className="text-white/90">Tech Stack:</b> React, HTML, CSS, JavaScript, Java, Spring Boot (REST API), OpenAI ChatGPT API
                    </p>
                  </div>
                  <div className={`${glassInner} p-5`}>
                    <p className="text-white/75">
                      <b className="text-white/90">Highlights:</b>
                    </p>
                    <ul className="list-disc pl-6 text-white/75 mt-2 space-y-1">
                      <li>Secure REST APIs for real-time AI responses</li>
                      <li>ChatGPT integration for intelligent conversations</li>
                      <li>Clean UI/UX for smooth chat flow</li>
                      <li>Scalable backend architecture</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className={`${glassCard} p-6 sm:p-8`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-[linear-gradient(90deg,rgba(255,255,255,0.95),rgba(255,255,255,0.65))] bg-clip-text text-transparent">
                      Python Geolocation Tool
                    </h2>
                    <p className="text-white/60 mt-1">Geolocation APIs • Networking Libraries • CLI</p>
                  </div>
                  <span className="self-start rounded-full px-4 py-2 text-sm bg-black/25 border border-white/10 text-white/70 backdrop-blur-xl">
                    Python
                  </span>
                </div>

                <p className="text-white/75 leading-relaxed mt-5">
                  Developed a Python-based Geolocation Tool that retrieves and analyzes geographical location information
                  using Geolocation APIs and Python packages.
                </p>

                <div className="mt-5 grid md:grid-cols-2 gap-4">
                  <div className={`${glassInner} p-5`}>
                    <p className="text-white/75">
                      <b className="text-white/90">Tech Stack:</b> Python, Geolocation APIs, Python Geolocation & Networking Libraries
                    </p>
                  </div>
                  <div className={`${glassInner} p-5`}>
                    <p className="text-white/75">
                      <b className="text-white/90">Highlights:</b>
                    </p>
                    <ul className="list-disc pl-6 text-white/75 mt-2 space-y-1">
                      <li>Real-time IP-based location detection</li>
                      <li>Extracts country, city, region, coordinates & ISP</li>
                      <li>Clean command-line interface</li>
                      <li>Modular & extendable architecture</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          )}

          {activeTab === 'experience' && (
            <motion.section
              key="experience"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="py-10 sm:py-14 max-w-6xl mx-auto"
            >
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 h-full w-[2px] bg-gradient-to-b from-white/25 via-white/10 to-white/20" />

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55 }}
                  className="relative mb-10 sm:mb-14 md:w-1/2 md:pr-12 md:text-right"
                >
                  <span className="absolute left-1 md:left-auto md:-right-3 top-3 h-4 w-4 rounded-full bg-white/80 shadow-lg shadow-white/20" />
                  <div className={`${glassCard} p-6 sm:p-8`}>
                    <div className="flex items-start justify-between gap-4 md:flex-row-reverse">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/95">
                        Open Source Contributor – SWOC ’26
                      </h2>
                      <span className="rounded-full px-3 py-1 text-xs bg-black/25 border border-white/10 text-white/70 backdrop-blur-xl">
                        2026
                      </span>
                    </div>
                    <p className="text-white/75 leading-relaxed mt-4">
                      Actively contributing to open-source projects under SWOC ’26, focusing on building scalable and
                      maintainable software solutions. Gained hands-on experience collaborating with global developers,
                      implementing features, fixing bugs, and improving project documentation.
                    </p>
                    <p className="text-white/60 mt-3">
                      <b className="text-white/90">Tech Stack:</b> Java, Spring Boot, HTML, CSS, Git, GitHub
                    </p>
                    <ul className="list-disc md:list-inside pl-6 md:pl-0 text-white/75 mt-4 space-y-2">
                      <li>Enhanced code quality across multiple repositories</li>
                      <li>Developed Spring Boot backend services</li>
                      <li>Collaborated via GitHub PRs and code reviews</li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: 0.12 }}
                  className="relative md:ml-auto md:w-1/2 md:pl-12"
                >
                  <span className="absolute left-1 md:left-1/2 md:-ml-2 top-3 h-4 w-4 rounded-full bg-white/70 shadow-lg shadow-white/20" />
                  <div className={`${glassCard} p-6 sm:p-8`}>
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/95">
                        Software Development Intern – CodeAlpha
                      </h2>
                      <span className="rounded-full px-3 py-1 text-xs bg-black/25 border border-white/10 text-white/70 backdrop-blur-xl">
                        Internship
                      </span>
                    </div>
                    <p className="text-white/75 leading-relaxed mt-4">
                      Completed an industry-focused internship gaining hands-on experience in Java, collections, REST APIs,
                      and Spring Boot. Developed and optimized backend services following clean architecture principles.
                    </p>
                    <p className="text-white/60 mt-3">
                      <b className="text-white/90">Tech Stack:</b> Java, Spring Boot, REST API, Collections
                    </p>
                    <ul className="list-disc pl-6 text-white/75 mt-4 space-y-2">
                      <li>Built and tested RESTful APIs for application modules</li>
                      <li>Applied Java collections for efficient data handling</li>
                      <li>Followed industry-standard coding practices</li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {activeTab === 'links' && (
            <motion.section
              key="links"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="py-10 sm:py-14 max-w-6xl mx-auto"
            >
              <div className="mb-6 sm:mb-10 grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className={`${glassCard} p-6 sm:p-7`}>
                  <p className="text-white/60 text-sm">Total Views</p>
                  <p className="text-4xl font-bold bg-[linear-gradient(90deg,rgba(255,255,255,0.95),rgba(255,255,255,0.65))] bg-clip-text text-transparent mt-2">
                    {linksViews}
                  </p>
                  <p className="text-white/50 text-xs mt-2">Counts only on this device (no backend analytics).</p>
                </div>
                <div className={`${glassCard} p-6 sm:p-7`}>
                  <p className="text-white/60 text-sm">Quick Links</p>
                  <p className="text-white/75 mt-2">Open my profiles with one click.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 sm:gap-7">
                <motion.a
                  whileHover={{ y: -5, scale: 1.02 }}
                  href="https://www.linkedin.com/in/ganesh-jayachandran/"
                  target="_blank"
                  rel="noreferrer"
                  className={`${glassCard} p-7 sm:p-8 text-center hover:bg-white/[0.10] transition`}
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <FaLinkedin size={34} className="text-white/90" />
                    <h3 className="text-2xl font-bold bg-[linear-gradient(90deg,rgba(255,255,255,0.95),rgba(255,255,255,0.65))] bg-clip-text text-transparent">
                      LinkedIn
                    </h3>
                  </div>
                  <p className="text-white/75">Connect with me professionally</p>
                  <p className="text-white/50 text-sm mt-3 hover:text-white/70 transition">Open profile →</p>
                </motion.a>

                <motion.a
                  whileHover={{ y: -5, scale: 1.02 }}
                  href="https://leetcode.com/u/ganesgg982/"
                  target="_blank"
                  rel="noreferrer"
                  className={`${glassCard} p-7 sm:p-8 text-center hover:bg-white/[0.10] transition`}
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <SiLeetcode size={34} className="text-white/90" />
                    <h3 className="text-2xl font-bold bg-[linear-gradient(90deg,rgba(255,255,255,0.95),rgba(255,255,255,0.65))] bg-clip-text text-transparent">
                      LeetCode
                    </h3>
                  </div>
                  <p className="text-white/75">View my coding practice & problem solving</p>
                  <p className="text-white/50 text-sm mt-3 hover:text-white/70 transition">Open profile →</p>
                </motion.a>

                <motion.a
                  whileHover={{ y: -5, scale: 1.02 }}
                  href="https://github.com/Ganesh0414"
                  target="_blank"
                  rel="noreferrer"
                  className={`${glassCard} p-7 sm:p-8 text-center hover:bg-white/[0.10] transition`}
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <FaGithub size={34} className="text-white/90" />
                    <h3 className="text-2xl font-bold bg-[linear-gradient(90deg,rgba(255,255,255,0.95),rgba(255,255,255,0.65))] bg-clip-text text-transparent">
                      GitHub
                    </h3>
                  </div>
                  <p className="text-white/75">Explore my projects & open-source work</p>
                  <p className="text-white/50 text-sm mt-3 hover:text-white/70 transition">Open profile →</p>
                </motion.a>
              </div>
            </motion.section>
          )}

          {activeTab === 'contact' && (
            <motion.section
              key="contact"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="py-10 sm:py-14 max-w-md mx-auto"
            >
              <motion.form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSentMsg(`Thank you ${formData.name || 'Friend'}! Your message has been sent.`);
                }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className={`space-y-3 ${glassCard} p-6 sm:p-7`}
              >
                <h3 className="text-3xl font-bold bg-[linear-gradient(90deg,rgba(255,255,255,0.95),rgba(255,255,255,0.65))] bg-clip-text text-transparent text-center mb-2">
                  Contact Me
                </h3>

                <input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`block w-full p-3 rounded-2xl ${glassInner} text-white/90 placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/35`}
                />
                <input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`block w-full p-3 rounded-2xl ${glassInner} text-white/90 placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/35`}
                />
                <textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`block w-full p-3 rounded-2xl ${glassInner} text-white/90 placeholder:text-white/35 h-32 focus:outline-none focus:ring-2 focus:ring-white/35`}
                />

                {sentMsg && (
                  <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-300 text-center pt-2">
                    {sentMsg}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-4 py-3 rounded-2xl font-semibold text-black"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.72))',
                  }}
                >
                  Send
                </motion.button>
              </motion.form>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-10 pt-6 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} Ganesh Kannan J • Built with React & Framer Motion
      </div>
    </div>
  );
}
