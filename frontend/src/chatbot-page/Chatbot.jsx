import React from 'react';

const Chatbot = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      
      {/* Navbar Premium con gradiente y efecto blur */}
      <nav className="bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#004b87] p-4 shadow-xl border-b border-blue-800/50 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            {/* Logo/Icono minimalista */}
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
              <span className="text-white font-black text-xl tracking-tighter">S</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-white drop-shadow-md">
              SENATI <span className="font-light opacity-80 pl-2 border-l border-blue-400 ml-1">Admisión 2026</span>
            </h1>
          </div>
          
          {/* Indicador de "Bot Online" animado */}
          <div className="hidden md:flex items-center gap-2 bg-black/20 border border-white/10 px-4 py-1.5 rounded-full shadow-inner backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-blue-50 uppercase">
              IA En Línea
            </span>
          </div>
        </div>
      </nav>

      {/* Luces de fondo (Background Glow) para darle el toque Tech */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute top-[30%] right-[-5%] w-[30%] h-[30%] rounded-full bg-cyan-400/10 blur-[100px]"></div>
      </div>

      {/* Contenido Principal */}
      <main className="container mx-auto mt-12 p-6 flex flex-col lg:flex-row gap-12 flex-grow relative z-10 items-center">
        
        {/* Lado Izquierdo: Info */}
        <div className="lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 text-[#003366] text-sm font-semibold border border-blue-200 backdrop-blur-sm shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
              Proceso de Matrícula Abierto
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-extrabold text-slate-800 leading-[1.1] tracking-tight">
              Inicia tu <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003366] via-blue-600 to-cyan-500 drop-shadow-sm">
                futuro tecnológico
              </span>
            </h2>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg mt-6">
              Bienvenido al portal oficial. Nuestro modelo de inteligencia artificial está listo para asistirte con requisitos, aulas, horarios y pagos en tiempo real.
            </p>
          </div>

          {/* Tarjetas interactivas */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#003366] transition-colors duration-300">
                <svg className="w-7 h-7 text-[#003366] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <p className="text-3xl font-black text-slate-800 tracking-tight">20 Abr</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Inicio de Clases</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-500 transition-colors duration-300">
                <svg className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p className="text-3xl font-black text-slate-800 tracking-tight">S/ 150</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Costo Matrícula</p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: EL CHATBOT */}
        <div className="lg:w-1/2 w-full max-w-2xl mx-auto">
          {/* Efecto de resplandor trasero (Glow) */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-[#003366] rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            {/* Contenedor del Iframe con estilo de ventana de sistema */}
            <div className="relative h-[650px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100/50 flex flex-col">
              
              {/* Barra superior estilo MacOS/Terminal */}
              <div className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-red-400 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-amber-400 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-green-400 transition-colors"></div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Conexión Encriptada
                </div>
                <div className="w-12"></div> {/* Spacer para centrar */}
              </div>
              
              <iframe
                src="https://silvadata.me/n8n/webhook/c8ae313e-45df-4b30-a0f2-11bfab23bea2/chat"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="EduBot SENATI"
                className="flex-grow bg-slate-50"
              ></iframe>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Minimalista */}
      <footer className="relative z-10 text-center p-8 mt-auto border-t border-slate-200/60 bg-white/30 backdrop-blur-md">
        <p className="text-slate-600 font-medium tracking-wide">
          Desarrollado en <span className="font-bold text-[#003366]">Python & React</span> por el <span className="font-black text-slate-800">Ing. Sebastián Silva</span>
        </p>
      </footer>
    </div>
  );
};

export default Chatbot;