
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

interface Lesson {
  id: string;
  title: string;
  videoSrc: string; // Agora tratará o código de embed
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
  const location = useLocation();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('id');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!courseId);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('Design System');
  const [previewEmbedCode, setPreviewEmbedCode] = useState('');
  const [courseImg, setCourseImg] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800");
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    } else {
      setModules([{
        id: 'm1',
        title: 'Módulo 01: Introdução',
        isExpanded: true,
        lessons: [{ id: 'l1', title: 'Boas-vindas', videoSrc: '', duration: '05:00' }]
      }]);
    }
  }, [courseId]);

  const loadCourseData = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase.from('courses').select('*').eq('id', courseId).single();
      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setPrice(data.price);
        setCategory(data.category);
        setCourseImg(data.image_url);
        setPreviewEmbedCode(data.preview_embed_code || '');
        setModules(data.modules || []);
      }
    } catch (err: any) {
      console.error('Erro ao carregar curso:', err);
      navigate('/criador');
    } finally {
      setFetching(false);
    }
  };

  const isValidEmbed = (code: string) => {
    if (!code) return false;
    const lower = code.toLowerCase();
    const isIframe = lower.includes('<iframe') && lower.includes('</iframe>');
    const hasSrc = lower.includes('src=');
    const isYouTube = lower.includes('youtube.com/embed/');
    const isVimeo = lower.includes('player.vimeo.com/video/');
    return isIframe && hasSrc && (isYouTube || isVimeo);
  };

  const handleSave = async () => {
    if (!title) return alert('O título é obrigatório.');
    if (!user) return alert('Você precisa estar logado.');

    // Validar se todas as aulas preenchidas têm embed válido
    for (const m of modules) {
      for (const l of m.lessons) {
        if (l.videoSrc && !isValidEmbed(l.videoSrc)) {
          return alert(`O embed da aula "${l.title}" no módulo "${m.title}" parece inválido. Certifique-se de que é um <iframe> do YouTube ou Vimeo.`);
        }
      }
    }

    setLoading(true);
    try {
      const courseData: any = {
        title,
        price,
        category,
        image_url: courseImg,
        preview_embed_code: previewEmbedCode,
        modules,
        creator_id: user.id
      };

      if (!courseId) {
        courseData.back_gradient = 'from-blue-600 to-indigo-900';
        courseData.back_icon = 'ph-sketch-logo';
      }

      const { error } = courseId 
        ? await supabase.from('courses').update(courseData).eq('id', courseId)
        : await supabase.from('courses').insert([courseData]);

      if (error) throw error;

      alert(courseId ? 'Curso atualizado!' : 'Curso criado com sucesso!');
      navigate('/criador');
    } catch (err: any) {
      const message = err.message || JSON.stringify(err);
      alert('Erro ao salvar: ' + message);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m));
  };

  const addModule = () => {
    setModules([...modules, { 
      id: `m-${Date.now()}`, 
      title: `Novo Módulo ${modules.length + 1}`, 
      isExpanded: true, 
      lessons: [] 
    }]);
  };

  const removeModule = (moduleId: string) => {
    if (window.confirm('Excluir este módulo e todas as suas aulas?')) {
      setModules(prev => prev.filter(m => m.id !== moduleId));
    }
  };

  const addLesson = (moduleId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { 
          ...m, 
          lessons: [...m.lessons, { id: `l-${Date.now()}`, title: 'Nova Aula', videoSrc: '', duration: '10:00' }] 
        };
      }
      return m;
    }));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
      }
      return m;
    }));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { 
          ...m, 
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l) 
        };
      }
      return m;
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCourseImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (fetching) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f5f5f7] dark:bg-[#0a0e14]">
      <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 animate__animated animate__fadeIn mb-24">
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/criador" className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/5 shadow-sm hover:scale-110 transition">
            <i className="ph ph-arrow-left text-xl"></i>
          </Link>
          <h1 className="text-3xl font-black tracking-tighter dark:text-white">{courseId ? 'Editar Curso' : 'Novo Curso'}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-xl disabled:opacity-50 flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (courseId ? 'Salvar Alterações' : 'Publicar Agora')}
          </button>
        </div>
      </header>

      <div className="space-y-10">
        <section className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[3rem] p-8 md:p-12 shadow-sm space-y-8">
           <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40 border-b border-black/5 dark:border-white/5 pb-2">Informações Gerais</h2>
           <div className="space-y-8">
             <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="w-full md:w-80 aspect-video rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 shadow-inner bg-black/5 dark:bg-white/5 relative group shrink-0">
                 <img src={courseImg} className="w-full h-full object-cover" alt="Preview" />
                 <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                   <i className="ph ph-camera text-2xl"></i>
                   <span className="text-[10px] font-black uppercase tracking-widest">Alterar Capa</span>
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
               </div>
               <div className="flex-1 space-y-6 w-full">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Título do Curso</label>
                    <input type="text" placeholder="Ex: Masterclass em Motion Design" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 text-blue-500">Embed do Trailer (Iframe)</label>
                      {previewEmbedCode && (
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isValidEmbed(previewEmbedCode) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {isValidEmbed(previewEmbedCode) ? 'Embed Válido' : 'Embed Inválido'}
                        </span>
                      )}
                    </div>
                    <textarea 
                      placeholder="Cole aqui o código <iframe ...> do Vimeo ou YouTube" 
                      value={previewEmbedCode} 
                      onChange={(e) => setPreviewEmbedCode(e.target.value)} 
                      className={`w-full bg-blue-500/5 dark:bg-blue-500/5 border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white min-h-[100px] text-xs font-mono ${previewEmbedCode ? (isValidEmbed(previewEmbedCode) ? 'border-emerald-500/30' : 'border-red-500/30') : 'border-blue-500/10'}`}
                    />
                 </div>
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Preço (MZN)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Categoria</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white appearance-none">
                    <option>Design System</option>
                    <option>Motion Design</option>
                    <option>Frontend</option>
                    <option>Desenvolvimento</option>
                  </select>
                </div>
             </div>
           </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[3rem] p-8 md:p-12 shadow-sm">
           <div className="flex items-center justify-between mb-10">
             <div>
               <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40">Estrutura Curricular</h2>
               <p className="text-sm font-medium opacity-60 dark:text-white/50">Adicione módulos e cole os embeds das aulas.</p>
             </div>
             <button onClick={addModule} className="bg-blue-600/10 text-blue-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition">+ Novo Módulo</button>
           </div>

           <div className="space-y-8">
              {modules.map((m) => (
                <div key={m.id} className="bg-black/5 dark:bg-white/5 rounded-[2.5rem] p-1 overflow-hidden">
                  <div 
                    onClick={() => toggleModule(m.id)} 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-black/5 transition rounded-[2.2rem]"
                  >
                    <div className="flex items-center gap-4">
                      <i className={`ph ph-caret-${m.isExpanded ? 'down' : 'right'} opacity-30`}></i>
                      <input 
                        type="text" 
                        value={m.title} 
                        onClick={(e) => e.stopPropagation()} 
                        onChange={(e) => setModules(prev => prev.map(mod => mod.id === m.id ? {...mod, title: e.target.value} : mod))} 
                        className="bg-transparent border-none font-black text-lg dark:text-white outline-none focus:ring-0 p-0" 
                      />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeModule(m.id); }} className="text-red-500/40 hover:text-red-500 transition px-4">
                      <i className="ph ph-trash text-lg"></i>
                    </button>
                  </div>

                  {m.isExpanded && (
                    <div className="p-6 pt-2 space-y-4 animate__animated animate__fadeIn">
                      <div className="space-y-3">
                        {m.lessons.map((lesson) => (
                          <div key={lesson.id} className={`bg-white dark:bg-zinc-800 p-6 rounded-3xl border space-y-4 shadow-sm transition-colors ${lesson.videoSrc ? (isValidEmbed(lesson.videoSrc) ? 'border-emerald-500/20' : 'border-red-500/20') : 'border-black/5 dark:border-white/5'}`}>
                            <div className="flex items-center justify-between gap-4">
                              <input 
                                type="text" 
                                placeholder="Título da Aula"
                                value={lesson.title} 
                                onChange={(e) => updateLesson(m.id, lesson.id, 'title', e.target.value)} 
                                className="bg-transparent font-bold dark:text-white border-none outline-none flex-1 text-sm p-0 focus:ring-0" 
                              />
                              <div className="flex items-center gap-3">
                                {lesson.videoSrc && (
                                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isValidEmbed(lesson.videoSrc) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {isValidEmbed(lesson.videoSrc) ? 'Embed OK' : 'Embed Inválido'}
                                  </span>
                                )}
                                <button onClick={() => removeLesson(m.id, lesson.id)} className="text-red-500/20 hover:text-red-500 transition">
                                  <i className="ph ph-x-circle text-xl"></i>
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2 space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-1">Código de Embed (YouTube/Vimeo Iframe)</label>
                                <textarea 
                                  placeholder="Cole o <iframe> aqui"
                                  value={lesson.videoSrc} 
                                  onChange={(e) => updateLesson(m.id, lesson.id, 'videoSrc', e.target.value)} 
                                  className={`w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-[10px] font-mono outline-none focus:ring-1 focus:ring-blue-500 transition dark:text-white min-h-[60px] ${lesson.videoSrc ? (isValidEmbed(lesson.videoSrc) ? 'ring-1 ring-emerald-500/30' : 'ring-1 ring-red-500/30') : ''}`} 
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-1">Duração</label>
                                <input 
                                  type="text" 
                                  placeholder="Ex: 12:45"
                                  value={lesson.duration} 
                                  onChange={(e) => updateLesson(m.id, lesson.id, 'duration', e.target.value)} 
                                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-blue-500 transition dark:text-white" 
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => addLesson(m.id)} 
                        className="w-full p-5 border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:border-blue-500 hover:text-blue-500 transition"
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

export default EditarCursoPage;
