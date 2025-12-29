
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

interface CourseData {
  id: string;
  title: string;
  category: string;
  price: string;
  img: string;
  backGradient: string;
  backIcon: string;
}

const CursosPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', 'Design System', 'Motion Design', 'Frontend', 'Desenvolvimento'];

  const courses: CourseData[] = [
    {
      id: "1",
      title: "Arquitetura de UI Avançada",
      category: "Design System",
      price: "597",
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      backGradient: "from-blue-600 to-blue-800",
      backIcon: "ph-sketch-logo",
    },
    {
      id: "2",
      title: "Motion Design for Apps",
      category: "Motion Design",
      price: "497",
      img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      backGradient: "from-indigo-500 to-indigo-800",
      backIcon: "ph-lightning",
    },
    {
      id: "3",
      title: "Next.js & Clean Code",
      category: "Desenvolvimento",
      price: "697",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      backGradient: "from-emerald-500 to-emerald-800",
      backIcon: "ph-code",
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-7xl mx-auto px-6 pt-16 pb-20 animate__animated animate__fadeIn">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 dark:text-white">Catálogo de Cursos</h1>
          <p className="text-xl opacity-50 font-medium dark:text-white/70">Aprenda as habilidades que definem o futuro.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96 group">
          <i className="ph ph-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-40 dark:text-white/40 group-focus-within:text-blue-500 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Buscar por curso ou categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 rounded-[2rem] pl-14 pr-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm dark:text-white"
          />
        </div>
      </header>

      {/* Category Filter */}
      <div className="flex gap-3 mb-16 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-8 py-3 rounded-full font-bold text-sm transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map(course => (
            <CourseCard 
              key={course.id}
              {...course}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center animate__animated animate__fadeIn">
          <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ph ph-mask-sad text-4xl opacity-40"></i>
          </div>
          <h3 className="text-xl font-bold dark:text-white">Nenhum curso encontrado</h3>
          <p className="opacity-50 mt-2">Tente ajustar sua busca ou categoria.</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveCategory('Todos'); }}
            className="mt-6 text-blue-500 font-bold uppercase text-xs tracking-widest hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </main>
  );
};

const CourseCard: React.FC<CourseData> = ({ id, title, category, price, img, backGradient, backIcon }) => {
  const [currentImg, setCurrentImg] = useState(img);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group">
      <Link to={`/detalhes`} className="card-perspective block">
        <div className="card-inner">
          <div className="card-front bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm">
            <div className="h-48 overflow-hidden relative">
              <img src={currentImg} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={title} />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <i className="ph ph-eye text-white text-3xl"></i>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-between h-[calc(100%-12rem)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{category}</span>
                <h3 className="text-2xl font-bold mt-2 leading-tight dark:text-white">{title}</h3>
              </div>
              <div className="flex justify-between items-center opacity-60 border-t border-gray-100 dark:border-white/5 pt-4 dark:text-white">
                <span className="text-sm font-bold">R$ {price}</span>
                <i className="ph ph-arrow-up-right text-lg"></i>
              </div>
            </div>
          </div>
          <div className={`card-back bg-gradient-to-br ${backGradient} p-10 flex flex-col justify-center items-center text-white shadow-2xl`}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <i className={`ph ${backIcon} text-3xl`}></i>
            </div>
            <h3 className="text-xl font-bold mb-4">Ementa Completa</h3>
            <p className="text-sm text-center opacity-80 mb-8 leading-relaxed">Descubra técnicas exclusivas e fluxos profissionais.</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-sm shadow-xl">Ver Detalhes</button>
          </div>
        </div>
      </Link>

      {/* Floating Edit Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(!isEditing);
          }}
          className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition shadow-xl"
        >
          <i className={`ph ${isEditing ? 'ph-x' : 'ph-pencil-simple'} text-xl`}></i>
        </button>
      </div>

      {isEditing && (
        <div className="absolute inset-x-0 bottom-full mb-4 z-50 animate__animated animate__fadeInUp animate__faster">
          <div className="bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-[2rem] p-6 shadow-2xl backdrop-blur-xl">
            <h4 className="text-xs font-black uppercase tracking-widest mb-4 dark:text-white">Editar Capa do Curso</h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase opacity-40 dark:text-white/40 ml-1">URL da Imagem</label>
                <input 
                  type="text" 
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={currentImg.startsWith('data:') ? '' : currentImg}
                  onChange={(e) => setCurrentImg(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white"
                />
              </div>
              <div className="relative">
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition"
                   >
                     Upload de Arquivo
                   </button>
                   <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                   />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CursosPage;
