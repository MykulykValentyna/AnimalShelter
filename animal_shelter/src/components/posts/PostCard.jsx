import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const { id, title, content, type, status, createdAt, authorName } = post;

  const formattedDate = new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(createdAt || Date.now()));

  const getTypeLabel = (postType) => {
    switch (postType) {
      case 'financial_help_animal': return 'Фінансова допомога';
      case 'looking_for_home': return 'Шукає дім';
      case 'offer_help': return 'Пропоную допомогу';
      default: return 'Допомога';
    }
  };

  const getTypeStyles = (postType) => {
    switch (postType) {
      case 'financial_help_animal': 
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'looking_for_home': 
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'offer_help': 
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: 
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="group bg-white rounded-3xl p-6 border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {status === 'pending_admin_approval' && (
        <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
          На модерації
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-200 to-purple-200 flex items-center justify-center shadow-sm">
          <span className="text-xl">🌸</span>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{authorName || 'Небайдужий користувач'}</h4>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
      </div>

      <div className="mb-4">
        <span className={`inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider rounded-xl border ${getTypeStyles(type)}`}>
          {getTypeLabel(type)}
        </span>
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {content}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-rose-50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-gray-500">
          <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-medium">Підтримати</span>
          </button>
          <div className="flex items-center gap-1.5 hover:text-purple-500 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">Коментарі</span>
          </div>
        </div>

        <Link 
          to={`/posts/${id}`}
          className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-80 transition-opacity flex items-center gap-1"
        >
          Читати далі
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;