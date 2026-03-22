import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  // 1. CARGAMOS TUS DATOS REALES DE POSTGRESQL
  useEffect(() => {
    // Si la base de datos está vacía o el servidor apagado, capturamos el error para que la página no se rompa
    axios.get('http://163.176.173.160:8000/api/projects/')
      .then(res => setProjects(res.data))
      .catch(err => console.error("Error cargando proyectos:", err));
      
    axios.get('http://163.176.173.160:8000/api/certifications/')
      .then(res => setCertifications(res.data))
      .catch(err => console.error("Error cargando certificaciones:", err));
    
    // Lógica de Scroll Progress
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  // 2. ENVÍO DE MENSAJES AL INBOX DEL SYSTEM CORE
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/contact/', formData)
      .then(() => {
        setStatus('Mensaje enviado. Lo revisaré en el System Core.');
        setFormData({ name: '', email: '', message: '' });
      })
      .catch(() => setStatus('Error al enviar. Inténtalo de nuevo.'));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-600 font-sans relative">
      
      {/* EFECTOS VISUALES */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="fixed top-0 left-0 h-[2px] bg-blue-600 z-[60] transition-all duration-150" style={{ width: `${scrollProgress}%` }}></div>

      {/* NAVEGACIÓN */}
      <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex justify-between items-center">
        <Link to="/panel" className="font-black tracking-tighter text-2xl uppercase hover:text-blue-500 transition-colors" title="Acceso al System Core">
          SILVA<span className="text-blue-600">.</span>
        </Link>
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
          <a href="#trayectoria" className="hover:text-white transition-colors">Trayectoria</a>
          <a href="#proyectos" className="hover:text-white transition-colors">Proyectos</a>
          <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32">
        
        {/* 1. HERO SECTION */}
        <header className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black mb-8 tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Status: Preparando Interview Nestlé
            </div>
            
            <h1 className="text-7xl md:text-[110px] font-black leading-[0.8] tracking-tighter mb-10 uppercase">
              SEBASTIÁN<br/>SILVA<br/><span className="text-gray-500">MENDOZA.</span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-lg leading-relaxed mb-10">
              Ingeniero de Ciencia de Datos & IA. Estudiante en SENATI, especializado en la transformación de datos complejos mediante arquitectura Kimball y flujos ETL en activos estratégicos.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <a href="#contacto" className="bg-white text-black px-10 py-4 rounded-full font-black hover:scale-105 transition-all uppercase text-sm">Contratame</a>
              <a href="/Curriculum_final_20_03_2026.pdf" download className="px-10 py-4 border border-gray-800 rounded-full font-black hover:bg-white/5 transition-all uppercase text-sm text-center">Descargar CV</a>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 group shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
             <img 
               src="/FotoPortada.png" 
               className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
               alt="Sebastián Silva"
             />
             <div className="absolute bottom-10 left-10 z-20">
                <p className="text-[10px] font-mono text-blue-500 mb-2 tracking-[0.5em] uppercase">Ventanilla, Callao</p>
             </div>
          </div>
        </header>

        {/* 2. DATA INSIGHTS (Métricas Técnicas) */}
        <section className="mb-40 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Especialidad', val: 'Metodología Kimball' },
            { label: 'Integración', val: 'SSIS & n8n' },
            { label: 'Visualización', val: 'Power BI Advanced' },
            { label: 'Análisis', val: 'SQL Server & Python' }
          ].map((item, i) => (
            <div key={i} className="p-10 border border-white/5 rounded-[2rem] bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
              <p className="text-blue-500 text-[10px] font-black uppercase mb-4 tracking-[0.2em]">{item.label}</p>
              <p className="text-2xl font-black text-white leading-none uppercase">{item.val}</p>
            </div>
          ))}
        </section>

        {/* 3. TRAYECTORIA PROFESIONAL */}
        <section id="trayectoria" className="mb-40">
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.4em] mb-16 px-4 border-l-2 border-blue-600">Trayectoria & Educación</h2>
          <div className="space-y-1">
            <div className="group grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 p-10 border-b border-white/5 hover:bg-white/[0.02] transition-all">
              <span className="text-gray-600 font-mono text-sm uppercase">2026 — ACTUALIDAD</span>
              <div>
                <h3 className="text-2xl font-black uppercase group-hover:text-blue-500 transition-colors">Backend Developer Intern</h3>
                <p className="text-gray-400 mt-2 max-w-2xl">Desarrollo de módulos de facturación y lógica de negocio para sistemas ERP mediante React, Vite y Supabase.</p>
              </div>
            </div>
            <div className="group grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 p-10 border-b border-white/5 hover:bg-white/[0.02] transition-all">
              <span className="text-gray-600 font-mono text-sm uppercase">2024 — 2027 (EGRESO)</span>
              <div>
                <h3 className="text-2xl font-black uppercase group-hover:text-blue-500 transition-colors">Ciencia de Datos e IA</h3>
                <p className="text-gray-400 mt-2 max-w-2xl">Formación académica en SENATI enfocada en Inteligencia de Negocios, Estadística Aplicada e Integración de Datos.</p>
              </div>
            </div>
            <div className="group grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 p-10 border-b border-white/5 hover:bg-white/[0.02] transition-all">
              <span className="text-gray-600 font-mono text-sm uppercase">2024 — ACTUALIDAD</span>
              <div>
                <h3 className="text-2xl font-black uppercase group-hover:text-blue-500 transition-colors">Freelance BI Developer</h3>
                <p className="text-gray-400 mt-2 max-w-2xl">Diseño de Datamarts para el sector textil en Gamarra, optimizando el análisis de ventas e inventarios mediante SQL Server y Power BI.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CARRUSEL INFINITO DE CERTIFICACIONES */}
        {certifications.length > 0 && (
          <section className="mb-40 border-y border-white/5 py-12 overflow-hidden relative">
            <h2 className="text-[10px] font-black text-center text-gray-500 uppercase tracking-[0.4em] mb-10">Certificaciones & Partners</h2>
            
            {/* Sombras en los bordes para un efecto suave */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-fit animate-infinite-scroll hover:animation-play-state-paused">
              {/* Duplicamos el array para que el scroll sea infinito y fluido */}
              {[...certifications, ...certifications].map((cert, index) => (
                <div key={index} className="flex flex-col items-center justify-center min-w-[200px] md:min-w-[250px] mx-8 group">
                  <a href={cert.certificate_link} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center w-full">
                    {cert.issuer_logo ? (
                      <img src={`http://163.176.173.160:8000${cert.issuer_logo}`} alt={cert.issuer} className="h-12 md:h-16 object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 mb-4" />
                    ) : (
                      <div className="h-12 md:h-16 flex items-center justify-center font-black text-lg md:text-xl text-gray-600 uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{cert.issuer}</div>
                    )}
                    <p className="text-[9px] md:text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center mt-2 group-hover:text-blue-400 transition-colors line-clamp-1 px-4">{cert.name}</p>
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. PROYECTOS DESTACADOS (Desde PostgreSQL) */}
        <section id="proyectos" className="mb-40">
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-6xl font-black tracking-tighter uppercase">Proyectos<br/>Destacados<span className="text-blue-600">.</span></h2>
          </div>
          
          {projects.length === 0 ? (
            <div className="p-10 border border-white/5 rounded-[2rem] bg-white/[0.01] text-center">
              <p className="text-gray-500 font-mono tracking-widest text-sm uppercase animate-pulse">Cargando módulos desde la base de datos de System Core...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projects.map(p => (
                <div key={p.id} className="group flex flex-col h-full">
                  <div className="aspect-video bg-[#0a0a0a] rounded-[2.5rem] mb-8 overflow-hidden border border-white/5 relative shadow-xl">
                    {p.image ? (
                      <img src={p.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={p.title} />
                    ) : (
                      <div className="h-full flex items-center justify-center font-mono text-[10px] text-gray-800 tracking-[0.8em] uppercase">SYSTEM_PREVIEW_OFF</div>
                    )}
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-3 tracking-tighter">{p.title}</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed text-lg line-clamp-3 flex-grow">{p.description}</p>
                  
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto mb-6">
                        {/* Ahora 't' es el nombre real (ej: "Python"), ya no es un número */}
                        {p.technologies.map(t => (
                        <span key={t} className="text-[9px] font-black px-3 py-1 bg-white/5 rounded-full uppercase tracking-widest text-blue-400">
                            {t}
                        </span>
                        ))}
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    {p.github_link && <a href={p.github_link} target="_blank" rel="noreferrer" className="text-xs font-black uppercase border-b-2 border-transparent hover:border-blue-600 pb-1 transition-colors">Ver Código</a>}
                    {p.live_link && <a href={p.live_link} target="_blank" rel="noreferrer" className="text-xs font-black uppercase border-b-2 border-transparent hover:border-blue-600 pb-1 transition-colors text-blue-500">Deploy</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. SOBRE MÍ / LIFESTYLE */}
        <section className="mb-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center bg-white/[0.02] rounded-[3rem] p-12 md:p-20 border border-white/5">
           <div>
              <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.4em] mb-8">Personal Stack</h2>
              <p className="text-3xl font-bold leading-tight mb-8">
                Más allá del código, me enfoco en el desarrollo personal, el fitness y la cultura JDM/Car Tuning.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Mi objetivo para finales de 2026 es alcanzar la independencia financiera total mientras sigo construyendo soluciones tecnológicas de alto nivel.
              </p>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-white/5 rounded-3xl flex items-center justify-center text-[10px] font-mono text-gray-600 uppercase tracking-widest text-center px-2">Fitness / Gym</div>
              <div className="aspect-square bg-blue-600 rounded-3xl flex items-center justify-center text-[10px] font-mono text-black font-black uppercase tracking-widest text-center px-2 shadow-lg shadow-blue-600/20">JDM Tuning (Civic)</div>
              <div className="aspect-square bg-white/5 rounded-3xl flex items-center justify-center text-[10px] font-mono text-gray-600 uppercase tracking-widest text-center px-2">Caña Brava (Business)</div>
              <div className="aspect-square bg-white/5 rounded-3xl flex items-center justify-center text-[10px] font-mono text-gray-600 uppercase tracking-widest text-center px-2">Data Science</div>
           </div>
        </section>

        {/* 7. CONTACTO */}
        <section id="contacto" className="mb-40 bg-blue-600 rounded-[3rem] p-12 md:p-24 text-black overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <span className="text-[150px] font-black tracking-tighter leading-none uppercase select-none">Contact</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
            <div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-10 uppercase">LET'S<br/>WORK.</h2>
              <p className="text-blue-950 font-bold text-xl max-w-xs">
                Abierto a oportunidades de prácticas pre-profesionales y proyectos estratégicos de Business Intelligence.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <input 
                type="text" placeholder="NOMBRE COMPLETO" 
                className="w-full bg-transparent border-b-2 border-black/20 p-4 placeholder:text-blue-900 font-black focus:border-black outline-none transition-all uppercase"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required
              />
              <input 
                type="email" placeholder="EMAIL DE CONTACTO" 
                className="w-full bg-transparent border-b-2 border-black/20 p-4 placeholder:text-blue-900 font-black focus:border-black outline-none transition-all uppercase"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required
              />
              <textarea 
                placeholder="TU MENSAJE" rows="4" 
                className="w-full bg-transparent border-b-2 border-black/20 p-4 placeholder:text-blue-900 font-black focus:border-black outline-none transition-all uppercase resize-none"
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required
              ></textarea>
              <button className="group bg-black text-white px-12 py-5 rounded-full font-black text-sm uppercase flex items-center gap-4 hover:scale-[1.02] transition-all">
                Enviar Mensaje <span className="group-hover:translate-x-2 transition-transform">→</span>
              </button>
              {status && <p className="font-black text-sm uppercase tracking-widest mt-4">{status}</p>}
            </form>
          </div>
        </section>

      </div>
      
      {/* FOOTER */}
      <footer className="p-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40 backdrop-blur-sm">
        <span className="font-black tracking-tighter text-xl uppercase">SILVA<span className="text-blue-600">.</span></span>
        <p className="text-gray-600 text-[10px] font-mono tracking-[0.4em] uppercase text-center">
          © 2026 Sebastián Silva Mendoza // Lima, Perú
        </p>
        <div className="flex gap-6">
          <a href="https://linkedin.com/in/sebastian-silva-mendoza" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline decoration-blue-600 decoration-2">LinkedIn</a>
          <a href="https://github.com/SebastianSilvaMendoza" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline decoration-blue-600 decoration-2">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

export default Portfolio;