
import React from 'react';
import { Link } from 'react-router-dom';

const LivePage: React.FC = () => {
  return (
    <div className="h-screen bg-black text-white flex flex-col animate__animated animate__fadeIn">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-white/5 relative z-20 bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link to="/painel" className="hover:opacity-60 transition">
            <i className="ph ph-arrow-left text-2xl"></i>
          </Link>
          <div>
             <div className="flex items-center gap-3">
               <span className="bg-red-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest animate-pulse">Live</span>
               <h1 className="font-bold text-sm">Workshop: Criando Layouts Adaptáveis</h1>
             </div>
             <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">Iniciou há 45 minutos • 1.2k assistindo</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-white/10 hover:bg-white/20 transition px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest">Gravar Sessão</button>
          <button className="bg-red-600 hover:bg-red-700 transition px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest">Sair</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Feed */}
        <div className="flex-1 p-6 flex flex-col gap-6 relative group overflow-hidden">
           <div className="flex-1 bg-zinc-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
              <iframe 
                src="https://player.vimeo.com/video/824804225?autoplay=1&background=1" 
                className="w-full h-full object-cover"
                frameBorder="0" 
              ></iframe>
              <div className="absolute top-8 right-8 w-64 h-36 bg-zinc-800 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                 <img src="https://i.pravatar.cc/150?u=instructor" className="w-full h-full object-cover opacity-80" alt="Instructor Cam" />
                 <div className="absolute bottom-2 left-4 text-[9px] font-black uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded">Gabriel Valença</div>
              </div>
           </div>

           <div className="h-24 flex items-center justify-center gap-8 bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-white/5 px-10">
              <LiveControl icon="ph-microphone" active />
              <LiveControl icon="ph-video-camera" active />
              <LiveControl icon="ph-monitor" />
              <div className="w-px h-8 bg-white/10"></div>
              <LiveControl icon="ph-hand-waving" />
              <LiveControl icon="ph-smiley" />
           </div>
        </div>

        {/* Chat Sidebar */}
        <aside className="w-96 bg-zinc-900 border-l border-white/5 flex flex-col">
          <div className="p-8 border-b border-white/5">
            <h3 className="font-bold text-xs uppercase tracking-widest opacity-40">Chat em tempo real</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            <ChatMessage user="Ana Silva" text="Onde encontro esse arquivo do Figma?" time="21:42" />
            <ChatMessage user="Bruno Costa" text="A aula está incrível, valeu Gabriel!" time="21:44" />
            <ChatMessage user="Carla Souza" text="Pode repetir a parte das variáveis?" time="21:45" />
            <ChatMessage user="Gabriel Valença" text="Claro Carla, vou mostrar de novo no final do módulo." time="21:46" isInstructor />
          </div>
          <div className="p-6 border-t border-white/5">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Diga algo..." 
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                <i className="ph-fill ph-paper-plane-tilt text-xl"></i>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const LiveControl: React.FC<{ icon: string, active?: boolean }> = ({ icon, active }) => (
  <button className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition hover:scale-110 ${active ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}>
    <i className={`ph ${icon}`}></i>
  </button>
);

const ChatMessage: React.FC<{ user: string, text: string, time: string, isInstructor?: boolean }> = ({ user, text, time, isInstructor }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-black uppercase tracking-widest ${isInstructor ? 'text-blue-500' : 'opacity-40'}`}>{user}</span>
      <span className="text-[9px] opacity-20">{time}</span>
    </div>
    <p className="text-sm opacity-80 leading-relaxed">{text}</p>
  </div>
);

export default LivePage;
