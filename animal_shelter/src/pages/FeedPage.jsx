import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Завантажуємо тільки ОПУБЛІКОВАНІ пости
  useEffect(() => {
    window.scrollTo(0, 0);
    const allPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    const publishedPosts = allPosts
      .filter(post => post.status === 'published')
      .sort((a, b) => b.id - a.id);
    setPosts(publishedPosts);
  }, []);

  const roleLabels = { 
    user: 'Користувач', 
    volunteer: 'Волонтер', 
    shelter: 'Організація', 
    vet: 'Ветклініка' 
  };

  const filters = [
    { id: 'all', label: 'Всі пости' },
    { id: 'adoption', label: 'Шукають дім' },
    { id: 'help_fin', label: 'Потрібна фін. допомога' },
    { id: 'help_phys', label: 'Потрібна фіз. допомога' },
    { id: 'offer_fin', label: 'Пропоную фін. допомогу' },
    { id: 'offer_phys', label: 'Пропоную фіз. допомогу' }
  ];

  // Логіка фільтрації
  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'adoption') return post.category === 'adoption';
    if (activeFilter === 'help_fin') return post.category === 'help' && post.helpType === 'financial';
    if (activeFilter === 'help_phys') return post.category === 'help' && post.helpType === 'physical';
    if (activeFilter === 'offer_fin') return post.category === 'offer_help' && post.helpType === 'financial';
    if (activeFilter === 'offer_phys') return post.category === 'offer_help' && post.helpType === 'physical';
    return true;
  });

  // Отримання стилю та тексту бейджа
  const getBadgeInfo = (post) => {
    if (post.category === 'adoption') return { text: 'ШУКАЄ ДІМ', color: 'bg-purple-100 text-purple-600 border-purple-200' };
    if (post.category === 'help') {
      return post.helpType === 'financial' 
        ? { text: 'ПОТРІБНА ФІН. ДОПОМОГА', color: 'bg-rose-100 text-rose-600 border-rose-200' }
        : { text: 'ПОТРІБНА ФІЗ. ДОПОМОГА', color: 'bg-orange-100 text-orange-600 border-orange-200' };
    }
    if (post.category === 'offer_help') {
      return post.helpType === 'financial'
        ? { text: 'ПРОПОНУЄ ФІН. ДОПОМОГУ', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' }
        : { text: 'ПРОПОНУЄ ФІЗ. ДОПОМОГУ', color: 'bg-teal-100 text-teal-600 border-teal-200' };
    }
    return { text: 'ІНШЕ', color: 'bg-gray-100 text-gray-600 border-gray-200' };
  };

  const handleContactClick = () => {
    if (!currentUser) {
      alert('Будь ласка, авторизуйтесь, щоб написати автору.');
    } else {
      navigate(ROUTES.MESSAGES);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 pt-10 pb-24 px-4 relative overflow-hidden">
      {/* Декор */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Заголовок */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Стрічка допомоги</h1>
          <p className="text-gray-500 text-lg">Дізнавайтесь про актуальні потреби та пропонуйте свою підтримку</p>
        </div>

        {/* Фільтри */}
        <div className="flex gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 mb-10 overflow-x-auto custom-scrollbar">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeFilter === filter.id 
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Список постів */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => {
              const badge = getBadgeInfo(post);
              const isOrgPost = post.category === 'help' && post.targetType === 'organization';
              const isOfferPost = post.category === 'offer_help';
              
              // Формуємо рядок з деталями
              const detailsArray = isOfferPost 
                ? [post.providerName, post.region].filter(Boolean)
                : isOrgPost 
                  ? [post.orgName, post.orgType, post.orgCity].filter(Boolean)
                  : [post.animalName, post.breed, post.age].filter(Boolean);
                  
              const detailsString = detailsArray.length > 0 ? detailsArray.join(' • ') : '';

              return (
                <div key={post.id} className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-all animate-slide-up">
                  
                  {/* Шапка поста (Автор + Дата + Бейдж) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center overflow-hidden border border-rose-100 shrink-0">
                        {post.authorAvatar ? (
                          <img src={post.authorAvatar} alt="Author" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-black text-rose-500">{post.authorName?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-gray-900 leading-tight">{post.authorName}</p>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider hidden sm:block">
                            {roleLabels[post.authorRole] || 'Користувач'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">{post.date}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest border self-start sm:self-auto ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>

                  {/* Контент поста */}
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Зображення */}
                    {post.image && (
                      <div className="w-full md:w-64 h-48 md:h-56 rounded-2xl overflow-hidden shrink-0 shadow-inner group">
                        <img src={post.image} alt="Ілюстрація" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    )}

                    {/* Текст */}
                    <div className="flex-1 flex flex-col">
                      <h2 className="text-2xl font-black text-gray-900 mb-2">{post.title}</h2>
                      
                      {detailsString && (
                        <p className="text-sm font-bold text-gray-500 mb-4 bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">
                          {detailsString}
                        </p>
                      )}
                      
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap flex-1">
                        {post.description}
                      </p>

                      {/* Реквізити (якщо є) */}
                      {post.requisites && (
                        <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Реквізити для допомоги:</p>
                          <p className="text-sm font-medium text-emerald-900 break-all">{post.requisites}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Футер поста (Контакти) */}
                  <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                      <span>📞</span> {post.keeperPhone}
                    </div>
                    <button 
                      onClick={handleContactClick}
                      className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
                    >
                      Написати автору
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-fade-in">
              <span className="text-6xl mb-6 block opacity-50">📭</span>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Постів не знайдено</h3>
              <p className="text-gray-500">За вибраними критеріями поки немає публікацій.</p>
              <button onClick={() => setActiveFilter('all')} className="mt-6 px-6 py-2 bg-rose-50 text-rose-500 font-bold rounded-full hover:bg-rose-100 transition-colors">
                Показати всі пости
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FeedPage;