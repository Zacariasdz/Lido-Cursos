
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PlayerPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const playlist = [
    { title: "Boas vindas ao curso", time: "02:15", type: "video", active: false },
    { title: "O que é um Design System?", time: "10:45", type: "video", active: true },
    { title: "Design Tokens Fundamentais", time: "25:00", type: "video", active: false },
    { title: "Exercício Prático 01", type: "file", active: false },
    { title: "Arquitetura de Espaçamento", time: "18:20", type: "video", active: false },
    { title: "Grades e Layouts Adaptáveis", time: "32:10", type: "video", active: false },
    { title: "Tipografia Escalonável", time: "15:45", type: "video", active: false },
    { title: "Iconografia e Assets", time: "12:30", type: "video", active: false },
  ];

  return (
    <div className="h-screen bg-[#0a0e14] text-white flex flex-col md:flex-row overflow-hidden animate__animated animate__fadeIn">
      {/* Sidebar Navigation */}
      <aside 
        className={`${sidebarOpen ? 'w-full md:w-96' : 'w-0'} bg-[#121820] border-r border-white/5 transition-all duration-500 overflow-hidden flex flex-col relative z-20 shrink-0`}
        aria-label="Grade de aulas"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
          <Link to="/painel" className="flex items-center gap-2 group" aria-label="Voltar ao Painel">
             <i className="ph ph-house text-xl opacity-60 group-hover:opacity-100" aria-hidden="true"></i>
             <span className="font-bold text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100">Dashboard</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden p-2 bg-white/5 rounded-lg"
            aria-label="Fechar menu lateral"
          >
            <i className="ph ph-x" aria-hidden="true"></i>
          </button>
        </div>

        <div className="p-8 border-b border-white/5 shrink-0">
          <h2 className="text-xl font-bold tracking-tight mb-2">Arquitetura de UI</h2>
          <div className="flex items-center gap-3 text-xs opacity-50 font-medium">
            <span>2 / 12 aulas concluídas</span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true"></div>
            <span>15%</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar pb-32">
          {playlist.map((item, idx) => (
            <button 
              key={idx} 
              className={`w-full p-6 flex items-center gap-4 transition text-left border-b border-white/5 group hover:bg-white/5 ${item.active ? 'bg-blue-600/10 border-r-4 border-r-blue-500' : ''}`}
              aria-current={item.active ? 'page' : undefined}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${item.active ? 'bg-blue-600' : 'bg-white/5 group-hover:bg-white/10'}`}>
                {item.type === 'video' ? <i className="ph-fill ph-play" aria-hidden="true"></i> : <i className="ph ph-file-pdf" aria-hidden="true"></i>}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-bold mb-1 ${item.active ? 'text-blue-500' : ''}`}>{item.title}</h4>
                {item.time && <span className="text-[10px] opacity-40 uppercase tracking-widest">{item.time}</span>}
              </div>
              {item.active && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true"></div>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-black" role="main">
        {/* Top Navbar in Player */}
        <header className="p-6 flex items-center justify-between bg-transparent absolute top-0 w-full z-30 pointer-events-none">
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-3 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 pointer-events-auto hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Abrir menu lateral"
            >
              <i className="ph ph-list text-xl" aria-hidden="true"></i>
            </button>
          )}
          <div className="flex-1"></div>
          <div className="flex items-center gap-4 pointer-events-auto">
             <button 
              className="p-3 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Abrir chat da aula"
             >
               <i className="ph ph-chat-centered-text text-xl" aria-hidden="true"></i>
             </button>
             <button 
              className="p-3 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Download de materiais complementares"
             >
               <i className="ph ph-download-simple text-xl" aria-hidden="true"></i>
             </button>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 bg-[#0a0e14]">
          {/* Video Area */}
          <section className="w-full bg-black relative aspect-video flex items-center justify-center">
             <iframe 
                src="https://player.vimeo.com/video/824804225?autoplay=1&title=0&byline=0&portrait=0" 
                className="w-full h-full"
                frameBorder="0" 
                allow="autoplay; fullscreen" 
                allowFullScreen
                title="Vídeo da aula: O que é um Design System?"
              ></iframe>
          </section>

          {/* Lesson Details Section */}
          <section className="max-w-4xl mx-auto p-8 md:p-12 space-y-10">
             <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 block">Módulo 01 • Aula 02</span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">O que é um Design System?</h1>
                <p className="text-lg opacity-60 leading-relaxed font-medium">
                  Nesta aula, exploramos a fundação conceitual dos sistemas de design. Entenda por que grandes empresas como Apple, Google e Airbnb investem pesado nessa arquitetura e como ela resolve problemas de inconsistência e escala.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] space-y-4">
                   <h3 className="text-sm font-bold uppercase tracking-widest opacity-40">Tópicos abordados</h3>
                   <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm font-medium"><i className="ph ph-check-circle text-blue-500"></i> Definição de Single Source of Truth</li>
                      <li className="flex items-center gap-3 text-sm font-medium"><i className="ph ph-check-circle text-blue-500"></i> Anatomia de um Design System</li>
                      <li className="flex items-center gap-3 text-sm font-medium"><i className="ph ph-check-circle text-blue-500"></i> Benefícios para Designers e Devs</li>
                   </ul>
                </div>
                <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] space-y-4">
                   <h3 className="text-sm font-bold uppercase tracking-widest opacity-40">Material de Apoio</h3>
                   <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition group text-left">
                         <div className="flex items-center gap-3">
                            <i className="ph ph-file-pdf text-xl text-red-500"></i>
                            <span className="text-xs font-bold">Guia de Estudo.pdf</span>
                         </div>
                         <i className="ph ph-download-simple opacity-40 group-hover:opacity-100 transition"></i>
                      </button>
                      <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition group text-left">
                         <div className="flex items-center gap-3">
                            <i className="ph ph-figma-logo text-xl text-purple-500"></i>
                            <span className="text-xs font-bold">Template de Exercício</span>
                         </div>
                         <i className="ph ph-arrow-up-right opacity-40 group-hover:opacity-100 transition"></i>
                      </button>
                   </div>
                </div>
             </div>

             {/* Comments Section Simulation */}
             <div className="pt-10 border-t border-white/5">
                <h3 className="text-xl font-bold mb-8">Comentários da Aula</h3>
                <div className="space-y-8 pb-10">
                   <div className="flex gap-4">
                      <img src="https://i.pravatar.cc/100?u=1" className="w-10 h-10 rounded-full shadow-lg" alt="User 1" />
                      <div>
                         <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Thiago Ferreira</p>
                         <p className="text-sm opacity-70 leading-relaxed">Essa analogia com peças de LEGO fez tudo clicar na minha cabeça. Incrível!</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <img src="https://i.pravatar.cc/100?u=2" className="w-10 h-10 rounded-full shadow-lg" alt="User 2" />
                      <div>
                         <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Juliana Paes</p>
                         <p className="text-sm opacity-70 leading-relaxed">Gabriel, você recomenda começar pelo Figma ou pela documentação escrita?</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <img src="https://i.pravatar.cc/100?u=3" className="w-10 h-10 rounded-full shadow-lg" alt="User 3" />
                      <div>
                         <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Marcos Oliver</p>
                         <p className="text-sm opacity-70 leading-relaxed">Simplesmente a melhor explicação de Atomic Design que já vi até hoje.</p>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* PERSISTENT Floating Video Controls - Fixed to the bottom of the main area */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-40 p-6 pointer-events-none"
          aria-label="Controles do vídeo"
        >
           <div className="max-w-5xl mx-auto bg-zinc-900/90 backdrop-blur-3xl border border-white/10 p-5 md:p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] pointer-events-auto animate__animated animate__fadeInUp">
              <div className="flex items-center gap-6 w-full md:w-auto">
                 <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
                  aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                 >
                   <i className={`ph-fill ${isPlaying ? 'ph-pause' : 'ph-play'}`} aria-hidden="true"></i>
                 </button>
                 
                 <div className="flex items-center gap-4">
                    <button className="text-xl opacity-40 hover:opacity-100 transition" aria-label="Voltar 10 segundos">
                       <i className="ph ph-rewind" aria-hidden="true"></i>
                    </button>
                    <button className="text-xl opacity-40 hover:opacity-100 transition" aria-label="Avançar 10 segundos">
                       <i className="ph ph-fast-forward" aria-hidden="true"></i>
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                    <div 
                      className="h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer group"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={35}
                      aria-label="Progresso do vídeo"
                    >
                       <div className="h-full bg-blue-500 w-[35%] transition-all relative shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"></div>
                       </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">
                       <span aria-label="Tempo atual">04:12</span>
                       <span aria-label="Tempo total">10:45</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition">
                    <i className="ph ph-speaker-high text-lg"></i>
                    <div className="w-20 h-1 bg-white/20 rounded-full relative cursor-pointer">
                       <div className="absolute inset-y-0 left-0 bg-white w-3/4 rounded-full"></div>
                    </div>
                 </div>
                 <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                 <div className="flex items-center gap-6">
                    <button 
                      className="text-xl opacity-40 hover:opacity-100 transition focus:outline-none focus:opacity-100 focus:text-blue-500"
                      aria-label="Configurações de qualidade e velocidade"
                    >
                      <i className="ph ph-gear" aria-hidden="true"></i>
                    </button>
                    <button 
                      className="text-xl opacity-40 hover:opacity-100 transition focus:outline-none focus:opacity-100 focus:text-blue-500"
                      aria-label="Alternar tela cheia"
                    >
                      <i className="ph ph-corners-out" aria-hidden="true"></i>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerPage;
