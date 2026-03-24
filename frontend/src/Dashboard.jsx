import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://163.176.173.160:8000/api';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('PROYECTOS');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Data States
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [profile, setProfile] = useState({ id: 1, status_es: '', status_en: '' });

  // Form States
  const [newTech, setNewTech] = useState('');
  const [projectForm, setProjectForm] = useState({ title: '', description: '', github_link: '', live_link: '' });
  const [projectImage, setProjectImage] = useState(null);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', certificate_link: '', date_earned: '' });
  const [certLogo, setCertLogo] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [msg, proj, tech, cert, prof] = await Promise.all([
        axios.get(`${API_BASE}/contact/`),
        axios.get(`${API_BASE}/projects/`),
        axios.get(`${API_BASE}/technologies/`),
        axios.get(`${API_BASE}/certifications/`),
        axios.get(`${API_BASE}/profile/`)
      ]);
      setMessages(msg.data);
      setProjects(proj.data);
      setTechnologies(tech.data);
      setCertifications(cert.data);
      if (prof.data.length > 0) setProfile(prof.data[0]);
    } catch (err) { console.error("Error en System Core Fetch:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForms = () => {
    setIsEditing(false);
    setEditId(null);
    setProjectForm({ title: '', description: '', github_link: '', live_link: '' });
    setCertForm({ name: '', issuer: '', certificate_link: '', date_earned: '' });
    setProjectImage(null);
    setCertLogo(null);
    setSelectedTechs([]);
  };

  // --- CRUD LOGIC ---
  const handleEdit = (type, item) => {
    setIsEditing(true);
    setEditId(item.id);
    if (type === 'PROY') {
      setActiveTab('PROYECTOS');
      setProjectForm({ title: item.title, description: item.description, github_link: item.github_link || '', live_link: item.live_link || '' });
      setSelectedTechs(item.technologies || []);
    } else {
      setActiveTab('CERTIFICACIONES');
      setCertForm({ name: item.name, issuer: item.issuer, certificate_link: item.certificate_link || '', date_earned: item.date_earned || '' });
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("¿Confirmar eliminación permanente en el Core?")) return;
    const path = type === 'PROY' ? 'projects' : 'certifications';
    await axios.delete(`${API_BASE}/${path}/${id}/`);
    fetchData();
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(projectForm).forEach(key => fd.append(key, projectForm[key]));
    if (projectImage) fd.append('image', projectImage);
    selectedTechs.forEach(id => fd.append('technologies', id));

    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    if (isEditing) await axios.put(`${API_BASE}/projects/${editId}/`, fd, config);
    else await axios.post(`${API_BASE}/projects/`, fd, config);
    
    resetForms(); fetchData(); alert("Sincronización de Proyecto Exitosa");
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(certForm).forEach(key => fd.append(key, certForm[key]));
    if (certLogo) fd.append('issuer_logo', certLogo);

    if (isEditing) await axios.put(`${API_BASE}/certifications/${editId}/`, fd);
    else await axios.post(`${API_BASE}/certifications/`, fd);
    
    resetForms(); fetchData(); alert("Sincronización de Certificado Exitosa");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`${API_BASE}/profile/${profile.id}/`, profile);
    alert("Status Global Actualizado");
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-black border-r border-white/5 p-8 flex flex-col gap-8">
        <h1 className="text-2xl font-black tracking-tighter uppercase">SILVA<span className="text-blue-600">_OS</span></h1>
        <nav className="flex flex-col gap-2">
          {['MÉTRICAS', 'PROYECTOS', 'CERTIFICACIONES', 'TECNOLOGÍAS', 'PERFIL'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); resetForms(); }} className={`text-left text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded ${activeTab === tab ? 'bg-blue-600' : 'text-gray-500 hover:bg-white/5'}`}>{tab}</button>
          ))}
        </nav>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="mt-auto py-3 border border-red-900/30 text-red-500 text-[10px] font-black uppercase rounded">Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        
        {activeTab === 'MÉTRICAS' && (
          <div className="animate-in fade-in">
            <h2 className="text-4xl font-black uppercase mb-12 italic">System Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5">
                <p className="text-blue-500 text-[10px] font-black uppercase mb-2">Projects</p>
                <p className="text-6xl font-black">{projects.length}</p>
              </div>
              <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5">
                <p className="text-green-500 text-[10px] font-black uppercase mb-2">Inbound Messages</p>
                <p className="text-6xl font-black">{messages.length}</p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5">
                <h3 className="text-xs font-black uppercase mb-6 text-gray-500">Recent Messages</h3>
                {messages.map(m => (
                    <div key={m.id} className="mb-4 pb-4 border-b border-white/5 last:border-0">
                        <p className="text-blue-400 font-bold">{m.name} <span className="text-gray-600 text-[10px]">({m.email})</span></p>
                        <p className="text-gray-400 text-sm mt-1">{m.message}</p>
                    </div>
                ))}
            </div>
          </div>
        )}

        {(activeTab === 'PROYECTOS' || activeTab === 'CERTIFICACIONES') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in slide-in-from-right-10">
                {/* FORMULARIO */}
                <div>
                    <h2 className="text-2xl font-black uppercase mb-8">{isEditing ? 'Update Mode' : 'Create Mode'}</h2>
                    <form onSubmit={activeTab === 'PROYECTOS' ? handleAddProject : handleAddCert} className="space-y-4 bg-white/5 p-8 rounded-3xl">
                        {activeTab === 'PROYECTOS' ? (
                            <>
                                <input type="text" placeholder="TITLE" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none" required />
                                <textarea placeholder="DESCRIPTION" rows="4" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold resize-none" required />
                                <input type="file" onChange={e => setProjectImage(e.target.files[0])} className="text-xs" />
                            </>
                        ) : (
                            <>
                                <input type="text" placeholder="CERT NAME" value={certForm.name} onChange={e => setCertForm({...certForm, name: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold" required />
                                <input type="text" placeholder="ISSUER" value={certForm.issuer} onChange={e => setCertForm({...certForm, issuer: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded font-bold" required />
                                <input type="file" onChange={e => setCertLogo(e.target.files[0])} className="text-xs" />
                            </>
                        )}
                        <button type="submit" className="w-full bg-blue-600 py-4 font-black uppercase text-xs rounded hover:bg-white hover:text-black transition-all">
                            {isEditing ? 'Apply Changes' : 'Sync to Database'}
                        </button>
                        {isEditing && <button type="button" onClick={resetForms} className="w-full text-gray-500 text-[10px] font-black uppercase mt-2">Cancel Edit</button>}
                    </form>
                </div>

                {/* LISTADO PARA EDITAR/BORRAR */}
                <div>
                    <h2 className="text-2xl font-black uppercase mb-8">Inventory</h2>
                    <div className="space-y-3">
                        {(activeTab === 'PROYECTOS' ? projects : certifications).map(item => (
                            <div key={item.id} className="bg-black border border-white/5 p-4 rounded-xl flex justify-between items-center group">
                                <span className="text-[10px] font-black uppercase tracking-tighter">{item.title || item.name}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => handleEdit(activeTab === 'PROYECTOS' ? 'PROY' : 'CERT', item)} className="bg-blue-600/20 text-blue-500 px-3 py-1 rounded text-[9px] font-black">EDIT</button>
                                    <button onClick={() => handleDelete(activeTab === 'PROYECTOS' ? 'PROY' : 'CERT', item.id)} className="bg-red-600/20 text-red-500 px-3 py-1 rounded text-[9px] font-black">DELETE</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'PERFIL' && (
            <div className="max-w-md animate-in fade-in">
                <h2 className="text-2xl font-black uppercase mb-8 italic">Global Status Config</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6 bg-white/5 p-8 rounded-3xl border border-blue-600/20">
                    <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase">Status Español</label>
                        <input type="text" value={profile.status_es} onChange={e => setProfile({...profile, status_es: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded mt-2 font-bold" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase">Status English</label>
                        <input type="text" value={profile.status_en} onChange={e => setProfile({...profile, status_en: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded mt-2 font-bold" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 py-4 font-black uppercase text-xs rounded shadow-lg shadow-blue-600/20">Update System Core</button>
                </form>
            </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;