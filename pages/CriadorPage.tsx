
import React from 'react';
import { Link } from 'react-router-dom';

const CriadorPage: React.FC = () => {
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
        <CreatorStat label="Vendas Totais" value="R$ 14.5k" icon="ph-currency-circle-dollar" color="text-emerald-500" />
        <CreatorStat label="Alunos Ativos" value="2.4k" icon="ph-users" color="text-blue-500" />
        <CreatorStat label="Avaliação" value="4.9" icon="ph-star" color="text-yellow-500" />
        <CreatorStat label="Cursos" value="12" icon="ph-layout" color="text-purple-500" />
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-8 dark:text-white tracking-tight">Meus Cursos</h2>
        <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[3rem] overflow-hidden shadow-xl">
           <table className="w-full text-left">
             <thead className="bg-black/5 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white">
               <tr>
                 <th className="px-8 py-6">Curso</th>
                 <th className="px-8 py-6">Status</th>
                 <th className="px-8 py-6">Vendas</th>
                 <th className="px-8 py-6">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-black/5 dark:divide-white/5">
               <CreatorTableRow name="Arquitetura de UI" status="Publicado" sales="1.240" />
               <CreatorTableRow name="Mastering Framer Motion" status="Publicado" sales="850" />
               <CreatorTableRow name="Design Tokens" status="Rascunho" sales="0" />
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

const CreatorTableRow: React.FC<{ name: string, status: string, sales: string }> = ({ name, status, sales }) => (
  <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
    <td className="px-8 py-6 font-bold dark:text-white">{name}</td>
    <td className="px-8 py-6">
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status === 'Publicado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
        {status}
      </span>
    </td>
    <td className="px-8 py-6 opacity-60 dark:text-white/60 font-medium">{sales}</td>
    <td className="px-8 py-6">
      <Link to="/editar-curso" className="text-blue-500 font-bold text-xs uppercase tracking-widest hover:underline">Editar</Link>
    </td>
  </tr>
);

export default CriadorPage;
