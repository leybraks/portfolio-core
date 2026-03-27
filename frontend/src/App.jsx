import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './Portfolio';
import Dashboard from './Dashboard';
import Login from './Login';
import Chatbot from './chatbot-page/Chatbot';
// Este componente envuelve tus rutas privadas
const ProtectedRoute = ({ children }) => {
  // Verificamos si tienes la llave (token) guardada
  const token = localStorage.getItem('access_token');
  
  // Si no hay token, te patea a la pantalla de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Si tienes token, te deja pasar al panel
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* PÚBLICO */}
        <Route path="/" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatbot" element={<Chatbot />} />

        <Route 
          path="/panel" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* ESCAPE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;