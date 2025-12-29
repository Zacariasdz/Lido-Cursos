
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const PerfilPage: React.FC = () => {
  const { user, logout, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{name?: string, email?: string}>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setEmail(user.id); // Apenas um placeholder até pegarmos o email real
      
      supabase.auth.getUser().then(({ data }) => {
        if (data.user?.email) setEmail(data.user.email);
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors: {name?: string, email?: string} = {};
    if (name.length < 3) newErrors.name = 'O nome deve ter pelo menos 3 caracteres.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = 'Insira um e-mail válido.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !user) return;
    
    setLoading(true);
    setSaveSuccess(false);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name, bio })
        .eq('id', user.id);

      if (error) throw error;
      
      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      alert('Falha ao salvar alterações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#f5f5f7] selection:bg-blue-500/30 pb-24 md:pb-12 animate__animated animate__fadeIn">
      <style>{`
        .glass-card { 
            background: rgba(22, 30, 43, 0.6); 
            backdrop-filter: blur(20px); 
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 2.5rem;
        }
        .badge-verified {
            background: linear-gradient(135deg, #0071e3, #00a2ff);
            box-shadow: 0 4px 15px rgba(0, 113, 227, 0.3);
        }
        .input-field {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 1.25rem;
            padding: 0.85rem 1.25rem;
            width: 100%;
            color: white;
            outline: none;
            transition: all 0.3s;
        }
        .input-field.error { border-color: #ef4444; }
        .input-field:focus { 
            border-color: #0071e3; 
            background: rgba(0,0,0,0.5);
            box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
        }
      `}</style>

      <nav className="fixed top-0 w-full z-[100] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 glass-card flex items-center justify-center group-hover:bg-white/10 transition">
              <i className="ph ph-caret-left font-bold"></i>
            </div>
            <span className="font-bold text-sm hidden md:block">Voltar ao Início</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black tracking-widest uppercase opacity-40">Cargo:</span>
            <div className="badge-verified px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-2">
              <i className="ph-fill ph-seal-check text-sm"></i> {user?.role === 'creator' ? 'Criador' : user?.role === 'admin' ? 'Administrador' : 'Estudante'}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer">
                <img 
                  src={user?.avatar_url || `https://ui-avatars.com/api/?name=${name || 'User'}&background=0071e3&color=fff`} 
                  className="w-32 h-32 rounded-full border-4 border-blue-500/20 group-hover:opacity-80 transition object-cover" 
                  alt="Avatar"
                />
              </div>
              <h2 className="text-2xl font-black mt-6 tracking-tighter">{name}</h2>
              <p className="text-sm opacity-40 mb-6 italic">{user?.status === 'active' ? 'Perfil Verificado' : 'Aguardando Verificação'}</p>
            </div>

            <Link to="/criador" className="block glass-card p-6 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                    <i className="ph-fill ph-chalkboard-teacher text-2xl"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold">Studio do Criador</h3>
                    <p className="text-[10px] opacity-50 uppercase tracking-tighter">Vender e Gerenciar Cursos</p>
                  </div>
                </div>
                <i className="ph ph-arrow-right group-hover:translate-x-1 transition"></i>
              </div>
            </Link>

            <div className="glass-card p-4 space-y-1">
              <button onClick={logout} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-500/10 text-red-500 transition text-sm font-bold text-left">
                <i className="ph ph-sign-out text-xl"></i> Sair da Conta
              </button>
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-8">
            <section className="glass-card p-8 md:p-12 relative overflow-hidden">
              {saveSuccess && (
                <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.3em] py-2 text-center animate__animated animate__fadeInDown">
                  Perfil atualizado com sucesso!
                </div>
              )}

              <header className="mb-10 text-left">
                <h3 className="text-2xl font-bold tracking-tight">Configurações de Perfil</h3>
                <p className="text-sm opacity-40 mt-1">Atualize suas informações públicas e de contato.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    className={`input-field ${errors.name ? 'error' : ''}`} 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.name}</p>}
                </div>
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-1">E-mail Principal</label>
                  <input 
                    type="email" 
                    disabled
                    className="input-field opacity-50 cursor-not-allowed" 
                    value={email} 
                  />
                  <p className="text-[9px] opacity-30 ml-1">O e-mail não pode ser alterado diretamente.</p>
                </div>
                <div className="space-y-3 text-left md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-1">Bio</label>
                  <textarea 
                    className="input-field min-h-[120px] resize-none" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-sm transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Salvar Alterações'}
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerfilPage;
