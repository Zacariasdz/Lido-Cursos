
import React from 'react';
import { Link } from 'react-router-dom';

interface PainelPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const PainelPage: React.FC<PainelPageProps> = ({ isDark, toggleTheme }) => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 animate__animated animate__fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 block">Área do Aluno</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter dark:text-white">Bom dia, Gabriel.</h1>
          <p className="text-xl opacity-50 mt-2 dark:text-white/60 font-medium">Continue de onde você parou.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white block">Sua meta diária</span>
            <span className="font-bold dark:text-white">45 / 60 min</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin-slow"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Active Course Card */}
          <div className="relative overflow-hidden bg-black rounded-[3rem] p-8 md:p-12 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 grayscale pointer-events-none">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800" className="w-full h-full object-cover" alt="Background" />
            </div>
            <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 inline-block">Em andamento</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Arquitetura de UI Avançada</h2>
              <div className="flex items-center gap-2 mb-10 text-white/60 text-sm">
                <i className="ph ph-stack"></i>
                <span>Módulo 04: Componentes Complexos</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link to="/player" className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-2xl font-bold text-sm hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <i className="ph-fill ph-play"></i>
                  Retomar Aula
                </Link>
                <div className="flex-1 w-full">
                  <div className="flex justify-between text-[10px] uppercase font-bold mb-2 opacity-50">
                    <span>Progresso do curso</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[65%] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold dark:text-white tracking-tight">Recentes</h3>
              <Link to="/cursos" className="text-xs font-bold text-blue-500 uppercase tracking-widest">Ver tudo</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2rem] p-6 hover:shadow-xl transition-all group">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={`https://picsum.photos/seed/${i+10}/200`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Thumb" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-500">Design System</span>
                      <h4 className="font-bold dark:text-white text-lg leading-tight mt-1 mb-2">Mastering Framer Motion</h4>
                      <div className="flex items-center gap-4 text-[10px] opacity-40 dark:text-white/60 font-bold uppercase">
                        <span>12 Aulas</span>
                        <span>4.5h Total</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[3rem] p-10">
            <h3 className="text-xl font-bold dark:text-white mb-8">Estatísticas</h3>
            <div className="space-y-8">
              <StatItem label="Horas de estudo" value="124h" sub="Neste mês" icon="ph-clock-countdown" color="text-blue-500" />
              <StatItem label="Certificados" value="08" sub="Concluídos" icon="ph-certificate" color="text-emerald-500" />
              <StatItem label="Pontos de Rank" value="1.250" sub="Top 5%" icon="ph-chart-bar" color="text-yellow-500" />
            </div>
            <button className="w-full mt-10 border border-black/10 dark:border-white/10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition">
              Gerar Relatório
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-10 text-white relative overflow-hidden group">
            <i className="ph ph-crown absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12 group-hover:scale-110 transition-transform"></i>
            <h3 className="text-xl font-bold mb-4 leading-tight">Acesso Pro Expira em 12 dias</h3>
            <p className="text-sm opacity-80 mb-8 leading-relaxed">Não perca o acesso à comunidade e assets exclusivos.</p>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl">Renovar Agora</button>
          </div>
        </div>
      </div>
    </main>
  );
};

const StatItem: React.FC<{ label: string, value: string, sub: string, icon: string, color: string }> = ({ label, value, sub, icon, color }) => (
  <div className="flex items-center gap-5">
    <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-2xl ${color}`}>
      <i className={`ph ${icon}`}></i>
    </div>
    <div>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-white/40 block">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black dark:text-white">{value}</span>
        <span className="text-[9px] font-medium opacity-60 dark:text-white/40">{sub}</span>
      </div>
    </div>
  </div>
);

export default PainelPage;
