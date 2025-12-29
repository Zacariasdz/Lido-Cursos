
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

type Step = 'info' | 'plan' | 'payment' | 'success';

const DetalhesPage: React.FC = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Initialize Vimeo Player
    if (iframeRef.current) {
      // @ts-ignore
      const player = new window.Vimeo.Player(iframeRef.current);
      playerRef.current = player;
      
      // Force initial muted state for autoplay compliance
      player.setMuted(true);

      player.on('loaded', () => {
        // Subtle delay for a more premium entrance feel
        setTimeout(() => {
          setIsVideoReady(true);
        }, 1200);
      });

      player.on('play', () => setIsHeroPlaying(true));
      player.on('pause', () => setIsHeroPlaying(false));
      player.on('ended', () => setIsHeroPlaying(false));

      // Handle external state changes
      player.getMuted().then((muted: boolean) => setIsMuted(muted));
      player.getPaused().then((paused: boolean) => setIsHeroPlaying(!paused));
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.unload();
      }
    };
  }, []);

  const toggleHeroPlay = async () => {
    if (!playerRef.current) return;
    try {
      const paused = await playerRef.current.getPaused();
      if (paused) {
        await playerRef.current.play();
      } else {
        await playerRef.current.pause();
      }
    } catch (error) {
      console.error("Playback control error:", error);
    }
  };

  const toggleMute = async () => {
    if (!playerRef.current) return;
    try {
      const currentlyMuted = await playerRef.current.getMuted();
      const nextMuteState = !currentlyMuted;
      
      // 1. Set Mute
      await playerRef.current.setMuted(nextMuteState);
      setIsMuted(nextMuteState);
      
      // 2. Set Volume if unmuting
      if (!nextMuteState) {
        await playerRef.current.setVolume(1);
      }

      // 3. Robust fix for "pause on unmute" issue
      // We check the player state directly after a short tick to ensure browser policy check is handled
      setTimeout(async () => {
        const paused = await playerRef.current.getPaused();
        if (paused && isHeroPlaying) {
          await playerRef.current.play();
        }
      }, 50);
      
    } catch (error) {
      console.error("Audio control error:", error);
    }
  };

  const modules = [
    { title: "Módulo 01: Introdução ao Design System", lessons: 4, duration: "45 min" },
    { title: "Módulo 02: Arquitetura de Design Tokens", lessons: 8, duration: "2h 15min" },
    { title: "Módulo 03: Componentes Atômicos Avançados", lessons: 12, duration: "4h 10min" },
    { title: "Módulo 04: Documentação e Storybook", lessons: 5, duration: "1h 30min" },
  ];

  const totalModules = modules.length;
  const totalLessons = modules.reduce((acc, curr) => acc + curr.lessons, 0);
  const totalDuration = "8h 40min";

  const handleNextStep = () => {
    if (currentStep === 'info') setCurrentStep('plan');
    else if (currentStep === 'plan') setCurrentStep('payment');
    else if (currentStep === 'payment') {
      setCurrentStep('success');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white selection:bg-blue-500/30">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[75vh] md:h-[88vh] w-full overflow-hidden bg-[#0a0e14]">
        
        {/* Advanced Smooth Loading Indicator */}
        <div 
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-1000 ease-out ${
            isVideoReady ? 'opacity-0 pointer-events-none translate-y-4 blur-xl' : 'opacity-100'
          }`}
        >
          <div className="absolute inset-0 bg-[#0a0e14] flex items-center justify-center">
             {/* Background glow animation */}
             <div className="absolute w-[800px] h-[800px] bg-blue-600/10 blur-[140px] rounded-full animate-pulse"></div>
          </div>

          <div className="relative flex flex-col items-center gap-12 text-center">
             <div className="w-24 h-24 relative">
                {/* Layered loading arcs */}
                <div className="absolute inset-0 border-[4px] border-white/5 rounded-full"></div>
                <div className="absolute inset-0 border-t-[4px] border-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-[2px] border-white/5 rounded-full animate-pulse"></div>
             </div>
             <div className="space-y-4">
                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 block">Lido Studios Present</h2>
                <div className="flex items-center justify-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-1 h-1 bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: `${i*100}ms` }}></div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Video Surface with Reveal Animation */}
        <div className={`absolute inset-0 z-0 transition-all duration-[2400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVideoReady ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-[1.08] blur-[80px]'
        }`}>
          <iframe 
            ref={iframeRef}
            src="https://player.vimeo.com/video/824804225?autoplay=1&loop=1&muted=1&controls=0&autopause=0&dnt=1&quality=auto" 
            className="w-full h-[120%] -translate-y-[10%] object-cover pointer-events-none"
            frameBorder="0" 
            allow="autoplay; fullscreen"
            title="Course Cinematic Experience"
          ></iframe>
        </div>
        
        {/* Artistic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/20 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-black/5 z-5"></div>
        
        {/* Navigation Back */}
        <div className="absolute top-8 left-6 md:left-12 z-30">
          <Link to="/cursos" className="flex items-center gap-3 text-white/60 hover:text-white transition group px-6 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl">
            <i className="ph ph-arrow-left text-lg group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Voltar</span>
          </Link>
        </div>

        {/* Refined "Floating Control Island" - Responsive & Accessible */}
        <div className={`absolute bottom-32 left-0 right-0 z-30 flex justify-center md:justify-end md:px-12 transition-all duration-1000 delay-500 ${
          isVideoReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}>
          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-2.5 md:p-3.5 rounded-full flex items-center gap-2.5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.9)] scale-90 md:scale-100">
            {/* Audio Toggle with visual feedback */}
            <button 
              onClick={toggleMute}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 group relative overflow-hidden ${
                !isMuted ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40 border border-white/10'
              }`}
              title={isMuted ? "Ativar Áudio" : "Mutar Áudio"}
              aria-label={isMuted ? "Ativar áudio do vídeo" : "Mutar áudio do vídeo"}
              aria-pressed={!isMuted}
            >
              <i className={`ph-fill ${isMuted ? 'ph-speaker-slash' : 'ph-speaker-high'} text-xl md:text-2xl z-10`}></i>
              {!isMuted && <span className="absolute inset-0 bg-blue-400/20 animate-pulse"></span>}
            </button>
            
            {/* Play/Pause Toggle */}
            <button 
              onClick={toggleHeroPlay}
              className="w-14 h-14 md:w-16 md:h-16 bg-white text-black rounded-full flex flex-col items-center justify-center hover:bg-gray-100 hover:scale-105 active:scale-90 shadow-2xl transition-all"
              title={isHeroPlaying ? "Pausar" : "Reproduzir"}
              aria-label={isHeroPlaying ? "Pausar vídeo do curso" : "Reproduzir vídeo do curso"}
              aria-pressed={isHeroPlaying}
            >
              <i className={`ph-fill ${isHeroPlaying ? 'ph-pause' : 'ph-play'} text-xl md:text-2xl`}></i>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative z-20 -mt-24 md:-mt-28 max-w-7xl mx-auto px-6 pb-32">
        <header className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 animate__animated animate__fadeInUp">
            <span className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30">Mestrado Lido</span>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
               <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em]">Status: Aberto</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10 animate__animated animate__fadeInUp">
            Arquitetura de UI <br /> <span className="text-white/20 italic font-medium">Avançada</span>
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="lg:col-span-7">
              <p className="text-xl md:text-2xl text-white/40 leading-relaxed font-medium mb-14">
                O curso definitivo para quem deseja dominar a criação de Design Systems escaláveis, do zero ao avançado, utilizando fluxos de trabalho reais.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-5 p-6 bg-white/5 rounded-[2.5rem] border border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <i className="ph ph-certificate text-3xl"></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30 block">Garantia</span>
                    <span className="font-bold text-lg">Certificado Vitalício</span>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-6 bg-white/5 rounded-[2.5rem] border border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <i className="ph ph-lightning text-3xl"></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30 block">Aprendizado</span>
                    <span className="font-bold text-lg">Método Prático</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-14 sticky top-32 shadow-[0_48px_96px_-12px_rgba(0,0,0,0.6)]">
                <div className="mb-12 text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-4">Investimento Master</span>
                  <div className="flex items-baseline justify-center md:justify-start gap-3">
                    <span className="text-5xl md:text-6xl font-black">R$ 597</span>
                    <span className="text-sm opacity-20 font-bold uppercase tracking-widest">Pago uma vez</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowCheckout(true);
                    setCurrentStep('info');
                  }}
                  className="w-full bg-white text-black py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all hover:scale-[1.02] active:scale-95 shadow-2xl"
                >
                  Garantir Acesso
                </button>
                
                <div className="mt-10 flex items-center justify-center gap-3 py-5 border-t border-white/5">
                   <i className="ph-fill ph-lock-key text-emerald-500 text-xl"></i>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Criptografia de 256 bits</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Modules Grid */}
        <section className="mt-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-xl">
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">O que você vai dominar</h2>
              <p className="text-lg opacity-40 font-medium leading-relaxed">Nossa ementa foi estruturada para levar você ao topo do mercado de design global.</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] bg-blue-500/10 text-blue-500 px-8 py-4 rounded-[1.5rem] border border-blue-500/20">
               <i className="ph-fill ph-check-circle text-lg"></i>
               Matrículas Disponíveis
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {modules.map((m, i) => (
              <div key={i} className="group bg-[#161b22]/40 backdrop-blur-sm border border-white/5 p-12 rounded-[4rem] transition-all relative overflow-hidden cursor-not-allowed hover:border-blue-500/20">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center gap-8 z-10">
                   <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center border border-white/20 shadow-2xl animate-bounce">
                      <i className="ph-fill ph-lock-key text-4xl text-white"></i>
                   </div>
                   <div className="text-center">
                     <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Acesso Bloqueado</p>
                     <p className="text-[9px] font-medium text-white/40 mt-2">Realize a matrícula para liberar</p>
                   </div>
                </div>

                <div className="relative z-0">
                  <div className="flex justify-between items-start mb-16">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-white/5 flex items-center justify-center text-sm font-black text-blue-500 border border-white/5">
                       0{i+1}
                    </div>
                    <i className="ph ph-sparkle text-white/10 text-3xl"></i>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-12 pr-12 group-hover:text-white/90 transition-colors leading-tight">{m.title}</h3>
                  
                  <div className="flex items-center gap-10 pt-10 border-t border-white/5">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-30">
                      <i className="ph ph-video text-xl"></i>
                      <span>{m.lessons} Aulas</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-30">
                      <i className="ph ph-clock-countdown text-xl"></i>
                      <span>{m.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Checkout Experience */}
      {showCheckout && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 animate__animated animate__fadeIn">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            onClick={() => setShowCheckout(false)}
          ></div>
          
          <div className="relative w-full max-w-2xl bg-[#1c1c1e] border border-white/10 rounded-[4rem] shadow-[0_64px_128px_-20px_rgba(0,0,0,0.8)] overflow-hidden animate__animated animate__zoomIn animate__faster">
            
            {/* Steps Progress */}
            {currentStep !== 'success' && (
              <div className="flex justify-center gap-4 p-12 pb-0">
                {(['info', 'plan', 'payment'] as Step[]).map((s, idx) => (
                  <div 
                    key={s} 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      currentStep === s ? 'w-16 bg-blue-500' : 'w-4 bg-white/10'
                    }`}
                  ></div>
                ))}
              </div>
            )}

            <div className="p-12 md:p-20">
              {currentStep === 'info' && (
                <div className="animate__animated animate__fadeIn">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Checkout</h2>
                  <p className="text-white/30 mb-12 text-lg font-medium">Inicie sua jornada confirmando seus dados.</p>
                  
                  <div className="space-y-6 mb-16 text-left">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center gap-6">
                      <div className="relative">
                        <img src="https://i.pravatar.cc/100" className="w-16 h-16 rounded-[1.5rem] object-cover" alt="User Avatar"/>
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-600 rounded-full border-[3px] border-[#1c1c1e] flex items-center justify-center">
                          <i className="ph-fill ph-check text-[10px]"></i>
                        </div>
                      </div>
                      <div>
                        <p className="font-black text-xl">Gabriel Valença</p>
                        <p className="text-[10px] opacity-40 uppercase tracking-[0.25em] font-black mt-1">gabriel@lido.com</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleNextStep} 
                    className="w-full bg-white text-black py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] hover:bg-gray-100 transition-all active:scale-95 shadow-2xl"
                  >
                    Prosseguir
                  </button>
                </div>
              )}

              {currentStep === 'plan' && (
                <div className="animate__animated animate__fadeIn">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Plano</h2>
                  <p className="text-white/30 mb-12 text-lg font-medium">Escolha a melhor modalidade para você.</p>
                  
                  <div className="space-y-4 mb-16 text-left">
                    <div className="p-8 bg-blue-600/10 border-2 border-blue-600 rounded-[3rem] flex items-center justify-between group cursor-pointer">
                      <div>
                        <p className="font-black text-2xl">Mestrado Vitalício</p>
                        <p className="text-[11px] text-blue-400 uppercase font-black tracking-[0.3em] mt-2">Acesso Ilimitado</p>
                      </div>
                      <span className="text-3xl font-black">R$ 597</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleNextStep} 
                    className="w-full bg-white text-black py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] hover:bg-gray-100 transition-all shadow-2xl"
                  >
                    Confirmar Plano
                  </button>
                </div>
              )}

              {currentStep === 'payment' && (
                <div className="animate__animated animate__fadeIn">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Finalizar</h2>
                  <p className="text-white/30 mb-12 text-lg font-medium">Segurança Apple Pay & Stripe.</p>
                  
                  <div className="space-y-8 mb-16 text-left">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 px-4">Cartão de Crédito</label>
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 flex items-center justify-between group focus-within:border-blue-500/50 transition-all">
                           <span className="text-lg opacity-20 italic font-medium tracking-widest">•••• •••• •••• ••••</span>
                           <i className="ph ph-credit-card text-2xl opacity-40"></i>
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={handleNextStep} 
                    className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-[0_24px_48px_rgba(37,99,235,0.4)] flex items-center justify-center gap-4 active:scale-95"
                  >
                    <i className="ph-fill ph-lock-key text-xl"></i>
                    Matricular Agora
                  </button>
                </div>
              )}

              {currentStep === 'success' && (
                <div className="text-center relative py-10">
                   {/* Celebratory Background Aura */}
                   <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full"></div>
                      {/* Animated Floating Particles */}
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i} 
                          className="absolute w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 200}ms`,
                            animationDuration: `${2 + Math.random() * 2}s`
                          }}
                        ></div>
                      ))}
                   </div>

                   <div className="animate__animated animate__bounceIn">
                      <div className="w-32 h-32 bg-emerald-500 rounded-[3.5rem] flex items-center justify-center text-white text-6xl mx-auto mb-12 shadow-[0_32px_64px_rgba(16,185,129,0.5)] border-[6px] border-emerald-400/20">
                         <i className="ph-fill ph-check-circle"></i>
                      </div>
                   </div>

                   <div className="animate__animated animate__fadeInUp animate__delay-1s">
                      <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-white leading-none">Vaga Confirmada!</h2>
                      <p className="text-white/40 mb-16 text-lg leading-relaxed max-w-sm mx-auto font-medium">
                        O futuro do seu design começa hoje. O acesso completo já está disponível no seu painel.
                      </p>
                      
                      <Link 
                        to="/player" 
                        className="block w-full bg-white text-black py-7 rounded-[3rem] font-black text-sm uppercase tracking-[0.5em] hover:bg-emerald-500 hover:text-white transition-all shadow-2xl active:scale-95 border-b-4 border-black/10"
                      >
                        Começar Aula 01
                      </Link>
                   </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowCheckout(false)} 
              className="absolute top-12 right-12 w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-white/30 hover:text-white transition-all border border-white/5"
              aria-label="Fechar"
            >
              <i className="ph ph-x text-2xl"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalhesPage;
