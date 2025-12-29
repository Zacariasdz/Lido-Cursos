
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <HashRouter>
      <AppContent isDark={isDark} toggleTheme={toggleTheme} />
    </HashRouter>
  );
};

const AppContent: React.FC<{ isDark: boolean; toggleTheme: () => void }> = ({ isDark, toggleTheme }) => {
  const location = useLocation();
  
  // Hide main navbar on specific pages like login or full-screen players
  const hideNav = ['/login', '/player', '/live'].some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0a0e14] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-500">
      {!hideNav && <Navbar isDark={isDark} toggleTheme={toggleTheme} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cursos" element={<CursosPage />} />
        <Route path="/detalhes" element={<DetalhesPage />} />
        <Route path="/painel" element={<PainelPage isDark={isDark} toggleTheme={toggleTheme} />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/criador" element={<CriadorPage />} />
        <Route path="/editar-curso" element={<EditarCursoPage />} />
        <Route path="/biblioteca" element={<BibliotecaPage />} />
        <Route path="/conquistas" element={<ConquistasPage />} />
        <Route path="/comunidade" element={<ComunidadePage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/talentos" element={<TalentosPage />} />
      </Routes>
    </div>
  );
};

export default App;
