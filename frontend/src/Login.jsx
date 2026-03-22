import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Pedimos el Token a Django
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password
      });
      
      // Guardamos la llave maestra en el navegador
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Te redirigimos al panel
      navigate('/panel');
    } catch (err) {
      setError('Credenciales inválidas. Acceso denegado al sistema.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center font-sans selection:bg-blue-600 p-6">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
        
        {/* Efecto visual de fondo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">SYSTEM<span className="text-blue-600">_AUTH</span></h1>
          <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">Panel de Control Restringido</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Usuario Administrador</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Clave de Acceso</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 rounded font-bold outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-900/10 border border-red-900/50 text-red-500 text-xs font-black uppercase tracking-widest p-3 rounded text-center">
              {error}
            </div>
          )}

          <button type="submit" className="w-full bg-white text-black font-black uppercase text-sm tracking-widest py-4 rounded hover:bg-blue-600 hover:text-white transition-all mt-4">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;