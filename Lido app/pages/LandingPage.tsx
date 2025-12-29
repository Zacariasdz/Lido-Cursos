
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="animate__animated animate__fadeIn">
      <header className="max-w-7xl mx-auto pt-24 pb-20 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1] dark:text-white">
          Pense. Crie.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-400">Evolua.</span>
        </h1>
        <p className="text-xl opacity-60 max-w-xl mx-auto mb-12 font-medium dark:text-white">
          A experiência educacional que une a estética da Apple com o conhecimento prático que o mercado exige.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/painel" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-105 transition shadow-2xl shadow-blue-500/30">
            Acessar Painel
          </Link>
          <Link to="/cursos" className="w-full sm:w-auto border-2 border-gray-300 dark:border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition">
            Ver cursos
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Card 1 */}
          <Link to="/detalhes" className="card-perspective">
            <div className="card-inner">
              <div className="card-front bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                <div className="h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" alt="UI" />
                </div>
                <div className="p-8 flex flex-col justify-between h-[calc(100%-12rem)]">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Design System</span>
                    <h3 className="text-2xl font-bold mt-2 leading-tight dark:text-white">Arquitetura de UI Avançada</h3>
                  </div>
                  <div className="flex justify-between items-center opacity-60 border-t border-gray-100 dark:border-white/5 pt-4 dark:text-white">
                    <span className="text-sm font-bold">R$ 597</span>
                    <i className="ph ph-arrow-up-right text-lg"></i>
                  </div>
                </div>
              </div>
              <div className="card-back bg-gradient-to-br from-blue-600 to-blue-900 p-10 flex flex-col justify-center items-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <i className="ph ph-sketch-logo text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Mestrado em Componentes</h3>
                <p className="text-sm text-center opacity-80 mb-8 leading-relaxed">Crie bibliotecas escaláveis e documentações impecáveis que aceleram o desenvolvimento.</p>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-sm shadow-xl">Ver Módulos</button>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link to="/detalhes" className="card-perspective">
            <div className="card-inner">
              <div className="card-front bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                <div className="h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800" className="w-full h-full object-cover" alt="Motion" />
                </div>
                <div className="p-8 flex flex-col justify-between h-[calc(100%-12rem)]">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Motion Design</span>
                    <h3 className="text-2xl font-bold mt-2 leading-tight dark:text-white">Motion Design for Apps</h3>
                  </div>
                  <div className="flex justify-between items-center opacity-60 border-t border-gray-100 dark:border-white/5 pt-4 dark:text-white">
                    <span className="text-sm font-bold">R$ 497</span>
                    <i className="ph ph-arrow-up-right text-lg"></i>
                  </div>
                </div>
              </div>
              <div className="card-back bg-gradient-to-br from-indigo-500 to-indigo-900 p-10 flex flex-col justify-center items-center text-white">
                <i className="ph ph-lightning text-5xl mb-6"></i>
                <h3 className="text-xl font-bold mb-4">Interações Fluídas</h3>
                <p className="text-sm text-center opacity-80 mb-8 leading-relaxed">Domine Framer Motion e GSAP para criar experiências digitais que respiram.</p>
                <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold text-sm shadow-xl">Quero Aprender</button>
              </div>
            </div>
          </Link>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
