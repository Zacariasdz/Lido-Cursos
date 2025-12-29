
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  isExpanded: boolean;
}

const EditarCursoPage: React.FC = () => {
  const navigate = useNavigate();
  const [courseImg, setCourseImg] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial dummy data
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'm1',
      title: 'Módulo 01: Fundamentos',
      isExpanded: true,
      lessons: [
        { id: 'l1', title: 'Introdução ao curso', videoSrc: 'https://vimeo.com/824804225', duration: '05:00' },
        { id: 'l2', title: 'O que é UI?', videoSrc: '', duration: '12:00' },
      ]
    },
    {
      id: 'm2',
      title: 'Módulo 02: Design Tokens',
      isExpanded: false,
      lessons: [
        { id: 'l3', title: 'Tipografia Dinâmica', videoSrc: '', duration: '15:00' },
      ]
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleModule = (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
    ));
  };

  const addModule = () => {
    const newModule: Module = {
      id: `m-${Date.now()}`,
      title: 'Novo Módulo',
      isExpanded: true,
      lessons: []
    };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, { id: `l-${Date.now()}`, title: 'Nova Aula', videoSrc: '', duration: '00:00' }]
        };
      }
      return m;
    }));
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        };
      }
      return m;
    }));
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 animate__animated animate__fadeIn">
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/criador" className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/5 shadow-sm hover:scale-110 transition" aria-label="Voltar para o painel do criador">
            <i className="ph ph-arrow-left text-xl" aria-hidden="true"></i>
          </Link>
          <h1 className="text-3xl font-black tracking-tighter dark:text-white">Configurações do Curso</h1>
        </div>
        <button onClick={() => navigate('/criador')} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-xl shadow-blue-500/20">
          Salvar Alterações
        </button>
      </header>

      <div className="space-y-10">
        <section className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[3rem] p-10 shadow-sm space-y-8">
           <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40 border-b border-black/5 dark:border-white/5 pb-2">Informações Básicas</h2>
           
           <div className="space-y-6">
             {/* Cover Image Section */}
             <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="w-full md:w-64 aspect-video rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 shadow-inner bg-black/5 dark:bg-white/5 relative group">
                 <img src={courseImg} className="w-full h-full object-cover" alt="Preview da Capa" />
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2"
                  aria-label="Alterar imagem de capa"
                 >
                   <i className="ph ph-camera text-2xl" aria-hidden="true"></i>
                   <span className="text-[10px] font-black uppercase tracking-widest">Alterar Capa</span>
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
               </div>
               
               <div className="flex-1 space-y-4 w-full">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">URL da Imagem de Capa</label>
                    <input 
                      type="text" 
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={courseImg.startsWith('data:') ? 'Arquivo Local Selecionado' : courseImg}
                      onChange={(e) => setCourseImg(e.target.value)}
                      className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white" 
                    />
                 </div>
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Título do Curso</label>
               <input type="text" defaultValue="Arquitetura de UI Avançada" className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Preço (R$)</label>
                  <input type="number" defaultValue="597" className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Categoria</label>
                  <div className="relative">
                    <select className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white appearance-none">
                      <option>Design System</option>
                      <option>Motion Design</option>
                      <option>Frontend</option>
                    </select>
                    <i className="ph ph-caret-down absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"></i>
                  </div>
                </div>
             </div>
           </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[3rem] p-10 shadow-sm">
           <div className="flex items-center justify-between mb-8">
             <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40">Ementa e Conteúdo em Vídeo</h2>
             <button 
               onClick={addModule}
               className="text-blue-500 font-bold text-xs uppercase tracking-widest hover:underline"
             >
               + Novo Módulo
             </button>
           </div>
           
           <div className="space-y-6">
              {modules.map((m) => (
                <div key={m.id} className="space-y-4">
                  <div 
                    onClick={() => toggleModule(m.id)}
                    className="flex items-center justify-between p-6 bg-black/5 dark:bg-white/5 rounded-[2rem] group hover:bg-black/10 transition cursor-pointer border border-transparent hover:border-black/5"
                  >
                     <div className="flex items-center gap-4">
                        <i className={`ph ph-caret-${m.isExpanded ? 'down' : 'right'} opacity-40`}></i>
                        <div>
                           <h4 className="font-bold dark:text-white">{m.title}</h4>
                           <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest">{m.lessons.length} aulas</span>
                        </div>
                     </div>
                     <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition">
                        <button className="text-blue-500 hover:scale-110 transition" aria-label="Editar nome do módulo"><i className="ph ph-pencil-simple"></i></button>
                        <button className="text-red-500 hover:scale-110 transition" aria-label="Excluir módulo"><i className="ph ph-trash"></i></button>
                     </div>
                  </div>

                  {m.isExpanded && (
                    <div className="pl-8 space-y-4 animate__animated animate__fadeIn">
                      {m.lessons.map((lesson) => (
                        <LessonEditor 
                          key={lesson.id} 
                          lesson={lesson} 
                          onUpdate={(updates) => updateLesson(m.id, lesson.id, updates)} 
                        />
                      ))}
                      <button 
                        onClick={() => addLesson(m.id)}
                        className="w-full p-4 border-2 border-dashed border-black/5 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        + Adicionar Aula ao Módulo
                      </button>
                    </div>
                  )}
                </div>
              ))}
           </div>
        </section>
      </div>
    </main>
  );
};

