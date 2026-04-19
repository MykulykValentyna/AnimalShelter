import React, { useState } from 'react';

// === КОМПОНЕНТ ОКРЕМОГО ПОСТА ===
const PostCard = ({ post, onSupport, onAddComment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Логіка для "Читати далі" (показуємо кнопку тільки якщо текст довгий)
  const isLongText = post.content.length > 150;
  const displayText = isExpanded ? post.content : post.content.slice(0, 150) + (isLongText ? '...' : '');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Шапка поста: Аватар, Ім'я, Час */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-xl shrink-0">
          🌸
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{post.author}</h3>
          <span className="text-xs text-gray-500">{post.date}</span>
        </div>
      </div>

      {/* Тег категорії */}
      <div className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider rounded-full bg-rose-50 text-rose-600 border border-rose-100">
        {post.type}
      </div>

      {/* Заголовок і текст поста */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">
        {displayText}
      </p>

      {/* Кнопка "Читати далі" */}
      {isLongText && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-rose-500 font-bold text-sm hover:text-rose-600 mb-4 transition-colors flex items-center gap-1"
        >
          {isExpanded ? 'Згорнути' : 'Читати далі'}
          <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Нижня панель: Кнопки Підтримати та Коментарі */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onSupport(post.id)}
            className={`flex items-center gap-2 text-sm font-bold transition-colors ${
              post.isSupported ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
            }`}
          >
            <svg className={`w-5 h-5 ${post.isSupported ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Підтримати {post.supports > 0 && <span className="opacity-80">({post.supports})</span>}
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Коментарі {post.comments.length > 0 && <span className="opacity-80">({post.comments.length})</span>}
          </button>
        </div>
      </div>

      {/* Секція Коментарів (відкривається по кліку) */}
      {showComments && (
        <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
          {/* Список коментарів */}
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
            {post.comments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center italic">Поки немає коментарів. Будьте першим!</p>
            ) : (
              post.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs shrink-0">👤</div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{comment.author}</h4>
                    <p className="text-sm text-gray-700 mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Форма додавання коментаря */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Написати коментар..." 
              className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-300 outline-none"
            />
            <button 
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
            >
              Надіслати
            </button>
          </form>
        </div>
      )}
    </div>
  );
};


// === ГОЛОВНА СТОРІНКА СТРІЧКИ ===
const FeedPage = () => {
  const [activeFilter, setActiveFilter] = useState('Всі пости');

  // Початкові дані постів (зберігаємо у стані, щоб можна було їх змінювати)
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Олена В.',
      date: '19 квітня о 23:37',
      type: 'Фінансова допомога',
      title: 'Терміново потрібен корм для притулку',
      content: 'У нашому невеликому притулку закінчуються запаси сухого корму для собак. Будемо вдячні за будь-яку допомогу або репост. Кожна гривня важлива, адже на нашому піклуванні зараз 45 хвостиків, які щодня потребують їжі, ліків та догляду. Допоможіть нам прогодувати їх цього місяця!',
      supports: 12,
      isSupported: false,
      comments: [
        { author: 'Андрій', text: 'Скинув трохи на банку. Тримайтеся!' }
      ]
    },
    {
      id: 2,
      author: 'Ігор К.',
      date: '19 квітня о 22:37',
      type: 'Пропоную допомогу',
      title: 'Готовий стати волонтером на вихідних',
      content: 'Маю вільний час у суботу та неділю. Можу допомогти з вигулом собак або прибиранням території. Маю власне авто, тому можу також допомогти з перевезенням тварин до клініки.',
      supports: 5,
      isSupported: false,
      comments: []
    }
  ]);

  // Функція обробки кліку "Підтримати"
  const handleSupport = (postId) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isSupported: !post.isSupported,
          supports: post.isSupported ? post.supports - 1 : post.supports + 1
        };
      }
      return post;
    }));
  };

  // Функція додавання коментаря
  const handleAddComment = (postId, text) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { author: 'Валентина (Ви)', text }]
        };
      }
      return post;
    }));
  };

  // Фільтрація постів
  const filteredPosts = activeFilter === 'Всі пости' 
    ? posts 
    : posts.filter(post => post.type === activeFilter);

  const filters = ['Всі пости', 'Допомога', 'Шукають дім', 'Фінансова допомога', 'Пропоную допомогу'];

  return (
    // Змінено фон з сірого на світлий (bg-gray-50)
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/80 pt-8 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Заголовок сторінки */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Стрічка допомоги</h1>
          <p className="text-gray-500">Дізнавайтесь про актуальні потреби та пропонуйте допомогу</p>
        </div>

        {/* Навігація фільтрів */}
        <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto custom-scrollbar">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Список постів */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onSupport={handleSupport}
                onAddComment={handleAddComment}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-bold text-gray-800">Постів не знайдено</h3>
              <p className="text-gray-500 mt-2">Спробуйте обрати іншу категорію</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FeedPage;