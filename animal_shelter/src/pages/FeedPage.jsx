import React, { useState, useEffect } from 'react';
import PostCard from '../components/posts/PostCard'; 
// import postService from '../services/postService'; // Тимчасово закоментовано

// === ФЕЙКОВІ ДАНІ ДЛЯ СТРІЧКИ ДОПОМОГИ (Mock Data) ===
const fakeFeedPosts = [
  {
    id: 'feed_1',
    type: 'need_financial',
    title: 'Терміновий збір на лікування Біма 🏥',
    description: 'Бім потрапив під машину і отримав складний перелом задньої лапки. Потребує термінової операції зі встановлення пластини. Будемо дуже вдячні за будь-яку фінансову допомогу! Кожна гривня має значення.',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    authorName: 'Волонтер Ольга',
    authorAvatar: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 години тому
    likesCount: 142,
    commentsCount: 15,
  },
  {
    id: 'feed_2',
    type: 'need_physical',
    title: 'Шукаємо волонтерів для вигулу собак 🐕',
    description: 'Наш притулок переповнений, і працівники фізично не встигають вигуляти всіх хвостиків. Запрошуємо небайдужих людей приїхати на вихідних! Собачки дуже сумують за людською увагою і хочуть побігати на травичці.',
    image: 'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    authorName: 'Притулок "Щасливий хвіст"',
    authorAvatar: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Вчора
    likesCount: 89,
    commentsCount: 22,
  },
  {
    id: 'feed_3',
    type: 'offer_financial',
    title: 'Можу оплатити корм для міні-притулку 🍲',
    description: 'Маю можливість щомісяця купувати та відправляти мішок якісного корму (20кг) для невеликого сімейного притулку або волонтера, який опікується багатьма тваринами. Пишіть у приватні повідомлення, розповідайте про своїх підопічних.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    authorName: 'Михайло',
    authorAvatar: null,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // Позавчора
    likesCount: 215,
    commentsCount: 43,
  },
  {
    id: 'feed_4',
    type: 'offer_physical',
    title: 'Надаю послуги автоволонтера у вихідні 🚗',
    description: 'Маю містке авто (універсал). Можу безкоштовно допомогти з перевезенням тварин у клініку, транспортуванням корму або будівельних матеріалів для притулків по місту та області. Звертайтеся заздалегідь!',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    authorName: 'Андрій (Автоволонтер)',
    authorAvatar: null,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 годин тому
    likesCount: 178,
    commentsCount: 11,
  },
  {
    id: 'feed_5',
    type: 'need_physical',
    title: 'Потрібні старі ковдри та рушники! 🥶',
    description: 'Наближаються холоди, і нам терміново потрібні теплі речі для утеплення вольєрів. Підійдуть будь-які старі пледи, ковдри, рушники, постільна білизна. Головне — щоб вони були чисті.',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    authorName: 'Міський центр захисту',
    authorAvatar: null,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 дні тому
    likesCount: 56,
    commentsCount: 4,
  }
];

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Завантаження постів з бекенду (або фейкових даних)
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // --- ДЛЯ ГОТОВОГО БЕКЕНДУ РОЗКОМЕНТУЙ ЦЕ: ---
        // const data = await postService.getPosts('approved');
        // const postsArray = Array.isArray(data) ? data : (data.posts || []);
        // const helpPosts = postsArray.filter(post => post.type !== 'looking_for_home');
        // setPosts(helpPosts);
        
        // --- ЗАГЛУШКА (Фейкові дані) ---
        // Імітуємо затримку сервера в 1 секунду
        setTimeout(() => {
          setPosts(fakeFeedPosts);
          setIsLoading(false);
        }, 1000);

      } catch (error) {
        console.error('Помилка завантаження стрічки:', error);
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const filters = [
    { id: 'all', label: 'Всі пости' },
    { id: 'need_financial', label: 'Потрібна фін. допомога' },
    { id: 'need_physical', label: 'Потрібна фіз. допомога' },
    { id: 'offer_financial', label: 'Надаю фін. допомогу' },
    { id: 'offer_physical', label: 'Надаю фіз. допомогу' }
  ];

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    return post.type === activeFilter;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    if (sortBy === 'newest') return dateB - dateA;
    if (sortBy === 'oldest') return dateA - dateB;
    if (sortBy === 'popular') {
      const popularityA = (a.likesCount || 0) + (a.commentsCount || 0);
      const popularityB = (b.likesCount || 0) + (b.commentsCount || 0);
      return popularityB - popularityA;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-24 px-4 relative overflow-hidden text-slate-900">
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Стрічка допомоги</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">Дізнавайтесь про актуальні потреби притулків та пропонуйте свою підтримку тим, хто цього потребує найбільше.</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12 bg-white p-4 rounded-3xl shadow-md border border-slate-200">
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex-shrink-0 border ${
                  activeFilter === filter.id 
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white border-transparent shadow-lg shadow-rose-200/50' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-auto flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full lg:w-56 appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer transition-colors shadow-sm"
            >
              <option value="newest">Нові спочатку</option>
              <option value="oldest">Старі спочатку</option>
              <option value="popular">Найпопулярніші</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {sortedPosts.length > 0 ? (
              sortedPosts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="col-span-full text-center py-32 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
                <span className="text-6xl mb-6 block opacity-50">📭</span>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Постів не знайдено</h3>
                <p className="text-slate-500">Зараз немає публікацій за цим фільтром.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;