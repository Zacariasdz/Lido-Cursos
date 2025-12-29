
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CursosPage from './pages/CursosPage';
import DetalhesPage from './pages/DetalhesPage';
import PainelPage from './pages/PainelPage';
import PlayerPage from './pages/PlayerPage';
import LoginPage from './pages/LoginPage';
import PerfilPage from './pages/PerfilPage';
import CriadorPage from './pages/CriadorPage';
import EditarCursoPage from './pages/EditarCursoPage';
import BibliotecaPage from './pages/BibliotecaPage';
import ConquistasPage from './pages/ConquistasPage';
import ComunidadePage from './pages/ComunidadePage';
import LivePage from './pages/LivePage';
import TalentosPage from './pages/TalentosPage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0e14]">
        <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0e14]">
        <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/painel" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  // Alterado para redirecionar para a Home (/) após login bem sucedido
  if (isAuthenticated) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <AuthProvider>
      <HashRouter>
        <AppContent isDark={isDark} toggleTheme={toggleTheme} />
      </HashRouter>
    </AuthProvider>
  );
};

const AppContent: React.FC<{ isDark: boolean; toggleTheme: () => void }> = ({ isDark, toggleTheme }) => {
  const location = useLocation();
  const hideNav = ['/login', '/player', '/live'].some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0a0e14] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-500">
      {!hideNav && <Navbar isDark={isDark} toggleTheme={toggleTheme} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cursos" element={<CursosPage />} />
        <Route path="/detalhes" element={<DetalhesPage />} />
        
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        
        <Route path="/painel" element={<PrivateRoute><PainelPage isDark={isDark} toggleTheme={toggleTheme} /></PrivateRoute>} />
        <Route path="/player" element={<PrivateRoute><PlayerPage /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><PerfilPage /></PrivateRoute>} />
        <Route path="/criador" element={<PrivateRoute><CriadorPage /></PrivateRoute>} />
        <Route path="/editar-curso" element={<PrivateRoute><EditarCursoPage /></PrivateRoute>} />
        <Route path="/biblioteca" element={<PrivateRoute><BibliotecaPage /></PrivateRoute>} />
        <Route path="/conquistas" element={<PrivateRoute><ConquistasPage /></PrivateRoute>} />
        <Route path="/comunidade" element={<PrivateRoute><ComunidadePage /></PrivateRoute>} />
        <Route path="/live" element={<PrivateRoute><LivePage /></PrivateRoute>} />
        <Route path="/talentos" element={<PrivateRoute><TalentosPage /></PrivateRoute>} />
        
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminPage /></PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default App;
