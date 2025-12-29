
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

interface Certificate {
  id: string;
  course_title: string;
  issue_date: string;
}

const ConquistasPage: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user?.id)
        .order('issue_date', { ascending: false });
      
      if (error) throw error;
      setCertificates(data || []);
    } catch (err) {
      console.error('Erro ao carregar certificados:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 pt-16 pb-20 animate__animated animate__fadeIn">
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter dark:text-white mb-4">Sua Evolução</h1>
        <p className="text-xl opacity-50 font-medium dark:text-white/60">Celebre cada passo da sua jornada profissional.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40 border-b border-black/5 dark:border-white/5 pb-2 mb-8">Badges Desbloqueados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
               <BadgeItem name="Pioneiro" icon="ph-rocket-launch" color="bg-blue-500" active />
               <BadgeItem name="Noite Adentro" icon="ph-moon" color="bg-indigo-500" active />
               <BadgeItem name="Pixel Perfect" icon="ph-selection-plus" color="bg-emerald-500" active />
               <BadgeItem name="Mestre" icon="ph-lightning" color="bg-zinc-300" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <section>
             <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40 border-b border-black/5 dark:border-white/5 pb-2 mb-8">Certificados Emitidos</h2>
             <div className="space-y-6">
                {loading ? (
                   <div className="h-32 bg-white/5 rounded-[2.5rem] animate-pulse"></div>
                ) : certificates.length > 0 ? (
                  certificates.map(cert => (
                    <CertificateCard key={cert.id} title={cert.course_title} date={new Date(cert.issue_date).toLocaleDateString('pt-BR')} />
                  ))
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[2.5rem]">
                    <i className="ph ph-seal text-4xl opacity-10 mb-4 block mx-auto"></i>
                    <p className="text-sm opacity-30 font-medium px-10">Nenhum certificado emitido.</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      </div>
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
  <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl transition">
     <h3 className="font-bold dark:text-white text-lg leading-tight mb-2">{title}</h3>
     <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 dark:text-white/40 block mb-6">{date}</span>
     <button className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">Visualizar PDF <i className="ph ph-arrow-right"></i></button>
  </div>
);

export default ConquistasPage;
