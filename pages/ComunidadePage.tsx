
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface Post {
  id: string;
  author_name: string;
  title: string;
  tags: string[];
  replies_count: number;
  likes_count: number;
}

const ComunidadePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Erro ao carregar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 pt-16 pb-20 animate__animated animate__fadeIn">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter dark:text-white mb-2">Comunidade</h1>
          <p className="opacity-50 font-medium dark:text-white/60">Troque conhecimento com outros profissionais.</p>
        </div>
        <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition">Novo Post</button>
      </header>

      <div className="space-y-6">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-48 bg-white/5 rounded-[2.5rem] animate-pulse"></div>)
        ) : posts.map(post => (
          <PostItem 
            key={post.id}
            author={post.author_name} 
            title={post.title} 
            tags={post.tags || []} 
            replies={post.replies_count} 
            likes={post.likes_count} 
          />
        ))}
      </div>
    </main>
  );
};

const PostItem: React.FC<{ author: string, title: string, tags: string[], replies: number, likes: number }> = ({ author, title, tags, replies, likes }) => (
  <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 hover:shadow-xl transition group cursor-pointer">
    <div className="flex items-center gap-3 mb-4">
      <img src={`https://ui-avatars.com/api/?name=${author}&background=0071e3&color=fff`} className="w-8 h-8 rounded-full" alt="Avatar" />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white/40">{author}</span>
    </div>
    <h3 className="text-xl font-bold dark:text-white mb-6 group-hover:text-blue-500 transition">{title}</h3>
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest opacity-60 dark:text-white">#{tag}</span>
        ))}
      </div>
      <div className="flex items-center gap-6 opacity-40 dark:text-white/40">
        <div className="flex items-center gap-2 text-xs font-bold"><i className="ph ph-chat-centered-dots"></i><span>{replies}</span></div>
        <div className="flex items-center gap-2 text-xs font-bold"><i className="ph ph-heart"></i><span>{likes}</span></div>
      </div>
    </div>
  </div>
);

export default ComunidadePage;
