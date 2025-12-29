
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/painel');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f5f7] dark:bg-[#0a0e14] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate__animated animate__fadeInUp">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl border border-black/5 dark:border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl">
          <div className="text-center mb-12">
            <div className="bg-black dark:bg-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-white dark:text-black font-black text-lg italic">L.</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter dark:text-white mb-2">Bem-vindo de volta.</h1>
            <p className="text-sm opacity-40 dark:text-white/40 font-medium">Continue sua jornada de evolução.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40 px-2">E-mail</label>
              <input 
                type="email" 
                placeholder="exemplo@lido.com" 
                required
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40">Senha</label>
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-blue-500">Esqueci</button>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-[1.02] transition shadow-xl shadow-blue-500/20 active:scale-95">
              Entrar na plataforma
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 text-center">
            <p className="text-xs opacity-40 dark:text-white/40 font-medium mb-4">Ainda não tem uma conta?</p>
            <Link to="/cursos" className="text-xs font-black uppercase tracking-widest text-blue-500 hover:underline">Ver planos e cursos</Link>
          </div>
        </div>

        <Link to="/" className="mt-8 flex items-center justify-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition dark:text-white">
          <i className="ph ph-arrow-left"></i>
          Voltar para a home
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
