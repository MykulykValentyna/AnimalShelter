import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  // Дістаємо всі необхідні дані з об'єкта post, який приходить з бекенду
  const { 
    id, 
    title, 
    content, 
    type, 
    authorName, 
    authorId, 
    image, 
    likesCount, 
    commentsCount, 
    createdAt 
  } = post;

  // Форматування дати у зручний український формат
  const formattedDate = new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(createdAt || Date.now()));

  // Функція для визначення тексту та кольору бейджа залежно від типу поста
  const getTypeStyle = (postType) => {
    switch (postType) {
      case 'need_financial': return { text: 'Терміновий збір', style: 'bg-rose-500 text-white' };
      case 'need_physical': return { text: 'Потрібні руки', style: 'bg-orange-500 text-white' };
      case 'offer_financial': return { text: 'Пропоную кошти', style: 'bg-emerald-500 text-white' };
      case 'offer_physical': return { text: 'Пропоную допомогу', style: 'bg-teal-500 text-white' };
      case 'looking_for_home': return { text: 'Шукає дім', style: 'bg-purple-500 text-white' }; // Новий тип для тваринок!
      default: return { text: 'Допомога', style: 'bg-slate-500 text-white' };
    }
  };

  const badge = getTypeStyle(type);

  return (
    <div className="group bg-white rounded-[2rem] border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      
      {/* --- БЛОК З ФОТОГРАФІЄЮ --- */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img 
          src={image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800'} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        {/* Затемнення знизу для гарного контрасту */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none"></div>
        
        {/* Бейдж статусу */}
        <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${badge.style}`}>
          {badge.text}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col relative bg-white">
        
        {/* --- АВАТАРКА АВТОРА --- */}
        <div className="absolute -top-10 left-6 z-20">
          <Link 
            to={`/profile/${authorId}`}
            className="block w-16 h-16 rounded-full bg-white p-1 shadow-lg hover:scale-110 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-200 to-purple-200 flex items-center justify-center text-xl font-black text-slate-800">
              {authorName?.charAt(0) || '👤'}
            </div>
          </Link>
        </div>

        {/* --- ІНФОРМАЦІЯ ПРО АВТОРА --- */}
        <div className="ml-20 mb-4 h-10 flex flex-col justify-end relative z-10">
          <Link 
            to={`/profile/${authorId}`}
            className="font-bold text-slate-900 leading-none mb-1 hover:text-rose-500 transition-colors inline-block w-max"
          >
            {authorName || 'Користувач'}
          </Link>
          <span className="text-xs text-slate-500 font-medium">{formattedDate}</span>
        </div>
        
        {/* --- КОНТЕНТ ПОСТА --- */}
        <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1 font-medium leading-relaxed whitespace-pre-wrap">
          {content}
        </p>

        {/* --- СТАТИСТИКА ТА КНОПКИ --- */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-4 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-bold">
              <span className="text-lg">❤️</span> {likesCount || 0}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-bold">
              <span className="text-lg">💬</span> {commentsCount || 0}
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Link 
              to={`/messages/${authorId}`}
              className="flex-1 py-3 px-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-rose-100"
            >
              ✉️ Написати
            </Link>
            <Link 
              to={`/posts/${id}`}
              className="flex-1 py-3 px-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shadow-md flex items-center justify-center"
            >
              Читати далі
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PostCard;