
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface Asset {
  id: string;
  title: string;
  category: string;
  size: string;
  icon: string;
  download_url: string;
}

const BibliotecaPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setAssets(data || []);
    } catch (err) {
      console.error('Erro ao carregar assets:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 pt-16 pb-20 animate__animated animate__fadeIn">
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter dark:text-white mb-4">Assets da Comunidade</h1>
        <p className="text-xl opacity-50 font-medium dark:text-white/60">Recursos profissionais para seu fluxo de trabalho.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 hover:shadow-2xl transition group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <i className={`ph ${asset.icon || 'ph-file'} text-3xl text-blue-500`}></i>
              </div>
              <h3 className="text-lg font-bold dark:text-white mb-1">{asset.title}</h3>
              <span className="text-[10px] uppercase font-black tracking-widest opacity-40 dark:text-white/40 block mb-8">{asset.category} • {asset.size}</span>
              <a 
                href={asset.download_url || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="w-full border border-black/10 dark:border-white/10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition flex items-center justify-center gap-2"
              >
                <i className="ph ph-download-simple"></i> Download
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default BibliotecaPage;
