
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

const LandingPage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .limit(3);
        if (error) throw error;
        setFeaturedCourses(data || []);
      } catch (err) {
        console.error('Error fetching landing page courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="animate__animated animate__fadeIn">
      <header className="max-w-7xl mx-auto pt-16 md:pt-24 pb-12 md:pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-8xl font-extrabold tracking-tighter mb-6 md:mb-8 leading-[1.1] dark:text-white">
          Pense. Crie.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-400">Evolua.</span>
        </h1>
        <p className="text-base md:text-xl opacity-60 max-w-xl mx-auto mb-10 md:mb-12 font-medium dark:text-white">
          A experiência educacional que une a estética da Apple com o conhecimento prático que o mercado exige.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/painel" className="w-full sm:w-auto bg-blue-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg hover:bg-blue-700 hover:scale-105 transition shadow-2xl shadow-blue-500/30">
            Acessar Painel
          </Link>
          <Link to="/cursos" className="w-full sm:w-auto border-2 border-gray-300 dark:border-white/20 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition">
            Ver cursos
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10 md:py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight dark:text-white">Cursos em Destaque</h2>
          <Link to="/cursos" className="text-xs font-black uppercase tracking-widest text-blue-500">Ver Catálogo Completo</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[420px] bg-black/5 dark:bg-white/5 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {featuredCourses.map(course => (
              <Link key={course.id} to={`/detalhes?id=${course.id}`} className="card-perspective">
                <div className="card-inner">
                  <div className="card-front bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                    <div className="h-40 md:h-48 overflow-hidden">
                      <img 
                        src={course.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"} 
                        className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
                        alt={course.title} 
                      />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-between h-[calc(100%-10rem)] md:h-[calc(100%-12rem)]">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{course.category}</span>
                        <h3 className="text-xl md:text-2xl font-bold mt-2 leading-tight dark:text-white">{course.title}</h3>
                      </div>
                      <div className="flex justify-between items-center opacity-60 border-t border-gray-100 dark:border-white/5 pt-4 dark:text-white">
                        <span className="text-sm font-bold">{course.price} MZN</span>
                        <i className="ph ph-arrow-up-right text-lg"></i>
                      </div>
                    </div>
                  </div>
                  <div className={`card-back bg-gradient-to-br ${course.back_gradient || 'from-blue-600 to-blue-900'} p-8 md:p-10 flex flex-col justify-center items-center text-white`}>
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                      <i className={`ph ${course.back_icon || 'ph-sketch-logo'} text-2xl md:text-3xl`}></i>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-4">Mestrado Lido</h3>
                    <p className="text-xs md:text-sm text-center opacity-80 mb-8 leading-relaxed">Clique para ver todos os módulos e detalhes deste curso exclusivo.</p>
                    <button className="bg-white text-blue-600 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-xs md:text-sm shadow-xl">Ver Módulos</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
