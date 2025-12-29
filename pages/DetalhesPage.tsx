
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

type Step = 'info' | 'plan' | 'payment' | 'success';

interface CourseData {
  id: string;
  title: string;
  category: string;
  price: number;
  image_url: string;
  preview_embed_code?: string;
  modules: any[];
}

const DetalhesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('id');

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);
  
  const modulesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!courseId) {
      navigate('/cursos');
      return;
    }
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      if (error) throw error;
      setCourse(data);
      // Tempo para o player carregar e disparar o fade
      setTimeout(() => setIsVideoReady(true), 1500);
    } catch (err) {
      console.error('Erro ao carregar curso:', err);
      navigate('/cursos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hard-Sanitization de Embed para evitar Erro 153/150 do YouTube
   * Conforme manual oficial (origin, enablejsapi)
   */
  const optimizeEmbedCode = (htmlCode: string) => {
    if (!htmlCode) return '';
    
    const origin = window.location.origin;
    let optimized = htmlCode;

    // Regex para detectar Iframe do YouTube
    if (optimized.includes('youtube.com/embed/')) {
      const videoIdMatch = optimized.match(/\/embed\/([^"|?|\s|>|/]+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1].trim();
        // Parâmetros para Autoplay, Mute (exigido para autoplay), API de JS e Origem exata
        const params = `?autoplay=1&mute=1&loop=1&playlist=${videoId}&enablejsapi=1&origin=${origin}&widget_referrer=${origin}&playsinline=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`;
        
        // Reconstrói o src ignorando lixo anterior
        optimized = optimized.replace(/src="[^"]+"/, `src="https://www.youtube.com/embed/${videoId}${params}"`);
      }
    } 
    // Vimeo
    else if (optimized.includes('player.vimeo.com/video/')) {
      const vimeoIdMatch = optimized.match(/\/video\/([^"|?|\s|>|/]+)/);
      if (vimeoIdMatch && vimeoIdMatch[1]) {
        const vId = vimeoIdMatch[1].trim();
        const params = `?autoplay=1&muted=1&loop=1&background=1&quality=1080p&transparent=0&playsinline=1`;
        optimized = optimized.replace(/src="[^"]+"/, `src="https://player.vimeo.com/video/${vId}${params}"`);
      }
    }

    // Atributos de performance e permissão (som, fullscreen)
    if (!optimized.includes('loading=')) {
      optimized = optimized.replace('<iframe', '<iframe loading="lazy"');
    }
    if (!optimized.includes('allow=')) {
      optimized = optimized.replace('<iframe', '<iframe allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"');
    }

    return optimized;
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: course?.title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 'info') setCurrentStep('plan');
    else if (currentStep === 'plan') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('success');
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0e14]">
      <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white selection:bg-blue-500/30">
      <section className="relative h-[75vh] md:h-[90vh] w-full overflow-hidden bg-[#0a0e14]">
        {/* Loader elegante de Vídeo */}
        <div className={`absolute inset-0 z-40 bg-[#0a0e14] flex flex-col items-center justify-center transition-opacity duration-1000 ${isVideoReady ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          <span className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Iniciando Experiência</span>
        </div>
        
        {/* Container do Vídeo: Removido Grayscale e ajustado para cores vivas */}
        <div className={`absolute inset-0 z-0 transition-all duration-[2000ms] ${isVideoReady ? 'scale-100 opacity-60 saturate-[1.2]' : 'scale-110 blur-2xl opacity-0'} video-embed-wrapper`}>
          {course?.preview_embed_code ? (
            <div 
              className="w-full h-full pointer-events-none" 
              dangerouslySetInnerHTML={{ __html: optimizeEmbedCode(course.preview_embed_code) }} 
            />
          ) : (
            <img src={course?.image_url} className="w-full h-full object-cover opacity-20 blur-sm" alt="Fallback" />
          )}
        </div>

        {/* Gradiente de sobreposição para leitura */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/20 to-[#0a0e14]/40 z-10 pointer-events-none"></div>
        
        <div className="absolute top-8 left-8 md:left-12 z-30">
          <Link to="/cursos" className="flex items-center gap-3 text-white/60 hover:text-white transition group px-5 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl">
            <i className="ph ph-arrow-left text-lg group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Catálogo</span>
          </Link>
        </div>
      </section>

      <main className="relative z-20 -mt-24 md:-mt-32 max-w-7xl mx-auto px-6 pb-32">
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-8 animate__animated animate__fadeInUp">
            <span className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30">Mestrado Lido</span>
            <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 text-[10px] font-bold text-white/50 uppercase tracking-widest">{course?.category}</div>
          </div>
          
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8 animate__animated animate__fadeInUp">
            {course?.title.split(' ').slice(0, 2).join(' ')} <br /> 
            <span className="text-white/20 italic font-medium">{course?.title.split(' ').slice(2).join(' ')}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-16 animate__animated animate__fadeInUp animate__delay-1s">
            <button onClick={handleShare} className={`group flex items-center gap-4 backdrop-blur-md border px-6 py-4 rounded-2xl transition-all ${shareFeedback ? 'text-emerald-500 border-emerald-500/40 bg-emerald-500/5' : 'bg-white/5 border-white/10'}`}>
              <i className={`ph ${shareFeedback ? 'ph-check' : 'ph-share-network'} text-xl`}></i>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">{shareFeedback ? 'Copiado!' : 'Compartilhar'}</span>
            </button>
            <button onClick={() => modulesRef.current?.scrollIntoView({ behavior: 'smooth' })} className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl transition-all">
              <i className="ph ph-stack text-xl opacity-40"></i>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Ementa</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16">
            <div className="lg:col-span-7 space-y-12">
              <p className="text-xl md:text-3xl text-white/40 leading-relaxed font-medium">Eleve seu nível técnico em {course?.title} com uma curadoria de elite baseada em padrões industriais.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-5 p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500"><i className="ph ph-certificate text-3xl"></i></div>
                  <div><span className="text-[10px] font-black uppercase tracking-widest opacity-30 block">Certificado</span><span className="font-bold text-lg block">Premium</span></div>
                </div>
                <div className="flex items-center gap-5 p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><i className="ph ph-lightning text-3xl"></i></div>
                  <div><span className="text-[10px] font-black uppercase tracking-widest opacity-30 block">Acesso</span><span className="font-bold text-lg block">Vitalício</span></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-14 sticky top-32 shadow-2xl">
                <div className="mb-12 text-center md:text-left">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500 block mb-4">Inscrições Abertas</span>
                  <div className="flex items-baseline gap-3"><span className="text-6xl font-black tracking-tighter">{course?.price} MZN</span></div>
                </div>
                <button onClick={() => { setShowCheckout(true); setCurrentStep('info'); }} className="w-full bg-white text-black py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">Matricular-se Agora</button>
              </div>
            </div>
          </div>
        </header>

        <section ref={modulesRef} className="mt-40 scroll-mt-32">
          <div className="max-w-xl mb-20">
            <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-none">Ementa</h2>
            <p className="text-lg opacity-40 font-medium leading-relaxed">Conheça os módulos do treinamento e a progressão pedagógica.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {course?.modules?.map((m: any, i: number) => (
              <div key={i} className="group bg-[#161b22]/40 backdrop-blur-sm border border-white/5 p-10 md:p-14 rounded-[3.5rem] transition-all relative overflow-hidden hover:border-blue-500/30">
                <div className="relative z-0">
                  <div className="flex justify-between items-start mb-16">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-sm font-black text-blue-500 border border-white/5">0{i+1}</div>
                  </div>
                  <h3 className="text-3xl font-bold mb-12 leading-tight pr-10">{m.title}</h3>
                  <div className="flex items-center gap-4 pt-10 border-t border-white/5 text-[11px] font-black uppercase tracking-[0.2em] opacity-30">
                    <i className="ph ph-video text-xl"></i><span>{m.lessons?.length || 0} Aulas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showCheckout && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate__animated animate__fadeIn">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setShowCheckout(false)}></div>
          <div className="relative w-full max-w-xl bg-[#1c1c1e] border border-white/10 rounded-[4rem] shadow-2xl overflow-hidden">
            <div className="p-16 text-center">
               <h2 className="text-4xl font-black tracking-tighter mb-12">Finalizar</h2>
               <button onClick={handleNextStep} className="w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl bg-white text-black hover:bg-blue-600 hover:text-white">
                 {currentStep === 'success' ? <Link to={`/player?id=${courseId}`}>Acessar Curso</Link> : 'Confirmar Pagamento'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalhesPage;
