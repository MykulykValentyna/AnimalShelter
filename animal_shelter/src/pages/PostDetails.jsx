import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import postService from '../services/postService'; // Тимчасово закоментовано

// === ФЕЙКОВІ ДАНІ (Mock Data) ===
const fakeDetailedPosts = {
  'feed_1': {
    id: 'feed_1',
    type: 'need_financial',
    category: 'help',
    title: 'Терміновий збір на лікування Біма 🏥',
    description: 'Бім потрапив під машину і отримав складний перелом задньої лапки. Потребує термінової операції зі встановлення пластини. Будемо дуже вдячні за будь-яку фінансову допомогу! Кожна гривня має значення.\n\nОперація призначена на четвер, клініка "ВетМед". Усі чеки та звіти будуть опубліковані в коментарях або надіслані особисто кожному благодійнику. Бім дуже хоче знову бігати на чотирьох лапках!',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    authorName: 'Волонтер Ольга',
    authorLogin: 'volonter_olga',
    authorAvatar: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    likesCount: 142,
    animalName: 'Бім',
    animalType: 'Пес / Собака',
    breed: 'Безпородний',
    age: '3 роки',
    gender: 'Хлопчик',
    health: 'Перелом задньої лапи, потрібна операція',
    keeperPhone: '+380 99 123 45 67',
    requisites: 'https://send.monobank.ua/jar/1234567890',
    orgCity: 'Київ'
  },
  'anim_1': {
    id: 'anim_1',
    type: 'looking_for_home',
    category: 'adoption',
    title: 'Шукаємо родину для ніжної Мії 🐱',
    description: 'Мія — дуже ласкава і грайлива киця. Врятована з вулиці під час дощу, зараз повністю здорова, оброблена від паразитів та ідеально знає лоток. Обожнює муркотіти на колінах і гратися з м\'ячиком.\n\nВіддається безкоштовно, але тільки відповідальним людям у квартиру з сітками на вікнах. З обов\'язковою умовою ненав\'язливого відстеження долі (фото/відео привіти).',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    authorName: 'Олена (Волонтер)',
    authorLogin: 'olena_cat_rescue',
    authorAvatar: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likesCount: 24,
    animalName: 'Мія',
    animalType: 'Кіт / Кішка',
    breed: 'Мітис',
    age: '7 місяців',
    gender: 'Дівчинка',
    color: 'Триколірна',
    health: 'Здорова, вакцинована',
    documents: 'Ветеринарний паспорт',
    keeperPhone: '+380 67 987 65 43',
    orgCity: 'Львів'
  }
};

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Стан для модалки оплати
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState('one-time'); // 'one-time' або 'subscription'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Дані форми оплати
  const [paymentForm, setPaymentForm] = useState({
    amount: '100',
    customAmount: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPostDetails = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          const foundPost = fakeDetailedPosts[id] || fakeDetailedPosts['feed_1'];
          setPost(foundPost);
          setIsLoading(false);
        }, 600);
      } catch (error) {
        console.error('Помилка завантаження поста:', error);
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  // Заборона прокрутки фону при відкритій модалці
  useEffect(() => {
    if (isPaymentModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isPaymentModalOpen]);

  const handleCopyRequisites = () => {
    if (post?.requisites) {
      navigator.clipboard.writeText(post.requisites);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openPaymentModal = (type) => {
    setPaymentType(type);
    setIsPaymentModalOpen(true);
    setPaymentSuccess(false);
    setPaymentForm({
      amount: '100', customAmount: '', cardNumber: '', expiry: '', cvv: '', cardholderName: ''
    });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Імітація обробки платежу банком (2 секунди)
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Автоматичне закриття після успіху
      setTimeout(() => {
        setIsPaymentModalOpen(false);
      }, 3000);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
        <span className="text-6xl mb-4">📭</span>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Пост не знайдено</h2>
        <p className="text-slate-500 mb-6">Можливо, він був видалений або посилання недійсне.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
          Повернутися назад
        </button>
      </div>
    );
  }

  const isFinancial = post.type === 'need_financial' || post.type === 'offer_financial';
  const badgeColors = {
    'looking_for_home': 'bg-purple-100 text-purple-700 border-purple-200',
    'need_financial': 'bg-rose-100 text-rose-700 border-rose-200',
    'need_physical': 'bg-orange-100 text-orange-700 border-orange-200',
    'offer_financial': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'offer_physical': 'bg-blue-100 text-blue-700 border-blue-200',
  };
  
  const badgeLabels = {
    'looking_for_home': 'Шукає дім',
    'need_financial': 'Потрібна фін. допомога',
    'need_physical': 'Потрібна фіз. допомога',
    'offer_financial': 'Пропоную фін. допомогу',
    'offer_physical': 'Пропоную фіз. допомогу',
  };

  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 outline-none text-sm text-slate-900 transition-all font-medium";

  return (
    <div className="min-h-screen bg-slate-50 pt-4 pb-12 px-4 relative overflow-hidden text-slate-900">
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-rose-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-40 left-[-10rem] w-[30rem] h-[30rem] bg-purple-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors mb-4 group text-sm"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Повернутися
        </button>

        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {post.image && (
            <div className="w-full h-48 md:h-72 relative">
              <img src={post.image} alt="Ілюстрація" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full border shadow-sm backdrop-blur-md ${badgeColors[post.type] || 'bg-slate-100 text-slate-700'}`}>
                  {badgeLabels[post.type] || 'Публікація'}
                </span>
              </div>
            </div>
          )}

          <div className="p-5 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-5">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight flex-1">
                {post.title}
              </h1>
              <div className="text-xs font-bold text-slate-400 shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                {new Date(post.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* ЛІВА КОЛОНКА: Опис та Донати */}
              <div className="lg:col-span-2 flex flex-col">
                
                <div className="flex-1">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Опис ситуації</h3>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                    {post.description}
                  </div>
                </div>

                {isFinancial && post.requisites && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-3xl border border-emerald-100 mt-6">
                    <h3 className="text-emerald-800 font-black mb-3 flex items-center gap-2 text-lg">
                      <span className="text-xl">❤️</span> Підтримати фінансово
                    </h3>
                    
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-200 mb-4 shadow-sm">
                      <span className="font-bold text-slate-600 font-mono text-sm truncate mr-4 selection:bg-emerald-200">
                        {post.requisites}
                      </span>
                      <button 
                        onClick={handleCopyRequisites}
                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                      >
                        {copied ? '✓ Скопійовано' : 'Копіювати'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button 
                        onClick={() => openPaymentModal('one-time')}
                        className="flex flex-col items-center justify-center w-full p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-md shadow-emerald-200/50 group"
                      >
                        <span className="font-black text-base mb-0.5 group-hover:-translate-y-0.5 transition-transform">Разовий донат</span>
                        <span className="text-emerald-100 text-[10px] uppercase tracking-wider font-bold">Оплата карткою</span>
                      </button>
                      
                      <button 
                        onClick={() => openPaymentModal('subscription')}
                        className="flex flex-col items-center justify-center w-full p-3 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all active:scale-95 shadow-sm group"
                      >
                        <span className="font-black text-base mb-0.5 group-hover:-translate-y-0.5 transition-transform">Підписатися</span>
                        <span className="text-emerald-500/70 text-[10px] uppercase tracking-wider font-bold">Щомісячний платіж</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ПРАВА КОЛОНКА */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center font-black text-xl mb-2 shadow-inner overflow-hidden">
                    {post.authorAvatar ? <img src={post.authorAvatar} alt="avatar" className="w-full h-full object-cover" /> : (post.authorName?.charAt(0) || 'U')}
                  </div>
                  <p className="font-black text-slate-900 text-base">{post.authorName}</p>
                  <p className="text-xs font-bold text-slate-400 mb-3">@{post.authorLogin || 'user'}</p>
                  <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-200 transition-all flex items-center justify-center gap-2">
                    Написати в чат 💬
                  </button>
                </div>

                {(post.animalName || post.breed) && (
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Деталі</h3>
                    <ul className="space-y-2.5 text-sm">
                      {post.animalName && <li className="flex justify-between"><span className="text-slate-500">Ім'я:</span> <span className="font-bold text-slate-900">{post.animalName}</span></li>}
                      {post.animalType && <li className="flex justify-between"><span className="text-slate-500">Вид:</span> <span className="font-bold text-slate-900">{post.animalType}</span></li>}
                      {post.breed && <li className="flex justify-between"><span className="text-slate-500">Порода:</span> <span className="font-bold text-slate-900">{post.breed}</span></li>}
                      {post.age && <li className="flex justify-between"><span className="text-slate-500">Вік:</span> <span className="font-bold text-slate-900">{post.age}</span></li>}
                      {post.gender && <li className="flex justify-between"><span className="text-slate-500">Стать:</span> <span className="font-bold text-slate-900">{post.gender}</span></li>}
                      {post.orgCity && <li className="flex justify-between"><span className="text-slate-500">Місто:</span> <span className="font-bold text-slate-900">{post.orgCity}</span></li>}
                    </ul>
                  </div>
                )}

                {post.keeperPhone && (
                  <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm shrink-0">📱</div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest">Контакт</p>
                      <a href={`tel:${post.keeperPhone}`} className="text-base font-black text-slate-900 hover:text-rose-600 transition-colors">
                        {post.keeperPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === МОДАЛЬНЕ ВІКНО ОПЛАТИ === */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in py-10 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative border border-slate-100 overflow-hidden my-auto">
            
            {!isProcessing && !paymentSuccess && (
              <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-full transition-colors z-10">✕</button>
            )}

            {/* Екран 1: Форма оплати */}
            {!isProcessing && !paymentSuccess && (
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                    {paymentType === 'subscription' ? '🔄' : '💳'}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">
                    {paymentType === 'subscription' ? 'Щомісячна підписка' : 'Разовий донат'}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">Ваша підтримка рятує життя</p>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                  {/* Вибір суми */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Сума (ГРН)</label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {['50', '100', '200', '500'].map(amount => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setPaymentForm({...paymentForm, amount, customAmount: ''})}
                          className={`py-2 rounded-xl text-sm font-bold border transition-all ${paymentForm.amount === amount && !paymentForm.customAmount ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'}`}
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="number" 
                      placeholder="Інша сума..." 
                      value={paymentForm.customAmount}
                      onChange={(e) => setPaymentForm({...paymentForm, customAmount: e.target.value, amount: e.target.value})}
                      className={inputStyle}
                      min="1"
                    />
                  </div>

                  {/* Дані картки */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Дані картки</label>
                    <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <input 
                        type="text" 
                        required 
                        placeholder="Номер картки (16 цифр)" 
                        maxLength="16"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value.replace(/\D/g, '')})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 outline-none text-sm text-slate-900 font-mono tracking-widest"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          required 
                          placeholder="ММ/РР" 
                          maxLength="5"
                          value={paymentForm.expiry}
                          onChange={(e) => setPaymentForm({...paymentForm, expiry: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 outline-none text-sm text-slate-900 font-mono text-center"
                        />
                        <input 
                          type="password" 
                          required 
                          placeholder="CVV" 
                          maxLength="3"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value.replace(/\D/g, '')})}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 outline-none text-sm text-slate-900 font-mono text-center"
                        />
                      </div>
                      <input 
                        type="text" 
                        required 
                        placeholder="Ім'я власника картки" 
                        value={paymentForm.cardholderName}
                        onChange={(e) => setPaymentForm({...paymentForm, cardholderName: e.target.value.toUpperCase()})}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 outline-none text-sm text-slate-900 font-bold uppercase"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-95 transition-all mt-4">
                    Оплатити {paymentForm.customAmount || paymentForm.amount} ₴
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1 mt-3">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Безпечний платіж
                  </p>
                </form>
              </div>
            )}

            {/* Екран 2: Завантаження (Процесинг) */}
            {isProcessing && (
              <div className="p-12 text-center py-24 flex flex-col items-center">
                <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Обробка платежу...</h3>
                <p className="text-sm text-slate-500 font-medium">Будь ласка, зачекайте та не закривайте вікно.</p>
              </div>
            )}

            {/* Екран 3: Успіх */}
            {paymentSuccess && (
              <div className="p-12 text-center py-24 flex flex-col items-center animate-fade-in">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner animate-[bounce_1s_ease-in-out_1]">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Оплата успішна!</h3>
                <p className="text-slate-500 font-medium mb-6">
                  Дякуємо за вашу підтримку! Сума <span className="font-bold text-slate-900">{paymentForm.customAmount || paymentForm.amount} ₴</span> була успішно перерахована.
                </p>
                <button onClick={() => setIsPaymentModalOpen(false)} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                  Повернутися до поста
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default PostDetailsPage;