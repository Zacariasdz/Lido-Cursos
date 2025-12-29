
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Certificate {
  id: string;
  title: string;
  date: string;
  isGenerated: boolean;
}

const ConquistasPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([
    { id: 'c1', title: "UI Architecture", date: "Jan 2024", isGenerated: true },
    { id: 'c2', title: "Motion Design Fundamentals", date: "Dez 2023", isGenerated: true },
  ]);

  const [pendingCerts, setPendingCerts] = useState([
    { id: 'p1', title: "Clean Code & Refactoring", completionDate: "Há 2 dias" },
    { id: 'p2', title: "Next.js 14 Deep Dive", completionDate: "Hoje" },
  ]);

  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleGenerate = (id: string, title: string) => {
    setGeneratingId(id);
    
    // Simulate generation process (signing, PDF generation, cloud upload)
    setTimeout(() => {
      const newCert: Certificate = {
        id: `c-${Date.now()}`,
        title: title,
        date: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        isGenerated: true
      };
      
      setCertificates(prev => [newCert, ...prev]);
      setPendingCerts(prev => prev.filter(p => p.id !== id));
      setGeneratingId(null);
    }, 3000);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 pt-16 pb-20 animate__animated animate__fadeIn">
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter dark:text-white mb-4">Suas Conquistas</h1>
        <p className="text-xl opacity-50 font-medium dark:text-white/60">Celebre cada passo da sua evolução profissional.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Badges & Progress */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Badges Section */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40 border-b border-black/5 dark:border-white/5 pb-2 mb-8">Badges Desbloqueados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
               <BadgeItem name="Pioneiro" icon="ph-rocket-launch" color="bg-blue-500" active />
               <BadgeItem name="Noite Adentro" icon="ph-moon" color="bg-indigo-500" active />
               <BadgeItem name="Pixel Perfect" icon="ph-selection-plus" color="bg-emerald-500" active />
               <BadgeItem name="Curador" icon="ph-books" color="bg-zinc-300" />
               <BadgeItem name="Mestre Motion" icon="ph-lightning" color="bg-zinc-300" />
               <BadgeItem name="Social" icon="ph-users-three" color="bg-zinc-300" />
            </div>
          </section>

          {/* Pending Certificates Section */}
          {pendingCerts.length > 0 && (
            <section className="animate__animated animate__fadeInUp">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-500 border-b border-blue-500/10 pb-2 mb-8">Prontos para Gerar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingCerts.map(course => (
                  <div key={course.id} className="bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-blue-500 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">100% Concluído</span>
                        <i className="ph ph-certificate text-2xl text-blue-500 opacity-40"></i>
                      </div>
                      <h3 className="text-xl font-bold dark:text-white mb-2">{course.title}</h3>
                      <p className="text-xs opacity-40 mb-8">Concluído em: {course.completionDate}</p>
                      
                      <button 
                        onClick={() => handleGenerate(course.id, course.title)}
                        disabled={generatingId !== null}
                        className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                          generatingId === course.id 
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20'
                        }`}
                      >
                        {generatingId === course.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                            Processando...
                          </>
                        ) : (
                          <>
                            <i className="ph-fill ph-magic-wand"></i>
                            Gerar Certificado
                          </>
                        )}
                      </button>
                    </div>
                    {/* Simulated scanning effect during generation */}
                    {generatingId === course.id && (
                      <div className="absolute inset-0 bg-blue-500/5 animate-pulse">
                        <div className="h-full w-2 bg-blue-500/20 absolute left-0 top-0 animate-[moveGlow_2s_infinite]"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Issued Certificates */}
        <div className="lg:col-span-4 space-y-12">
          <section className="sticky top-24">
             <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40 border-b border-black/5 dark:border-white/5 pb-2 mb-8">Certificados Emitidos</h2>
             <div className="space-y-6">
                {certificates.map(cert => (
                  <CertificateCard key={cert.id} title={cert.title} date={cert.date} />
                ))}
                
                {certificates.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[2.5rem]">
                    <i className="ph ph-seal text-4xl opacity-10 mb-4 block mx-auto"></i>
                    <p className="text-sm opacity-30 font-medium px-10">Você ainda não possui certificados emitidos.</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      </div>

      {/* Generation Overlay / Toast Simulation */}
      {generatingId && (
        <div className="fixed bottom-10 right-10 bg-black text-white px-8 py-5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 z-[3000] animate__animated animate__fadeInRight">
           <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
           <div className="text-left">
              <p className="text-xs font-bold">Assinando Documento Digital</p>
              <p className="text-[10px] opacity-50 uppercase tracking-widest">Aguarde a validação na blockchain...</p>
           </div>
        </div>
      )}
    </main>
  );
};

const BadgeItem: React.FC<{ name: string, icon: string, color: string, active?: boolean }> = ({ name, icon, color, active }) => (
  <div className={`flex flex-col items-center gap-4 transition-all ${active ? 'opacity-100 scale-100' : 'opacity-20 scale-90 grayscale'}`}>
    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl text-white shadow-xl ${active ? color : 'bg-gray-200 dark:bg-white/10'}`}>
      <i className={`ph-fill ${icon}`}></i>
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{name}</span>
  </div>
);

const CertificateCard: React.FC<{ title: string, date: string }> = ({ title, date }) => (
  <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl transition animate__animated animate__fadeIn">
     <i className="ph ph-seal-check absolute -top-4 -right-4 text-7xl opacity-5 dark:text-white group-hover:scale-110 transition"></i>
     <h3 className="font-bold dark:text-white text-lg leading-tight mb-2">{title}</h3>
     <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 dark:text-white/40 block mb-6">{date}</span>
     <button className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
       Visualizar PDF
       <i className="ph ph-arrow-right"></i>
     </button>
  </div>
);

export default ConquistasPage;
