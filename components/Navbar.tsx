
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Início', icon: 'ph-house-line' },
    { path: '/cursos', label: 'Cursos', icon: 'ph-layout' },
    { path: '/painel', label: 'Painel', icon: 'ph-compass' },
    { path: '/biblioteca', label: 'Assets', icon: 'ph-folder-open' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed bottom-0 md:top-0 md:bottom-auto w-full z-[1000] p-4 md:px-12">
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[2.5rem] px-6 py-3 flex items-center justify-between">
          
          <div className="hidden md:flex items-center gap-2">
            <div className="bg-black dark:bg-white w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500">
              <span className="text-white dark:text-black font-black text-xs italic">L.</span>
            </div>
            <span className="font-bold tracking-tighter text-lg dark:text-white">Lido.</span>
          </div>

          <div className="flex items-center justify-around w-full md:w-auto md:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col md:flex-row items-center gap-1.5 transition ${
                  isActive(item.path) 
                    ? 'text-blue-500' 
                    : 'opacity-50 hover:opacity-100 text-gray-500 dark:text-gray-400'
                }`}
              >
                <i className={`${isActive(item.path) ? 'ph-fill' : 'ph'} ${item.icon} text-2xl md:text-xl`}></i>
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            ))}
            
            <button 
              onClick={toggleTheme} 
              className="flex flex-col md:flex-row items-center gap-1.5 outline-none group"
            >
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all">
                <i id="themeIcon" className={`ph ${isDark ? 'ph-sun-dim text-yellow-400' : 'ph-moon text-blue-400'} text-2xl md:text-xl`}></i>
              </div>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-xs font-bold opacity-60 hover:opacity-100 transition dark:text-white">Entrar</Link>
            <div className="w-[1px] h-4 bg-gray-500/20"></div>
            <Link to="/perfil" className="hover:scale-110 transition active:scale-95">
              <img src="https://i.pravatar.cc/100" className="w-10 h-10 rounded-full border-2 border-white dark:border-blue-500 shadow-md" alt="Avatar"/>
            </Link>
          </div>
        </div>
      </nav>
      <div className="h-0 md:h-24"></div>
    </>
  );
};

export default Navbar;
