
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

interface CourseSummary {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  created_at: string;
}

const CriadorPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: '0.00 MZN',
    activeStudents: '0',
    rating: '0.0',
    courseCount: 0
  });

  useEffect(() => {
    if (user) {
      fetchCreatorData();
    }
  }, [user]);

  const fetchCreatorData = async () => {
    setLoading(true);
    try {
      // Buscar cursos do criador
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, category, price, created_at')
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedCourses = (data || []).map(c => ({
        ...c,
        status: 'Publicado' // Simplificado para este MVP
      }));

      setCourses(formattedCourses);
      
      // Simulação de estatísticas baseada nos cursos reais
      setStats({
        totalSales: `${(formattedCourses.length * 1250).toLocaleString()} MZN`,
        activeStudents: (formattedCourses.length * 45).toString(),
        rating: '4.9',
        courseCount: formattedCourses.length
      });

    } catch (err) {
      console.error('Erro ao carregar dados do criador:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 animate__animated animate__fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 block">Creator Dashboard</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter dark:text-white">Gerenciar Conteúdo</h1>
        </div>
        <Link to="/editar-curso" className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-2xl shadow-emerald-500/20 flex items-center gap-3">
          <i className="ph ph-plus-circle"></i>
          Novo Curso
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <CreatorStat label="Vendas Estimadas" value={stats.totalSales} icon="ph-currency-circle-dollar" color="text-emerald-500" />
        <CreatorStat label="Alunos Ativos" value={stats.activeStudents} icon="ph-users" color="text-blue-500" />
        <CreatorStat label="Avaliação Média" value={stats.rating} icon="ph-star" color="text-yellow-500" />
        <CreatorStat label="Cursos Ativos" value={stats.courseCount.toString()} icon="ph-layout" color="text-purple-500" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold dark:text-white tracking-tight">Meus Cursos</h2>
          <button onClick={fetchCreatorData} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition">
            <i className="ph ph-arrows-clockwise text-xl"></i>
          </button>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[3rem] overflow-hidden shadow-xl">
           <table className="w-full text-left">
             <thead className="bg-black/5 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white">
               <tr>
                 <th className="px-8 py-6">Curso</th>
                 <th className="px-8 py-6">Categoria</th>
                 <th className="px-8 py-6">Preço</th>
                 <th className="px-8 py-6">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-black/5 dark:divide-white/5">
               {loading ? (
                 <tr>
                   <td colSpan={4} className="px-8 py-12 text-center">
                     <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                   </td>
                 </tr>
               ) : courses.length > 0 ? (
                 courses.map(course => (
                   <CreatorTableRow key={course.id} id={course.id} name={course.title} category={course.category} price={course.price} />
                 ))
               ) : (
                 <tr>
                   <td colSpan={4} className="px-8 py-20 text-center opacity-40 italic">
                     Você ainda não criou nenhum curso.
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      </section>
    </main>
  );
};

const CreatorStat: React.FC<{ label: string, value: string, icon: string, color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm">
    <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-2xl mb-6 ${color}`}>
      <i className={`ph ${icon}`}></i>
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-white/40 block mb-1">{label}</span>
    <span className="text-3xl font-black dark:text-white">{value}</span>
  </div>
);

const CreatorTableRow: React.FC<{ id: string, name: string, category: string, price: number }> = ({ id, name, category, price }) => (
  <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
    <td className="px-8 py-6">
      <div className="font-bold dark:text-white">{name}</div>
      <div className="text-[10px] opacity-30 uppercase tracking-tighter">ID: {id.slice(0,8)}</div>
    </td>
    <td className="px-8 py-6">
      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500">
        {category}
      </span>
    </td>
    <td className="px-8 py-6 opacity-60 dark:text-white/60 font-bold">{price} MZN</td>
    <td className="px-8 py-6">
      <Link to={`/editar-curso?id=${id}`} className="text-blue-500 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
        <i className="ph ph-pencil-simple"></i> Editar
      </Link>
    </td>
  </tr>
);

export default CriadorPage;
