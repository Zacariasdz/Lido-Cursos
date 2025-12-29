
import React from 'react';

const TalentosPage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-16 pb-20 animate__animated animate__fadeIn">
      <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden mb-16 shadow-2xl">
         <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
            <i className="ph ph-briefcase absolute top-10 right-10 text-[20rem] rotate-12"></i>
         </div>
         <div className="relative z-10 max-w-2xl">
            <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 inline-block">Exclusivo Alunos Pro</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">O mercado busca por <br /><span className="text-blue-500">você.</span></h1>
            <p className="text-xl opacity-60 leading-relaxed mb-12">Conectamos os melhores alunos da Lido com empresas que valorizam o design de alto nível.</p>
            <button className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-xl">Acessar Vagas</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <JobCard company="Nubank" position="Product Designer Senior" location="Híbrido / SP" type="Full-time" />
        <JobCard company="Stripe" position="UI Engineer" location="Remoto" type="Contract" />
        <JobCard company="Apple" position="Motion Designer" location="Cupertino, CA" type="Full-time" />
      </div>
    </main>
  );
};

const JobCard: React.FC<{ company: string, position: string, location: string, type: string }> = ({ company, position, location, type }) => (
  <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 hover:shadow-2xl transition group">
     <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition">
        <i className="ph ph-buildings"></i>
     </div>
     <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">{company}</h3>
     <h4 className="text-2xl font-bold dark:text-white mb-6 leading-tight">{position}</h4>
     <div className="flex flex-col gap-2 opacity-40 dark:text-white/40 font-bold text-xs uppercase tracking-widest border-t border-black/5 dark:border-white/5 pt-6">
        <div className="flex items-center gap-2"><i className="ph ph-map-pin"></i> {location}</div>
        <div className="flex items-center gap-2"><i className="ph ph-clock"></i> {type}</div>
     </div>
  </div>
);

export default TalentosPage;
