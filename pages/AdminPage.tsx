
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface CreatorProfile {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'pending' | 'rejected' | 'banned';
  avatar_url: string;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const { data: allProfiles } = await supabase.from('profiles').select('status, role');
      const counts = (allProfiles || []).reduce((acc, curr) => {
        acc.total++;
        if (curr.status === 'pending') acc.pending++;
        if (curr.status === 'active') acc.active++;
        return acc;
      }, { total: 0, pending: 0, active: 0 });
      setStats(counts);

      // Fetch profiles that are creators or want to be
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCreators(data || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: CreatorProfile['status']) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      fetchData(); // Refresh list
    } catch (err) {
      alert('Erro ao atualizar status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0a0e14] animate__animated animate__fadeIn">
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2 block">Central de Governança</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter dark:text-white">Admin Console</h1>
          </div>
          <div className="flex gap-4">
             <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-6 rounded-[2rem] flex flex-col items-center min-w-[120px]">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40 mb-1">Total</span>
                <span className="text-2xl font-black dark:text-white">{stats.total}</span>
             </div>
             <div className="bg-blue-600 text-white p-6 rounded-[2rem] flex flex-col items-center min-w-[120px] shadow-2xl shadow-blue-500/20">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Pendentes</span>
                <span className="text-2xl font-black">{stats.pending}</span>
             </div>
          </div>
        </header>

        {/* Action Table */}
        <section className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
             <h2 className="text-xl font-bold dark:text-white">Gestão de Criadores</h2>
             <button onClick={fetchData} className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center hover:rotate-180 transition-transform duration-500">
                <i className="ph ph-arrows-clockwise text-xl dark:text-white"></i>
             </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/5 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white">
                <tr>
                  <th className="px-10 py-6">Criador</th>
                  <th className="px-10 py-6">Nível</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-right">Ações de Controle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center">
                       <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : creators.length > 0 ? (
                  creators.map((c) => (
                    <tr key={c.id} className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <img src={c.avatar_url} className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-800" alt={c.name} />
                          <div>
                             <span className="font-bold block dark:text-white">{c.name}</span>
                             <span className="text-[10px] opacity-40 dark:text-white/40">ID: {c.id.slice(0,8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${c.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {c.role}
                         </span>
                      </td>
                      <td className="px-10 py-8">
                         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                            c.status === 'pending' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-red-500/10 text-red-500'
                         }`}>
                            {c.status}
                         </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {c.status === 'pending' && (
                               <button 
                                onClick={() => updateStatus(c.id, 'active')}
                                className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition"
                               >
                                Aprovar
                               </button>
                            )}
                            {c.status !== 'banned' && (
                               <button 
                                onClick={() => updateStatus(c.id, 'banned')}
                                className="bg-red-500/10 text-red-500 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition"
                               >
                                Banir
                               </button>
                            )}
                            {c.status === 'banned' && (
                               <button 
                                onClick={() => updateStatus(c.id, 'active')}
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition"
                               >
                                Reativar
                               </button>
                            )}
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center opacity-30 italic">
                       Nenhuma solicitação de criador pendente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Platform Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
           <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-black/5 dark:border-white/5">
              <i className="ph ph-chart-line text-3xl text-blue-500 mb-6"></i>
              <h3 className="font-bold dark:text-white mb-2">Crescimento Mensal</h3>
              <p className="text-xs opacity-50">+12% em novos cadastros este mês.</p>
           </div>
           <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-black/5 dark:border-white/5">
              <i className="ph ph-video text-3xl text-emerald-500 mb-6"></i>
              <h3 className="font-bold dark:text-white mb-2">Cursos Ativos</h3>
              <p className="text-xs opacity-50">48 cursos publicados e revisados.</p>
           </div>
           <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-black/5 dark:border-white/5">
              <i className="ph ph-user-circle-plus text-3xl text-purple-500 mb-6"></i>
              <h3 className="font-bold dark:text-white mb-2">Novos Talentos</h3>
              <p className="text-xs opacity-50">8 pedidos de criadores para avaliação.</p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
