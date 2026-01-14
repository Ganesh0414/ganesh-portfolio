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
      r: 0.8 + Math.random() * 2.2,
      vx: (-0.35 + Math.random() * 0.7) * 0.9,
      vy: (-0.35 + Math.random() * 0.7) * 0.9,
      a: 0.15 + Math.random() * 0.35,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const grd = ctx.createRadialGradient(
        window.innerWidth * 0.5,
        window.innerHeight * 0.35,
        40,
        window.innerWidth * 0.5,
        window.innerHeight * 0.35,
        Math.max(window.innerWidth, window.innerHeight)
      );
      grd.addColorStop(0, 'rgba(34,211,238,0.08)');
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
        ctx.fillStyle = `rgba(34,211,238,${p.a})`;
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
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
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

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-70" aria-hidden="true" />;
}

type TabKey = 'home' | 'skills' | 'projects' | 'experience' | 'links' | 'contact';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const [formData, setFormData] = useState({ name: '', email: 'ganesh@email.com', message: '' });
  const [sentMsg, setSentMsg] = useState('');

  // Links views (local device only)
  const [linksViews, setLinksViews] = useState(0);

  const tabs = useMemo(() => ['home', 'skills', 'projects', 'experience', 'links', 'contact'] as const, []);

  // Load persisted views
  useEffect(() => {
    try {
      const v = Number(localStorage.getItem('gk_links_views') || '0');
      setLinksViews(Number.isFinite(v) ? v : 0);
    } catch {
      // ignore
    }
  }, []);

  // Count a view when the Links tab is opened (once per session)
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

  const typedName = useTypewriter('Ganesh Kannan J', 65, 1500);
  const roles = useMemo(
    () => [
      'Aspiring Software Developer',
      'Java • Spring Boot Developer',
      'Web Development Enthusiast',
      'Open Source Contributor',
    ],
    []
  );
  const [roleIdx, setRoleIdx] = useState(0);
  const typedRole = useTypewriter(roles[roleIdx], 55, 900);

  useEffect(() => {
    const id = window.setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 4200);
    return () => window.clearInterval(id);
  }, [roles.length]);

  const skills = useMemo(
    () => [
      { name: 'Java', icon: <FaJava size={44} className="mx-auto mb-2" /> },
      { name: 'Spring Boot', icon: <SiSpringboot size={44} className="mx-auto mb-2" /> },
      { name: 'Python', icon: <FaPython size={44} className="mx-auto mb-2" /> },
      { name: 'React', icon: <FaReact size={44} className="mx-auto mb-2" /> },
      { name: 'HTML', icon: <FaHtml5 size={44} className="mx-auto mb-2" /> },
      { name: 'CSS', icon: <FaCss3Alt size={44} className="mx-auto mb-2" /> },
      { name: 'JavaScript', icon: <FaJs size={44} className="mx-auto mb-2" /> },
    ],
    []
  );

  return (
    <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
      <ParticleBackground />

      <nav className="fixed top-0 w-full bg-black/60 backdrop-blur-xl z-50 flex justify-center gap-6 md:gap-10 py-4 px-3 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`transition hover:text-cyan-300 ${
              activeTab === tab ? 'text-cyan-300 font-semibold' : 'text-white/80'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <div className="pt-28 px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
              className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
            >
              <div className="relative">
                <div className="absolute -inset-12 rounded-full blur-3xl opacity-30 bg-cyan-400/20" />
                <h1 className="relative text-5xl md:text-7xl font-bold text-cyan-300 mb-4">
                  <span className="inline-block whitespace-nowrap overflow-hidden border-r-4 border-cyan-300 pr-2">
                    {typedName || ' '}
                  </span>
                </h1>
              </div>

              <p className="text-white/80 mb-5 text-base md:text-lg">
                <span className="text-white/60">{typedRole}</span>
                <span className="inline-block w-3 text-cyan-300">|</span>
              </p>

              <p className="text-white/70 text-lg leading-relaxed max-w-3xl">
                I am an aspiring Software Developer with a strong foundation in Java, Spring Boot, and Web Development. I am
                passionate about building scalable, efficient applications. I enjoy contributing to open-source projects,
                collaborating with developer communities, and learning modern technologies to create impactful digital
                solutions.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.a
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  href="https://drive.google.com/file/d/1CPFhY2HmVkMMtTyPpfC_6Aiifj7C0yJL/view?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-3 rounded-full bg-cyan-300 text-black font-semibold shadow-lg shadow-cyan-300/20 hover:shadow-cyan-300/35 transition"
                >
                  Download Resume
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveTab('projects')}
                  className="px-8 py-3 rounded-full border border-cyan-300/40 bg-white/5 text-white hover:bg-white/10 transition"
                >
                  View Projects
                </motion.button>
              </div>
            </motion.section>
          )}

          {activeTab === 'skills' && (
            <motion.section
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="py-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {skills.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.92, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 120, damping: 14 }}
                  whileHover={{ scale: 1.03 }}
                  className="relative border border-cyan-300/25 bg-white/5 p-7 rounded-2xl text-center overflow-hidden"
                >
                  <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl" />
                  <div className="relative">
                    {s.icon}
                    <h3 className="mt-2 text-xl font-semibold text-white/90">{s.name}</h3>
                    <div className="mt-5 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${70 + (i % 4) * 6}%` }}
                        transition={{ duration: 1.2, delay: i * 0.08 }}
                        className="h-2 bg-cyan-300 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="py-16 space-y-8 max-w-5xl mx-auto"
            >
              <div className="border border-cyan-300/25 bg-white/5 p-8 rounded-2xl">
                <h2 className="text-3xl text-cyan-300 mb-3">AI-Powered Chat Application (Spring Boot REST API)</h2>      
                <p className="text-white/70 leading-relaxed">
                  Developed a full-stack AI-powered Chat Application using Spring Boot REST API integrated with the ChatGPT
                  OpenAI API to provide intelligent, real-time conversational responses.
                </p>
                <p className="text-white/60 mt-3">
                  <b className="text-white/80">Tech Stack:</b> React, HTML, CSS, JavaScript, Java, Spring Boot (REST API),
                  OpenAI ChatGPT API
                </p>
                <ul className="list-disc pl-6 text-white/70 mt-4 space-y-1">
                  <li>Built secure REST APIs for real-time AI responses</li>
                  <li>Integrated ChatGPT API for intelligent conversation</li>
                  <li>Implemented clean UI/UX for smooth chat flow</li>
                  <li>Designed scalable backend architecture</li>
                </ul>
                <br />
                <motion.a
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  href="https://github.com/Ganesh0414/CodeAlpha_Artificial-Intelligence"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-3 rounded-full bg-cyan-300 text-black font-semibold shadow-lg shadow-cyan-300/20 hover:shadow-cyan-300/35 transition"
                >
                  Visit Project
                </motion.a>
              </div>

              <div className="border border-cyan-300/25 bg-white/5 p-8 rounded-2xl">
                <h2 className="text-3xl text-cyan-300 mb-3">Python Geolocation Tool</h2>
                <p className="text-white/70 leading-relaxed">
                  Developed a Python-based Geolocation Tool that retrieves and analyzes geographical location information
                  using Geolocation APIs and Python packages.
                </p>
                <p className="text-white/60 mt-3">
                  <b className="text-white/80">Tech Stack:</b> Python, Geolocation APIs, Python Geolocation & Networking
                  Libraries
                </p>
                <ul className="list-disc pl-6 text-white/70 mt-4 space-y-1">
                  <li>Real-time IP-based location detection</li>
                  <li>Extracts country, city, region, coordinates & ISP</li>
                  <li>Clean command-line interface for easy usage</li>
                  <li>Modular and extendable Python architecture</li>
                </ul>
                 <br />
                <motion.a
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  href="https://github.com/Ganesh0414/Track_phone"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-3 rounded-full bg-cyan-300 text-black font-semibold shadow-lg shadow-cyan-300/20 hover:shadow-cyan-300/35 transition"
                >
                  Visit Project
                </motion.a>
              </div>
            </motion.section>
          )}

          {activeTab === 'experience' && (
            <motion.section
              key="experience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="py-16 max-w-6xl mx-auto"
            >
              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 md:left-1/2 top-0 h-full w-[2px] bg-cyan-300/30" />

                {/* Item 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative mb-16 md:w-1/2 md:pr-12 md:text-right"
                >
                  <span className="absolute left-1 md:left-auto md:-right-3 top-2 h-4 w-4 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/40" />
                  <div className="border border-cyan-300/25 bg-white/5 p-8 rounded-2xl">
                    <h2 className="text-3xl text-cyan-300 mb-3">Open Source Contributor – SWOC ’26</h2>
                    <p className="text-white/70 leading-relaxed">
                      Actively contributing to open-source projects under SWOC ’26, focusing on building scalable and
                      maintainable software solutions. Collaborated with global developers, implemented features, fixed
                      bugs, and improved documentation.
                    </p>
                    <p className="text-white/60 mt-3">
                      <b className="text-white/80">Tech Stack:</b> Java, Spring Boot, HTML, CSS, Git, GitHub
                    </p>
                    <ul className="list-disc md:list-inside pl-6 md:pl-0 text-white/70 mt-4 space-y-2">
                      <li>Enhanced code quality across multiple repositories</li>
                      <li>Developed Spring Boot backend services</li>
                      <li>Collaborated via GitHub PRs and reviews</li>
                    </ul>
                  </div>
                </motion.div>

                {/* Item 2 */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative md:ml-auto md:w-1/2 md:pl-12"
                >
                  <span className="absolute left-1 md:left-1/2 md:-ml-2 top-2 h-4 w-4 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/40" />
                  <div className="border border-cyan-300/25 bg-white/5 p-8 rounded-2xl">
                    <h2 className="text-3xl text-cyan-300 mb-3">Software Development Intern – CodeAlpha</h2>
                    <p className="text-white/70 leading-relaxed">
                      Completed an industry-focused internship gaining hands-on experience in Java, collections, REST APIs,
                      and Spring Boot. Built and optimized backend services following clean architecture principles.
                    </p>
                    <p className="text-white/60 mt-3">
                      <b className="text-white/80">Tech Stack:</b> Java, Spring Boot, REST API, Collections
                    </p>
                    <ul className="list-disc pl-6 text-white/70 mt-4 space-y-2">
                      <li>Built and tested RESTful APIs</li>
                      <li>Used Java collections for efficient data handling</li>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="py-16 max-w-6xl mx-auto"
            >
              <div className="mb-10 grid md:grid-cols-2 gap-6">
                <div className="border border-cyan-300/25 bg-white/5 p-6 rounded-2xl">
                  <p className="text-white/60 text-sm">Total Views</p>
                  <p className="text-4xl font-bold text-cyan-300 mt-2">{linksViews}</p>
                  <p className="text-white/50 text-xs mt-2">Counts only on this device (no backend analytics).</p>
                </div>
                <div className="border border-cyan-300/25 bg-white/5 p-6 rounded-2xl">
                  <p className="text-white/60 text-sm">Quick Links</p>
                  <p className="text-white/70 mt-2">Open my profiles with one click.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="https://www.linkedin.com/in/ganesh-jayachandran/"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-cyan-300/25 bg-white/5 p-8 rounded-2xl text-center hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <FaLinkedin size={34} className="text-cyan-300" />
                    <h3 className="text-3xl text-cyan-300">LinkedIn</h3>
                  </div>
                  <p className="text-white/70">Connect with me professionally</p>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="https://leetcode.com/u/ganesgg982/"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-cyan-300/25 bg-white/5 p-8 rounded-2xl text-center hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <SiLeetcode size={34} className="text-cyan-300" />
                    <h3 className="text-3xl text-cyan-300">LeetCode</h3>
                  </div>
                  <p className="text-white/70">View my coding practice & problem solving</p>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="https://github.com/Ganesh0414"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-cyan-300/25 bg-white/5 p-8 rounded-2xl text-center hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <FaGithub size={34} className="text-cyan-300" />
                    <h3 className="text-3xl text-cyan-300">GitHub</h3>
                  </div>
                  <p className="text-white/70">Explore my projects & open-source work</p>
                </motion.a>
              </div>
            </motion.section>
          )}

          {activeTab === 'contact' && (
            <motion.section
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="py-16 max-w-md mx-auto"
            >
              <motion.form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSentMsg(`Thank you ${formData.name || 'Friend'}! Your message has been sent.`);
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-3 border border-cyan-300/25 bg-white/5 p-6 rounded-2xl"
              >
                <h3 className="text-3xl text-cyan-300 text-center mb-2">Contact Me</h3>

                <input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full p-3 rounded bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full p-3 rounded bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="block w-full p-3 rounded bg-black/50 border border-white/10 h-32 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />

                {sentMsg && <p className="text-green-400 text-center pt-2">{sentMsg}</p>}

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="w-full bg-cyan-300 text-black px-4 py-3 rounded-xl font-semibold"
                >
                  Send
                </motion.button>
              </motion.form>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
