import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Dashboard() {
  const [activeTab, setActiveTab] = useState('PROYECTOS');
  
  // Estados para almacenar la data de la base de datos
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Estados para los formularios
  const [newTech, setNewTech] = useState('');
  const [projectForm, setProjectForm] = useState({ title: '', description: '', github_link: '', live_link: '' });
  const [projectImage, setProjectImage] = useState(null);
  const [selectedTechs, setSelectedTechs] = useState([]);

  const [certForm, setCertForm] = useState({ name: '', issuer: '', certificate_link: '', date_earned: '' });
  const [certLogo, setCertLogo] = useState(null);
  const navigate = useNavigate();
  // Cargar datos iniciales
  const fetchData = () => {
    axios.get('http://localhost:8000/api/contact/').then(res => setMessages(res.data)).catch(() => {});
    axios.get('http://localhost:8000/api/projects/').then(res => setProjects(res.data)).catch(() => {});
    axios.get('http://localhost:8000/api/technologies/').then(res => setTechnologies(res.data)).catch(() => {});
    axios.get('http://localhost:8000/api/certifications/').then(res => setCertifications(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- MANEJADORES DE ENVÍO (POST) ---

  const handleAddTech = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/technologies/', { name: newTech });
      setNewTech('');
      fetchData(); // Recargar lista
    } catch (error) { console.error("Error al añadir tecnología", error); }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('github_link', projectForm.github_link);
    formData.append('live_link', projectForm.live_link);
    if (projectImage) formData.append('image', projectImage); // Aquí va la imagen física
    
    // Añadir tecnologías seleccionadas al FormData
    selectedTechs.forEach(techId => formData.append('technologies', techId));

    try {
      await axios.post('http://localhost:8000/api/projects/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProjectForm({ title: '', description: '', github_link: '', live_link: '' });
      setProjectImage(null);
      setSelectedTechs([]);
      fetchData();
      alert("Proyecto guardado con éxito");
    } catch (error) { console.error("Error al añadir proyecto", error); }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', certForm.name);
    formData.append('issuer', certForm.issuer);
    formData.append('certificate_link', certForm.certificate_link);
    if (certForm.date_earned) formData.append('date_earned', certForm.date_earned);
    if (certLogo) formData.append('issuer_logo', certLogo); // Aquí va el logo

    try {
      await axios.post('http://localhost:8000/api/certifications/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCertForm({ name: '', issuer: '', certificate_link: '', date_earned: '' });
      setCertLogo(null);
      fetchData();
      alert("Certificación guardada con éxito");
    } catch (error) { console.error("Error al añadir certificación", error); }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row font-sans selection:bg-blue-600">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-black border-r border-white/5 p-8 flex flex-col">
        <h1 className="text-2xl font-black tracking-tighter uppercase mb-12">SILVA<span className="text-blue-600">_OS</span></h1>
        
        <nav className="flex flex-col gap-4 flex-grow">
          {['MÉTRICAS', 'PROYECTOS', 'CERTIFICACIONES', 'TECNOLOGÍAS'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left text-xs font-black uppercase tracking-widest py-3 px-4 rounded transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <button 
            onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                navigate('/login');
            }}
            className="mt-auto px-6 py-3 border border-red-900/50 bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded font-black text-xs uppercase tracking-widest"
            >
            Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        
        {/* PESTAÑA MÉTRICAS & MENSAJES */}
        {activeTab === 'MÉTRICAS' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-8">Dashboard General</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl border-l-4 border-l-blue-600">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Proyectos</p>
                <p className="text-5xl font-black">{projects.length}</p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl border-l-4 border-l-green-600">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Mensajes Inbox</p>
                <p className="text-5xl font-black">{messages.length}</p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl border-l-4 border-l-purple-600">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Certificaciones</p>
                <p className="text-5xl font-black">{certifications.length}</p>
              </div>
            </div>

            <h3 className="text-xl font-black uppercase tracking-widest mb-6">Inbox (Recientes)</h3>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 overflow-x-auto">
              {messages.map(msg => (
                <div key={msg.id} className="border-b border-white/5 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                  <p className="font-bold text-blue-400">{msg.name} <span className="text-gray-500 font-mono text-xs">({msg.email})</span></p>
                  <p className="text-gray-400 text-sm mt-2">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA PROYECTOS */}
        {activeTab === 'PROYECTOS' && (
          <div className="animate-in fade-in duration-500 max-w-3xl">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-8">Gestor de Proyectos</h2>
            <form onSubmit={handleAddProject} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
              
              <div>
                <label className="block text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Título del Proyecto</label>
                <input type="text" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Descripción (Impacto de Negocio / ETL)</label>
                <textarea required rows="4" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-blue-500 resize-none"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Link GitHub</label>
                  <input type="url" value={projectForm.github_link} onChange={e => setProjectForm({...projectForm, github_link: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Link Deploy (Opcional)</label>
                  <input type="url" value={projectForm.live_link} onChange={e => setProjectForm({...projectForm, live_link: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-blue-500" />
                </div>
              </div>

              {/* UPLOAD DE IMAGEN */}
              <div>
                <label className="block text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Foto de Portada</label>
                <input type="file" accept="image/*" onChange={e => setProjectImage(e.target.files[0])} className="w-full bg-black border border-white/10 p-4 rounded text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
              </div>

              {/* SELECTOR DE TECNOLOGÍAS MÚLTIPLES */}
              <div>
                <label className="block text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Stack Tecnológico Utilizado</label>
                <div className="flex flex-wrap gap-3">
                  {technologies.map(tech => (
                    <label key={tech.id} className={`cursor-pointer px-4 py-2 border rounded text-xs font-black uppercase tracking-widest transition-all ${selectedTechs.includes(tech.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={selectedTechs.includes(tech.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedTechs([...selectedTechs, tech.id]);
                          else setSelectedTechs(selectedTechs.filter(id => id !== tech.id));
                        }}
                      />
                      {tech.name}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-white text-black font-black uppercase text-sm tracking-widest py-4 rounded hover:bg-blue-500 hover:text-white transition-all">
                Desplegar Proyecto
              </button>
            </form>
          </div>
        )}

        {/* PESTAÑA CERTIFICACIONES */}
        {activeTab === 'CERTIFICACIONES' && (
          <div className="animate-in fade-in duration-500 max-w-2xl">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-8">Añadir Logro</h2>
            <form onSubmit={handleAddCert} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-purple-500 font-black uppercase tracking-widest mb-2">Nombre del Certificado</label>
                  <input type="text" required value={certForm.name} onChange={e => setCertForm({...certForm, name: e.target.value})} placeholder="Ej: Meta Database Engineer" className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-[10px] text-purple-500 font-black uppercase tracking-widest mb-2">Emisor</label>
                  <input type="text" required value={certForm.issuer} onChange={e => setCertForm({...certForm, issuer: e.target.value})} placeholder="Ej: Coursera, IBM" className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-purple-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-purple-500 font-black uppercase tracking-widest mb-2">Fecha de Obtención</label>
                  <input type="date" value={certForm.date_earned} onChange={e => setCertForm({...certForm, date_earned: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-purple-500 text-gray-400" />
                </div>
                <div>
                  <label className="block text-[10px] text-purple-500 font-black uppercase tracking-widest mb-2">URL Credencial</label>
                  <input type="url" value={certForm.certificate_link} onChange={e => setCertForm({...certForm, certificate_link: e.target.value})} placeholder="https://..." className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-purple-500" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-purple-500 font-black uppercase tracking-widest mb-2">Logo de la Institución (Para el Carrusel)</label>
                <input type="file" accept="image/*" onChange={e => setCertLogo(e.target.files[0])} className="w-full bg-black border border-white/10 p-4 rounded text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer" />
              </div>

              <button type="submit" className="w-full bg-purple-600 text-white font-black uppercase text-sm tracking-widest py-4 rounded hover:bg-purple-700 transition-all">
                Registrar Certificación
              </button>
            </form>
          </div>
        )}

        {/* PESTAÑA TECNOLOGÍAS */}
        {activeTab === 'TECNOLOGÍAS' && (
          <div className="animate-in fade-in duration-500 max-w-md">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-8">Diccionario de Stack</h2>
            
            <form onSubmit={handleAddTech} className="mb-10 flex gap-4">
              <input 
                type="text" 
                required 
                placeholder="NUEVA TECNOLOGÍA..." 
                value={newTech} 
                onChange={e => setNewTech(e.target.value)} 
                className="flex-grow bg-[#0a0a0a] border border-white/10 p-4 rounded font-black uppercase outline-none focus:border-white transition-colors" 
              />
              <button type="submit" className="bg-white text-black px-6 font-black uppercase text-xs tracking-widest rounded hover:bg-gray-200 transition-colors">Añadir</button>
            </form>

            <div className="flex flex-wrap gap-3">
              {technologies.map(tech => (
                <span key={tech.id} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-gray-400">
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;