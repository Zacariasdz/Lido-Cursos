
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

interface CourseProgress {
  id: string;
  title: string;
  category: string;
  image_url: string;
  progress: number;
}

const PainelPage: React.FC = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchEnrolledCourses();
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          progress,
          courses ( id, title, category, image_url )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      const formatted = (data || []).map((item: any) => ({
        ...item.courses,
        progress: item.progress
      }));
      
      setEnrolledCourses(formatted);
    } catch (err) {
      console.error('Erro ao carregar painel:', err);
    } finally {
      setLoading(false);
    }
  };

  const latestCourse = enrolledCourses[0] || null;

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 animate__animated animate__fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
        <div>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 block">Área do Aluno</span>
          <h1 className="text-3xl md:text-6xl font-black tracking-tighter dark:text-white">
            {user?.name ? `Olá, ${user.name.split(' ')[0]}.` : 'Bem-vindo.'}
          </h1>
          <p className="text-base md:text-xl opacity-50 mt-1 md:mt-2 dark:text-white/60 font-medium">Continue sua jornada.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {loading ? (
            <div className="h-64 bg-black/5 dark:bg-white/5 rounded-[3rem] animate-pulse"></div>
          ) : latestCourse ? (
            <div className="relative overflow-hidden bg-black rounded-[3rem] p-12 text-white shadow-2xl group">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 grayscale pointer-events-none group-hover:scale-110 transition-transform duration-[2s]">
                <img src={latestCourse.image_url} className="w-full h-full object-cover" alt="Background" />
              </div>
              <div className="relative z-10">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 inline-block">Em andamento</span>
                <h2 className="text-4xl font-bold mb-4 leading-tight">{latestCourse.title}</h2>
                <div className="flex items-center gap-2 mb-10 text-white/60 text-sm">
                  <i className="ph ph-stack"></i>
                  <span>{latestCourse.category}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link to={`/player?id=${latestCourse.id}`} className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-2xl font-bold text-sm hover:bg-gray-200 transition flex items-center justify-center gap-2">
                    <i className="ph-fill ph-play"></i> Retomar Aula
                  </Link>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between text-[9px] uppercase font-bold mb-2 opacity-50">
                      <span>Progresso</span>
                      <span>{latestCourse.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${latestCourse.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-black/5 p-20 rounded-[3rem] text-center">
              <p className="opacity-40 font-bold mb-8">Você ainda não iniciou nenhum curso.</p>
              <Link to="/cursos" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl">Explorar Catálogo</Link>
            </div>
          )}

          <section>
             <h3 className="text-2xl font-bold dark:text-white tracking-tight mb-8">Meus Cursos</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.slice(1).map(course => (
                  <Link key={course.id} to={`/player?id=${course.id}`} className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2rem] p-6 hover:shadow-xl transition group">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <img src={course.image_url} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Thumb" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-blue-500">{course.category}</span>
                        <h4 className="font-bold dark:text-white text-lg leading-tight mt-1 mb-2">{course.title}</h4>
                        <div className="h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
             </div>
          </section>
        </div>

        <aside className="space-y-10">
          <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[3rem] p-10">
            <h3 className="text-xl font-bold dark:text-white mb-8">Sua Evolução</h3>
            <div className="space-y-8">
              <StatItem label="Cursos Concluídos" value={enrolledCourses.filter(c => c.progress === 100).length.toString()} sub="Total" icon="ph-certificate" color="text-emerald-500" />
              <StatItem label="Em Progresso" value={enrolledCourses.filter(c => c.progress < 100).length.toString()} sub="Cursos" icon="ph-chart-pie" color="text-blue-500" />
            </div>
          </div>
        </aside>
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
