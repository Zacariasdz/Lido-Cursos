
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

interface CourseData {
  id: string;
  title: string;
  category: string;
  price: number;
  image_url: string;
  back_gradient: string;
  back_icon: string;
}

const CursosPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', 'Design System', 'Motion Design', 'Frontend', 'Desenvolvimento'];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let query = supabase.from('courses').select('*');
        
        if (activeCategory !== 'Todos') {
          query = query.eq('category', activeCategory);
        }

        const { data, error } = await query;
        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [activeCategory]);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-6 pt-10 md:pt-16 pb-20 animate__animated animate__fadeIn">
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div>
          <h1 className="text-3xl md:text-6xl font-extrabold tracking-tighter mb-2 md:mb-4 dark:text-white">Catálogo</h1>
          <p className="text-base md:text-xl opacity-50 font-medium dark:text-white/70">Aprenda as habilidades do futuro.</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <i className="ph ph-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-lg md:text-xl opacity-40 dark:text-white/40 group-focus-within:text-blue-500 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 rounded-[1.5rem] md:rounded-[2rem] pl-12 md:pl-14 pr-5 py-3.5 md:py-4 outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm dark:text-white text-sm"
          />
        </div>
      </header>

      <div className="flex gap-2.5 mb-10 md:mb-16 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-[11px] md:text-sm transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {[1,2,3].map(i => <div key={i} className="h-[420px] bg-black/5 dark:bg-white/5 animate-pulse rounded-[2.5rem]"></div>)}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center animate__animated animate__fadeIn">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ph ph-mask-sad text-3xl opacity-40"></i>
          </div>
          <h3 className="text-lg font-bold dark:text-white">Nenhum curso encontrado</h3>
          <p className="opacity-50 mt-2 text-sm">Tente ajustar sua busca ou categoria.</p>
        </div>
      )}
    </main>
  );
};

const CourseCard: React.FC<CourseData> = ({ id, title, category, price, image_url, back_gradient, back_icon }) => {
  return (
    <div className="relative group">
      <Link to={`/detalhes?id=${id}`} className="card-perspective block">
        <div className="card-inner">
          <div className="card-front bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm">
            <div className="h-40 md:h-48 overflow-hidden relative">
              <img src={image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={title} />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <i className="ph ph-eye text-white text-2xl"></i>
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-between h-[calc(100%-10rem)] md:h-[calc(100%-12rem)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{category}</span>
                <h3 className="text-xl md:text-2xl font-bold mt-2 leading-tight dark:text-white">{title}</h3>
              </div>
              <div className="flex justify-between items-center opacity-60 border-t border-gray-100 dark:border-white/5 pt-4 dark:text-white">
                <span className="text-sm font-bold">{price} MZN</span>
                <i className="ph ph-arrow-up-right text-lg"></i>
              </div>
            </div>
          </div>
          <div className={`card-back bg-gradient-to-br ${back_gradient || 'from-blue-600 to-blue-900'} p-8 md:p-10 flex flex-col justify-center items-center text-white shadow-2xl`}>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <i className={`ph ${back_icon || 'ph-sketch-logo'} text-2xl md:text-3xl`}></i>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Ementa Completa</h3>
            <p className="text-xs md:text-sm text-center opacity-80 mb-8 leading-relaxed">Descubra técnicas exclusivas e fluxos profissionais.</p>
            <button className="bg-white text-blue-600 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-xs md:text-sm shadow-xl">Ver Detalhes</button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CursosPage;
