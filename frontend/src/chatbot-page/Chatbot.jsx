import React from 'react';

const Chatbot = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar estilo SENATI */}
      <nav className="bg-[#003366] p-4 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter">
            SENATI | <span className="font-light">Admisión 2026</span>
          </h1>
          <span className="text-sm bg-blue-500 px-3 py-1 rounded-full uppercase">
            Módulo de Atención
          </span>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="container mx-auto mt-10 p-6 flex flex-col md:flex-row gap-8 flex-grow">
        
        {/* Lado Izquierdo: Info */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl font-extrabold text-slate-800">
            Inicia tu futuro tecnológico hoy.
          </h2>
          <p className="text-lg text-slate-600">
            Bienvenido al portal oficial de matrículas. Nuestro asistente virtual está listo para ayudarte con tus requisitos, pagos y horarios.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8 text-center">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-blue-600 font-bold text-xl">20 Abr</p>
              <p className="text-xs uppercase text-slate-400">Inicio de Clases</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-blue-600 font-bold text-xl">S/ 150</p>
              <p className="text-xs uppercase text-slate-400">Costo Matrícula</p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: EL CHATBOT (Tu n8n) */}
        <div className="md:w-1/2 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
          <iframe
            src="https://silvadata.me/n8n/webhook/c8ae313e-45df-4b30-a0f2-11bfab23bea2/chat"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="EduBot SENATI"
          ></iframe>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto text-center p-6 text-slate-400 text-sm">
        Desarrollado por el Ing. Sebastián Silva &copy; 2026
      </footer>
    </div>
  );
};

export default Chatbot;