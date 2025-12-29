
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        await signUp({ email, password, name });
        // Após o cadastro, o Supabase já pode logar dependendo da config,
        // mas aqui mantemos o fluxo de avisar e permitir o login
        setError("Conta criada com sucesso!");
        setIsSignUp(false);
      } else {
        await login({ email, password });
        // Redireciona para a Home após o login
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f5f7] dark:bg-[#0a0e14] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate__animated animate__fadeInUp">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl border border-black/5 dark:border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl">
          <div className="text-center mb-12">
            <div className="bg-black dark:bg-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-white dark:text-black font-black text-lg italic">L.</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter dark:text-white mb-2">
              {isSignUp ? 'Criar nova conta' : 'Bem-vindo de volta.'}
            </h1>
            <p className="text-sm opacity-40 dark:text-white/40 font-medium">
              {isSignUp ? 'Junte-se à elite do design e tech.' : 'Continue sua jornada de evolução.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className={`text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl animate__animated animate__headShake ${error.includes('sucesso') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                <i className={`ph ${error.includes('sucesso') ? 'ph-check-circle' : 'ph-warning-circle'} mr-2`}></i>
                {error}
              </div>
            )}

            {isSignUp && (
              <div className="space-y-2 text-left animate__animated animate__fadeIn">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40 px-2">Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Seu nome" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
                />
              </div>
            )}

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40 px-2">E-mail</label>
              <input 
                type="email" 
                placeholder="exemplo@lido.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
              />
            </div>

            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40">Senha</label>
                {!isSignUp && <button type="button" className="text-[10px] font-black uppercase tracking-widest text-blue-500">Esqueci</button>}
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-[1.02] transition shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isSignUp ? 'Criar minha conta' : 'Entrar na plataforma'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 text-center">
            <p className="text-xs opacity-40 dark:text-white/40 font-medium mb-4">
              {isSignUp ? 'Já possui uma conta?' : 'Ainda não tem uma conta?'}
            </p>
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-black uppercase tracking-widest text-blue-500 hover:underline"
            >
              {isSignUp ? 'Entrar agora' : 'Criar conta gratuitamente'}
            </button>
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