const LessonEditor: React.FC<{ lesson: Lesson, onUpdate: (updates: Partial<Lesson>) => void }> = ({ lesson, onUpdate }) => {
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Start simulated upload
      setUploadProgress(0);
      setIsEditingVideo(true);
      
      let progress = 0;
      const totalSteps = 100;
      const stepTime = 50; // ms per 1%
      
      const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          const videoUrl = URL.createObjectURL(file);
          onUpdate({ videoSrc: videoUrl });
          
          // Small delay before hiding progress for smoothness
          setTimeout(() => {
            setUploadProgress(null);
            setTimeRemaining(null);
          }, 800);
        } else {
          setUploadProgress(Math.floor(progress));
          // Simple heuristic for time remaining
          const remainingPercent = 100 - progress;
          const remainingSeconds = Math.ceil((remainingPercent * stepTime) / 250); // Simulating varied speed
          setTimeRemaining(`${remainingSeconds}s`);
        }
      }, stepTime);
    }
  };

  const isExternalVideo = (url: string) => {
    return url.includes('vimeo.com') || url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('youtube.com') ? url.split('v=').pop()?.split('&')[0] : url.split('/').pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="bg-white dark:bg-zinc-800/50 border border-black/5 dark:border-white/5 rounded-[2rem] p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <input 
            type="text" 
            value={lesson.title} 
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full bg-transparent border-none font-bold text-sm focus:ring-0 p-0 dark:text-white"
            placeholder="Título da Aula"
          />
          <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{lesson.duration || '00:00'}</span>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setIsEditingVideo(!isEditingVideo)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${lesson.videoSrc ? 'bg-emerald-500/10 text-emerald-500' : 'bg-black/5 dark:bg-white/5 opacity-40 hover:opacity-100'}`}
            aria-label="Configurar vídeo"
           >
             <i className={`ph ${lesson.videoSrc ? 'ph-video-camera-fill' : 'ph-video-camera'}`}></i>
           </button>
           <button className="w-10 h-10 bg-red-500/5 text-red-500 rounded-xl flex items-center justify-center opacity-40 hover:opacity-100 transition">
             <i className="ph ph-trash"></i>
           </button>
        </div>
      </div>

      {isEditingVideo && (
        <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-6 animate__animated animate__fadeInUp animate__faster">
          
          {/* Upload Progress Indicator */}
          {uploadProgress !== null && (
            <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl space-y-4 animate__animated animate__pulse animate__infinite">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                        <i className="ph ph-upload-simple"></i>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-blue-500">Fazendo upload do vídeo...</p>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Processando e assinando arquivo</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-black text-blue-500">{uploadProgress}%</p>
                     <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Restam aprox. {timeRemaining}</p>
                  </div>
               </div>
               <div className="h-1.5 bg-blue-500/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
               </div>
            </div>
          )}

          {/* Preview Area (Hide while uploading to keep focus on progress) */}
          {lesson.videoSrc && uploadProgress === null && (
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40 px-2">Visualização da Aula</label>
              <div className="aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-xl relative group">
                {isExternalVideo(lesson.videoSrc) ? (
                  <iframe 
                    src={getEmbedUrl(lesson.videoSrc)} 
                    className="w-full h-full" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen" 
                    title={`Preview: ${lesson.title}`}
                  ></iframe>
                ) : (
                  <video 
                    src={lesson.videoSrc} 
                    className="w-full h-full object-contain" 
                    controls
                  />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 px-2">URL do Vídeo (Vimeo/Youtube)</label>
                <input 
                  type="text" 
                  value={lesson.videoSrc.startsWith('blob:') ? 'Vídeo Local Carregado' : lesson.videoSrc}
                  onChange={(e) => onUpdate({ videoSrc: e.target.value })}
                  placeholder="https://vimeo.com/..."
                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white disabled:opacity-50"
                  disabled={uploadProgress !== null}
                />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 px-2">Ou Upload de Arquivo</label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadProgress !== null}
                  className={`w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black/10 transition dark:text-white text-left flex items-center justify-between ${uploadProgress !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="truncate">{lesson.videoSrc.startsWith('blob:') ? 'Vídeo Carregado' : (uploadProgress !== null ? 'Carregando...' : 'Selecionar MP4...')}</span>
                  <i className="ph ph-upload-simple"></i>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />
             </div>
          </div>
          
          {lesson.videoSrc && uploadProgress === null && (
            <div className="mt-4 p-4 bg-emerald-500/5 rounded-2xl flex items-center gap-4 border border-emerald-500/10">
               <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0">
                 <i className="ph-fill ph-check-circle text-xl"></i>
               </div>
               <div>
                  <p className="text-xs font-bold text-emerald-600">Vídeo pronto para publicação</p>
                  <p className="text-[9px] opacity-60 uppercase font-black tracking-widest">O player será carregado automaticamente para os alunos.</p>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditarCursoPage;
