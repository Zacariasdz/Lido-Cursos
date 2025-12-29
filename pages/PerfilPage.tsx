
import React from 'react';
import { Link } from 'react-router-dom';

const PerfilPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#f5f5f7] selection:bg-blue-500/30 pb-24 md:pb-12 animate__animated animate__fadeIn">
      {/* Page Styles - Replicating the provided CSS as Tailwind utilities where possible */}
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
        .input-field:focus { 
            border-color: #0071e3; 
            background: rgba(0,0,0,0.5);
            box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
        }
      `}</style>

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 glass-card flex items-center justify-center group-hover:bg-white/10 transition">
              <i className="ph ph-caret-left font-bold"></i>
            </div>
            <span className="font-bold text-sm hidden md:block">Voltar ao Início</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black tracking-widest uppercase opacity-40">Status:</span>
            <div className="badge-verified px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-2">
              <i className="ph-fill ph-seal-check text-sm"></i> Verificado
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer">
                <img 
                  src="https://i.pravatar.cc/150?u=luan" 
                  className="w-32 h-32 rounded-full border-4 border-blue-500/20 group-hover:opacity-80 transition" 
                  alt="Avatar"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <i className="ph ph-camera text-2xl"></i>
                </div>
              </div>
              <h2 className="text-2xl font-black mt-6 tracking-tighter">Luan Silva</h2>
              <p className="text-sm opacity-40 mb-6 italic">@luan_design</p>
              
              <div className="flex gap-4 w-full border-t border-white/5 pt-6">
                <div className="flex-1">
                  <p className="text-xl font-bold">14</p>
                  <p className="text-[9px] font-black uppercase opacity-40">Cursos</p>
                </div>
                <div className="w-[1px] bg-white/5"></div>
                <div className="flex-1">
                  <p className="text-xl font-bold">2.4k</p>
                  <p className="text-[9px] font-black uppercase opacity-40">Seguidores</p>
                </div>
              </div>
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
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition text-sm font-medium text-left">
                <i className="ph ph-bell text-xl opacity-40"></i> Notificações
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition text-sm font-medium text-left">
                <i className="ph ph-wallet text-xl opacity-40"></i> Métodos de Pagamento
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-500/10 text-red-500 transition text-sm font-bold text-left">
                <i className="ph ph-sign-out text-xl"></i> Sair da Conta
              </button>
            </div>
          </aside>

          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-8">
            
            <section className="glass-card p-8 md:p-12">
              <header className="mb-10 text-left">
                <h3 className="text-2xl font-bold tracking-tight">Configurações de Perfil</h3>
                <p className="text-sm opacity-40 mt-1">Atualize suas informações públicas e de contato.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-1">Nome Completo</label>
                  <input type="text" className="input-field" defaultValue="Luan Silva" />
                </div>
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-1">E-mail Principal</label>
                  <input type="email" className="input-field" defaultValue="luan@exemplo.com" />
                </div>
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-1">Bio (Criador)</label>
                  <input type="text" className="input-field" placeholder="Ex: Especialista em UI Design..." />
                </div>
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-1">Localização</label>
                  <input type="text" className="input-field" defaultValue="São Paulo, Brasil" />
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-sm transition shadow-lg shadow-blue-600/20">
                  Salvar Alterações
                </button>
                <button className="bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-2xl font-bold text-sm transition">
                  Descartar
                </button>
              </div>
            </section>

            <section className="glass-card p-8 md:p-12">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <i className="ph ph-shield-check text-blue-500"></i> Segurança
              </h3>
              
              <div className="space-y-4">
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-sm font-bold">Senha de Acesso</h4>
                    <p className="text-xs opacity-40 mt-1">Alterada pela última vez há 3 meses.</p>
                  </div>
                  <button className="text-xs font-black text-blue-500 hover:underline">ALTERAR</button>
                </div>

                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-sm font-bold">Autenticação em Duas Etapas (2FA)</h4>
                    <p className="text-xs opacity-40 mt-1">Proteja sua conta com um código adicional.</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Mobile Navigation Placeholder */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[100]">
        <div className="glass-card px-8 py-4 flex items-center justify-around shadow-2xl">
          <Link to="/" className="opacity-40"><i className="ph ph-house text-2xl"></i></Link>
          <Link to="/cursos" className="opacity-40"><i className="ph ph-magnifying-glass text-2xl"></i></Link>
          <Link to="/painel" className="opacity-40"><i className="ph ph-layout text-2xl"></i></Link>
          <Link to="/perfil" className="text-blue-500"><i className="ph-fill ph-user text-2xl"></i></Link>
        </div>
      </nav>
    </div>
  );
};

export default PerfilPage;
