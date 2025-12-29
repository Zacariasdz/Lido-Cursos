
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

interface Lesson {
  id: string;
  title: string;
  videoSrc: string;
  duration: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

const PlayerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('id');

  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      navigate('/painel');
      return;
    }
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      setCourse(data);
      
      if (data.modules && data.modules.length > 0 && data.modules[0].lessons.length > 0) {
        setActiveLesson(data.modules[0].lessons[0]);
      }
    } catch (err) {
      console.error('Erro ao carregar curso no player:', err);
      navigate('/painel');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sanitização e Otimização de Embed para aulas
   * Resolve erro 153 e garante som disponível
   */
  const optimizeLessonEmbed = (htmlCode: string) => {
    if (!htmlCode) return '';
    const origin = window.location.origin;
    let optimized = htmlCode;

    // YouTube
    if (optimized.includes('youtube.com/embed/')) {
      const videoIdMatch = optimized.match(/\/embed\/([^"|?|\s|>|/]+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1].trim();
        // Parâmetros para API de JS, Origem, Mute inicializado como 0 (permitir som se o user clicar)
        const params = `?enablejsapi=1&origin=${origin}&widget_referrer=${origin}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&controls=1&autoplay=0`;
        optimized = optimized.replace(/src="[^"]+"/, `src="https://www.youtube.com/embed/${videoId}${params}"`);
      }
    } 
    // Vimeo
    else if (optimized.includes('player.vimeo.com/video/')) {
      const vIdMatch = optimized.match(/\/video\/([^"|?|\s|>|/]+)/);
      if (vIdMatch && vIdMatch[1]) {
        const vId = vIdMatch[1].trim();
        const params = `?quality=1080p&playsinline=1&title=0&byline=0&portrait=0`;
        optimized = optimized.replace(/src="[^"]+"/, `src="https://player.vimeo.com/video/${vId}${params}"`);
      }
    }

    // Estilo para preencher o container de forma responsiva
    if (optimized.includes('<iframe')) {
      optimized = optimized.replace('<iframe', '<iframe style="width:100%; height:100%; border:none;"');
    }

    return optimized;
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0e14]">
      <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0e14] text-white flex flex-col md:flex-row overflow-hidden animate__animated animate__fadeIn">
      <aside className="hidden md:flex flex-col w-[380px] bg-[#121820] border-r border-white/5 shrink-0 h-full overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <Link to="/painel" className="flex items-center gap-3 opacity-60 hover:opacity-100 transition">
             <i className="ph ph-house text-lg"></i>
             <span className="font-bold text-xs uppercase tracking-widest">Painel</span>
          </Link>
        </div>

        <div className="p-10 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-2xl font-black tracking-tighter mb-4 leading-tight">{course?.title}</h2>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[15%]"></div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar pb-32">
          {course?.modules?.map((module: Module, mIdx: number) => (
            <div key={module.id || mIdx}>
              <div className="px-8 py-4 bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                Módulo {mIdx + 1}: {module.title}
              </div>
              {module.lessons.map((lesson: Lesson) => (
                <button 
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full p-6 border-b border-white/[0.03] flex items-center gap-4 transition text-left group hover:bg-white/5 relative ${activeLesson?.id === lesson.id ? 'bg-blue-600/10' : ''}`}
                >
                  {activeLesson?.id === lesson.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 ${activeLesson?.id === lesson.id ? 'bg-blue-600' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <i className={`ph-fill ${activeLesson?.id === lesson.id ? 'ph-play' : 'ph-video-camera'} text-lg`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${activeLesson?.id === lesson.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{lesson.title}</h4>
                    <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">{lesson.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-black h-full">
        <section className="w-full bg-black relative aspect-video md:aspect-auto md:h-[70vh] shadow-2xl shrink-0">
           {activeLesson?.videoSrc ? (
             <div 
               className="w-full h-full" 
               dangerouslySetInnerHTML={{ __html: optimizeLessonEmbed(activeLesson.videoSrc) }} 
             />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
               <i className="ph ph-video-slash text-6xl mb-4"></i>
               <p className="font-bold uppercase tracking-widest text-xs">Sem vídeo disponível</p>
             </div>
           )}
        </section>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-48 bg-[#0a0e14]">
           <div className="max-w-4xl mx-auto px-10 py-16">
              <div className="animate__animated animate__fadeInUp">
                 <div className="flex items-center gap-4 mb-6">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Em aula</span>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{activeLesson?.duration}</span>
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">{activeLesson?.title}</h1>
                 <p className="text-xl text-white/40 leading-relaxed font-medium">Assista atentamente ao conteúdo técnico acima.</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerPage;
