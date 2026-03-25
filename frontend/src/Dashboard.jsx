import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('PROYECTOS');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [jobs, setJobs] = useState([]);
  // Estados para almacenar la data de la base de datos
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [profile, setProfile] = useState({ id: 1, status_es: '', status_en: '' }); // Para el Status Dinámico
  const [filterProb, setFilterProb] = useState('TODAS'); // Filtro: TODAS, ALTA, MEDIA, BAJA
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Cuántos trabajos ver por página
  const [selectedJob, setSelectedJob] = useState(null); // Para guardar el trabajo seleccionado
  // Estados para los formularios
  const [newTech, setNewTech] = useState('');
  const [projectForm, setProjectForm] = useState({ title: '', description: '', github_link: '', live_link: '' });
  const [projectImage, setProjectImage] = useState(null);
  const [selectedTechs, setSelectedTechs] = useState([]);

  const [certForm, setCertForm] = useState({ name: '', issuer: '', certificate_link: '', date_earned: '' });
  const [certLogo, setCertLogo] = useState(null);
  
  const navigate = useNavigate();

  // URL Base para no repetir
  const API_URL = 'http://163.176.173.160:8000/api';

  // Cargar datos iniciales
  const fetchData = () => {
    axios.get(`${API_URL}/contact/`).then(res => setMessages(res.data)).catch(() => {});
    axios.get(`${API_URL}/projects/`).then(res => setProjects(res.data)).catch(() => {});
    axios.get(`${API_URL}/technologies/`).then(res => setTechnologies(res.data)).catch(() => {});
    axios.get(`${API_URL}/certifications/`).then(res => setCertifications(res.data)).catch(() => {});
    axios.get(`${API_URL}/jobs/`).then(res => setJobs(res.data)).catch(() => {});
    axios.get(`${API_URL}/profile/`).then(res => {
        if(res.data.length > 0) setProfile(res.data[0]);
    }).catch(() => {});
  };
  // 1. Filtrar los trabajos (Blindado contra nulos y mayúsculas)
  const filteredJobs = jobs.filter(job => {
    // Si el filtro es TODAS, dejamos pasar este trabajo
    if (filterProb === 'TODAS') return true;
    
    // AQUÍ ADENTRO extraemos y limpiamos la probabilidad de ESTE trabajo específico
    const prob = job.probabilidad_ia ? job.probabilidad_ia.toString().toUpperCase() : "";
    
    // Comparamos
    return prob === filterProb.toUpperCase();
  });

  // 2. Calcular paginación (Esto se mantiene igual, está perfecto)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // Resetear a la página 1 si cambiamos el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filterProb]);
  useEffect(() => {
    fetchData();
  }, []);

  // Limpiar formularios al cambiar o cancelar
  const resetForms = () => {
    setIsEditing(false);
    setEditId(null);
    setProjectForm({ title: '', description: '', github_link: '', live_link: '' });
    setCertForm({ name: '', issuer: '', certificate_link: '', date_earned: '' });
    setProjectImage(null);
    setCertLogo(null);
    setSelectedTechs([]);
  };

  // --- MANEJADORES DE EDICIÓN (CARGAR DATOS) ---
  const handleEditClick = (type, item) => {
    setIsEditing(true);
    setEditId(item.id);
    if (type === 'PROYECTO') {
      setActiveTab('PROYECTOS');
      setProjectForm({
        title: item.title,
        description: item.description,
        github_link: item.github_link || '',
        live_link: item.live_link || ''
      });
      setSelectedTechs(item.technologies || []);
    } else if (type === 'CERTIFICACION') {
      setActiveTab('CERTIFICACIONES');
      setCertForm({
        name: item.name,
        issuer: item.issuer,
        certificate_link: item.certificate_link || '',
        date_earned: item.date_earned || ''
      });
    }
  };

  // --- MANEJADORES DE ELIMINACIÓN ---
  const handleDelete = async (type, id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro permanentemente?")) {
      const endpoint = type === 'PROYECTO' ? 'projects' : 'certifications';
      try {
        await axios.delete(`${API_URL}/${endpoint}/${id}/`);
        fetchData();
      } catch (error) { console.error("Error al eliminar", error); }
    }
  };

  // --- MANEJADORES DE ENVÍO (POST / PUT) ---

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/profile/${profile.id}/`, profile);
      alert("Status actualizado correctamente");
    } catch (error) { console.error("Error al actualizar perfil", error); }
  };

  const handleAddTech = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/technologies/`, { name: newTech });
      setNewTech('');
      fetchData();
    } catch (error) { console.error("Error al añadir tecnología", error); }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('github_link', projectForm.github_link);
    formData.append('live_link', projectForm.live_link);
    if (projectImage) formData.append('image', projectImage);
    selectedTechs.forEach(techId => formData.append('technologies', techId));

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/projects/${editId}/`, formData);
      } else {
        await axios.post(`${API_URL}/projects/`, formData);
      }
      resetForms();
      fetchData();
      alert(isEditing ? "Proyecto actualizado" : "Proyecto guardado");
    } catch (error) { console.error("Error en proyecto", error); }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', certForm.name);
    formData.append('issuer', certForm.issuer);
    formData.append('certificate_link', certForm.certificate_link);
    if (certForm.date_earned) formData.append('date_earned', certForm.date_earned);
    if (certLogo) formData.append('issuer_logo', certLogo);

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/certifications/${editId}/`, formData);
      } else {
        await axios.post(`${API_URL}/certifications/`, formData);
      }
      resetForms();
      fetchData();
      alert(isEditing ? "Certificación actualizada" : "Certificación guardada");
    } catch (error) { console.error("Error en certificación", error); }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row font-sans selection:bg-blue-600">
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            
            {/* HEADER: Título y Botón Cerrar */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tighter italic">
                  {selectedJob.puesto}
                </h2>
                <p className="text-blue-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                  @ {selectedJob.empresa}
                </p>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* CUERPO: Detalles */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              {/* GRID DE INFO BÁSICA EXPANDIDA */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-[10px] font-bold uppercase tracking-widest">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-500 block mb-1">📍 UBICACIÓN</span>
                  <span className="text-white">{selectedJob.ciudad || 'Lima, PE'}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-500 block mb-1">💼 MODALIDAD</span>
                  <span className={selectedJob.modalidad === 'Remoto' ? 'text-purple-400' : 'text-white'}>
                    {selectedJob.modalidad || 'Presencial'}
                  </span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-500 block mb-1">⏱️ TIPO</span>
                  <span className="text-white">{selectedJob.tipo_empleo || 'Tiempo Completo'}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-500 block mb-1">💰 SALARIO</span>
                  <span className="text-green-500">{selectedJob.salario || 'No especificado'}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-500 block mb-1">🌐 ORIGEN</span>
                  <span className="text-blue-400">{selectedJob.portal_origen || 'Web'}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-500 block mb-1">📅 PUBLICADO</span>
                  <span className="text-orange-400">{selectedJob.tiempo_publicado || 'Reciente'}</span>
                </div>
              </div>

              {/* GAP ANALYSIS & MATCH SCORE (NUEVO) */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* EL MATCH SCORE */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-[10px] font-black text-gray-500 mb-3 tracking-[0.3em] flex justify-between">
                    <span>COMPATIBILIDAD CON TU PERFIL</span>
                    <span className="text-blue-500">{selectedJob.match_score || 0}%</span>
                  </h3>
                  <div className="w-full bg-black rounded-full h-3 border border-white/10 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        (selectedJob.match_score || 0) >= 80 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 
                        (selectedJob.match_score || 0) >= 50 ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 
                        'bg-red-500 shadow-[0_0_10px_#ef4444]'
                      }`}
                      style={{ width: `${selectedJob.match_score || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* SKILLS FALTANTES */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-[10px] font-black text-gray-500 mb-3 tracking-[0.3em]">
                    GAP ANALYSIS (FALTANTE)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(!selectedJob.skills_faltantes || selectedJob.skills_faltantes === 'Ninguna') ? (
                      <span className="text-green-500 text-xs font-black uppercase tracking-widest">
                        ✅ Tienes el stack completo
                      </span>
                    ) : (
                      selectedJob.skills_faltantes.split(',').map(skill => (
                        <span key={skill} className="bg-red-600/10 text-red-500 border border-red-600/20 px-3 py-1 rounded-full text-[9px] font-black">
                          ❌ {skill.trim().toUpperCase()}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* TECNOLOGÍAS (Mapeadas de Gemini) */}
              <div className="mb-8">
                <h3 className="text-[10px] font-black text-gray-500 mb-3 tracking-[0.3em]">STACK REQUERIDO</h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedJob.tecnologias || 'SQL, Python, Excel').split(',').map(tech => (
                    <span key={tech} className="bg-blue-600/10 text-blue-500 border border-blue-600/20 px-3 py-1 rounded-full text-[9px] font-black">
                      {tech.trim().toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <h3 className="text-[10px] font-black text-gray-500 mb-3 tracking-[0.3em]">DESCRIPCIÓN DEL PUESTO</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedJob.descripcion || 'Descripción no disponible.'}
                </p>
              </div>
            </div>

            {/* FOOTER: Botón Postular */}
            <div className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
              <a 
                href={selectedJob.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-center py-4 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg shadow-blue-600/20"
              >
                POSTULAR AHORA
              </a>
            </div>
          </div>
        </div>
      )}
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-black border-r border-white/5 p-8 flex flex-col">
        <h1 className="text-2xl font-black tracking-tighter uppercase mb-12">SILVA<span className="text-blue-600">_OS</span></h1>
        
        <nav className="flex flex-col gap-4 flex-grow">
        {['MÉTRICAS', 'PROYECTOS', 'CERTIFICACIONES', 'TECNOLOGÍAS', 'PERFIL', 'JOB HUNTER'].map(tab => (
          <button 
            key={tab}
            onClick={() => { 
              setActiveTab(tab); 
              resetForms();
              // --- LIMPIEZA TÁCTICA ---
              setCurrentPage(1); // Siempre regresamos a la página 1
              setFilterProb('TODAS'); // Siempre mostramos todo al entrar
            }}
            className={`text-left text-xs font-black uppercase tracking-widest py-3 px-4 rounded transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </nav>

        <button 
            onClick={() => {
                localStorage.clear();
                navigate('/login');
            }}
            className="mt-auto px-6 py-3 border border-red-900/50 bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded font-black text-xs uppercase tracking-widest"
            >
            Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        
        {/* PESTAÑA PERFIL (NUEVA) */}
        {activeTab === 'PERFIL' && (
          <div className="animate-in fade-in duration-500 max-w-md">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-8">Configuración de Perfil</h2>
            <form onSubmit={handleUpdateProfile} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
                <div>
                    <label className="block text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Status Actual (ES)</label>
                    <input type="text" value={profile.status_es} onChange={e => setProfile({...profile, status_es: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Status Actual (EN)</label>
                    <input type="text" value={profile.status_en} onChange={e => setProfile({...profile, status_en: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-black uppercase text-xs py-4 rounded hover:bg-blue-700 transition-all">Actualizar Status</button>
            </form>
          </div>
        )}

        {/* PESTAÑA MÉTRICAS */}
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
          <div className="animate-in fade-in duration-500 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-widest mb-8">{isEditing ? 'Editar Proyecto' : 'Gestor de Proyectos'}</h2>
              <form onSubmit={handleAddProject} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
                <input type="text" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} placeholder="TÍTULO" className="w-full bg-black border border-white/10 p-4 rounded font-bold" />
                <textarea required rows="4" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} placeholder="DESCRIPCIÓN" className="w-full bg-black border border-white/10 p-4 rounded font-bold resize-none"></textarea>
                <div className="grid grid-cols-2 gap-4">
                  <input type="url" value={projectForm.github_link} onChange={e => setProjectForm({...projectForm, github_link: e.target.value})} placeholder="GITHUB URL" className="w-full bg-black border border-white/10 p-4 rounded font-bold" />
                  <input type="url" value={projectForm.live_link} onChange={e => setProjectForm({...projectForm, live_link: e.target.value})} placeholder="DEPLOY URL" className="w-full bg-black border border-white/10 p-4 rounded font-bold" />
                </div>
                <input type="file" onChange={e => setProjectImage(e.target.files[0])} className="text-xs text-gray-500" />
                
                <div className="flex flex-wrap gap-2">
                  {technologies.map(tech => (
                    <label key={tech.id} className={`cursor-pointer px-3 py-1 border rounded-[5px] text-[10px] font-black uppercase transition-all ${selectedTechs.includes(tech.id) ? 'bg-blue-600 border-blue-600' : 'border-white/10 text-gray-500'}`}>
                      <input type="checkbox" className="hidden" checked={selectedTechs.includes(tech.id)} onChange={() => {
                        if (selectedTechs.includes(tech.id)) setSelectedTechs(selectedTechs.filter(id => id !== tech.id));
                        else setSelectedTechs([...selectedTechs, tech.id]);
                      }} /> {tech.name}
                    </label>
                  ))}
                </div>

                <button type="submit" className="w-full bg-white text-black font-black uppercase text-sm py-4 rounded hover:bg-blue-600 hover:text-white transition-all">
                  {isEditing ? 'Guardar Cambios' : 'Desplegar Proyecto'}
                </button>
                {isEditing && <button type="button" onClick={resetForms} className="w-full text-gray-500 text-[10px] font-black uppercase">Cancelar</button>}
              </form>
            </div>

            <div>
                <h2 className="text-3xl font-black uppercase mb-8">Inventario</h2>
                <div className="space-y-4">
                    {projects.map(p => (
                        <div key={p.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5 group">
                            <span className="font-bold uppercase text-xs tracking-widest">{p.title}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleEditClick('PROYECTO', p)} className="bg-blue-600/20 text-blue-500 px-3 py-1 rounded text-[10px] font-black">EDITAR</button>
                                <button onClick={() => handleDelete('PROYECTO', p.id)} className="bg-red-600/20 text-red-500 px-3 py-1 rounded text-[10px] font-black">BORRAR</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* PESTAÑA CERTIFICACIONES */}
        {activeTab === 'CERTIFICACIONES' && (
          <div className="animate-in fade-in duration-500 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
                <h2 className="text-3xl font-black uppercase tracking-widest mb-8">{isEditing ? 'Editar Logro' : 'Añadir Logro'}</h2>
                <form onSubmit={handleAddCert} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
                    <input type="text" required value={certForm.name} onChange={e => setCertForm({...certForm, name: e.target.value})} placeholder="NOMBRE" className="w-full bg-black border border-white/10 p-4 rounded font-bold" />
                    <input type="text" required value={certForm.issuer} onChange={e => setCertForm({...certForm, issuer: e.target.value})} placeholder="EMISOR" className="w-full bg-black border border-white/10 p-4 rounded font-bold" />
                    <input type="date" value={certForm.date_earned} onChange={e => setCertForm({...certForm, date_earned: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold text-gray-400" />
                    <input type="url" value={certForm.certificate_link} onChange={e => setCertForm({...certForm, certificate_link: e.target.value})} placeholder="URL CREDENCIAL" className="w-full bg-black border border-white/10 p-4 rounded font-bold" />
                    <input type="file" onChange={e => setCertLogo(e.target.files[0])} className="text-xs text-gray-500" />
                    <button type="submit" className="w-full bg-purple-600 text-white font-black uppercase text-sm py-4 rounded hover:bg-purple-700 transition-all">
                        {isEditing ? 'Actualizar Logro' : 'Registrar Certificación'}
                    </button>
                    {isEditing && <button type="button" onClick={resetForms} className="w-full text-gray-500 text-[10px] font-black uppercase">Cancelar</button>}
                </form>
            </div>
            <div>
                <h2 className="text-3xl font-black uppercase mb-8">Logros</h2>
                <div className="space-y-4">
                    {certifications.map(c => (
                        <div key={c.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5 group">
                            <span className="font-bold uppercase text-xs tracking-widest">{c.name}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleEditClick('CERTIFICACION', c)} className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded text-[10px] font-black">EDITAR</button>
                                <button onClick={() => handleDelete('CERTIFICACION', c.id)} className="bg-red-600/20 text-red-500 px-3 py-1 rounded text-[10px] font-black">BORRAR</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}
        {activeTab === 'JOB HUNTER' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-3xl font-black uppercase text-blue-500 italic tracking-tighter">IA Hunter Core</h2>
              
              {/* BOTONES DE FILTRO */}
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {['TODAS', 'ALTA', 'MEDIA', 'BAJA'].map(p => (
                  <button
                    key={p}
                    onClick={() => setFilterProb(p)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${filterProb === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl mb-6">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-white/5 font-black uppercase tracking-[0.2em] text-gray-500">
                  <tr>
                    <th className="p-5">Detalles de Vacante</th>
                    <th className="p-5">Ubicación</th>
                    <th className="p-5">IA Match</th>
                    <th className="p-5">Estado</th>
                    <th className="p-5">Skills Clave</th>
                    <th className="p-5">Última Vista</th>
                    <th className="p-5">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentJobs.map(job => (
                    <tr key={job.vacante_id} onClick={() => setSelectedJob(job)} className="hover:bg-blue-600/5 transition-colors group">
                      <td className="p-5">
                        <p className="text-blue-400 font-mono text-[9px] mb-1">ID: {job.vacante_id}</p>
                        <p className="font-black text-white uppercase text-sm leading-none mb-1">{job.puesto}</p>
                        <p className="text-gray-500 font-bold uppercase tracking-widest">{job.empresa}</p>
                      </td>
                      <td className="p-5">
                        <span className="text-gray-400 uppercase font-black">{job.ubicacion}</span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-1 rounded-full font-black text-[9px] uppercase tracking-tighter border 
                            ${job.probabilidad_ia?.toUpperCase() === 'ALTA' 
                              ? 'bg-green-500/10 text-green-500 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                              : job.probabilidad_ia?.toUpperCase() === 'MEDIA' 
                              ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' 
                              : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                            
                            {job.probabilidad_ia?.toUpperCase() === 'ALTA' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2"></span>}
                            {job.probabilidad_ia || 'Desconocida'}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full font-black text-[8px] uppercase tracking-tighter ${job.estado === 'Postulado' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                          {job.estado || 'ACTIVO'}
                        </span>
                      </td>
                      <td className="p-5 max-w-[200px]">
                        <p className="text-gray-400 font-mono leading-relaxed line-clamp-2">{job.habilidades_ia}</p>
                      </td>
                      <td className="p-5">
                        <p className="text-gray-600 font-mono">{new Date(job.ultima_vista).toLocaleDateString()}</p>
                        <p className="text-gray-800 font-mono text-[9px]">{new Date(job.ultima_vista).toLocaleTimeString()}</p>
                      </td>
                      <td className="p-5">
                        <a href={job.link} target="_blank" rel="noreferrer" className="inline-block bg-white text-black px-4 py-2 rounded-full font-black uppercase text-[9px] hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-blue-600/20">
                          Postular →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* SI NO HAY TRABAJOS CON ESE FILTRO */}
              {currentJobs.length === 0 && (
                <div className="p-20 text-center text-gray-600 font-black uppercase tracking-widest">
                  No hay vacantes con probabilidad {filterProb}
                </div>
              )}
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-8">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-3 rounded-full border border-white/10 hover:bg-blue-600 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                >
                  <span className="text-xs">←</span>
                </button>
                
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Página <span className="text-blue-500">{currentPage}</span> de {totalPages}
                </span>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-3 rounded-full border border-white/10 hover:bg-blue-600 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                >
                  <span className="text-xs">→</span>
                </button>
              </div>
            )}
          </div>
        )}
        {/* PESTAÑA TECNOLOGÍAS */}
        {activeTab === 'TECNOLOGÍAS' && (
          <div className="animate-in fade-in duration-500 max-w-md">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-8">Diccionario de Stack</h2>
            <form onSubmit={handleAddTech} className="mb-10 flex gap-4">
              <input type="text" required placeholder="NUEVA TECNOLOGÍA..." value={newTech} onChange={e => setNewTech(e.target.value)} className="flex-grow bg-[#0a0a0a] border border-white/10 p-4 rounded font-black uppercase outline-none focus:border-white transition-colors" />
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