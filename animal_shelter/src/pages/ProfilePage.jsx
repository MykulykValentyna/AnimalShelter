import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';
// import postService from '../services/postService'; // Тимчасово закоментовано для фронтенд-демо

// === ФЕЙКОВІ ДАНІ (Mock Data) ===
const fakeUserPosts = [
  {
    id: 'post_1',
    category: 'adoption',
    status: 'published',
    title: 'Шукаю родину для котика',
    description: 'Знайшов на вулиці маленького котика, зараз він у безпеці, але потребує постійного дому.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
    animalName: 'Сніжок',
    animalType: 'Кіт / Кішка',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'post_2',
    category: 'help',
    helpType: 'financial',
    targetType: 'animal',
    status: 'pending',
    title: 'Збір на лікування Барсіка',
    description: 'Барсік потребує складної операції на лапці. Будь ласка, допоможіть зібрати кошти.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80',
    animalName: 'Барсік',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'post_3',
    category: 'offer_help',
    helpType: 'physical',
    offerProviderType: 'person',
    status: 'rejected',
    title: 'Пропоную перетримку для собак',
    description: 'Маю великий приватний будинок, можу брати на перетримку собак середніх порід.',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80',
    providerName: 'Іван',
    admin_comment: 'Будь ласка, додайте більше фотографій умов перетримки (подвір\'я, вольєр).',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  }
];

const fakeDonations = [
  { id: 'don_1', amount: 500, date: new Date(Date.now() - 86400000 * 2).toISOString(), postTitle: 'Терміновий збір на лікування Біма', status: 'completed' },
  { id: 'don_2', amount: 150, date: new Date(Date.now() - 86400000 * 15).toISOString(), postTitle: 'Корм для міні-притулку "Надія"', status: 'completed' },
  { id: 'don_3', amount: 1000, date: new Date(Date.now() - 86400000 * 40).toISOString(), postTitle: 'Врятовані цуценята з Херсона', status: 'completed' },
];

const fakeSubscriptions = [
  { id: 'sub_1', amount: 200, nextPayment: new Date(Date.now() + 86400000 * 10).toISOString(), postTitle: 'Щомісячна підтримка притулку "Щасливий хвіст"', status: 'active', cardLast4: '4242' },
  { id: 'sub_2', amount: 100, nextPayment: new Date(Date.now() - 86400000 * 5).toISOString(), postTitle: 'Допомога котикам Олени', status: 'cancelled', cardLast4: '1111' },
];

const ProfilePage = () => {
  const { currentUser, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  const [userPosts, setUserPosts] = useState([]);
  const [donations, setDonations] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editForm, setEditForm] = useState({ name: '', password: '', confirmPassword: '', avatar: null });
  
  // ФОРМА ПОСТА
  const [postForm, setPostForm] = useState({ 
    category: 'adoption', helpType: 'financial', targetType: 'animal', offerProviderType: 'person', title: '', 
    animalName: '', animalType: 'Кіт / Кішка', gender: 'Хлопчик', breed: '', age: '', weight: '', height: '', color: '', health: '', documents: '', 
    orgName: '', orgType: 'Притулок', orgCity: '', orgAddress: '', providerName: '', region: '',
    description: '', keeperPhone: '', requisites: '', image: null
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const fileInputRef = useRef(null);
  const postImageRef = useRef(null);

  const isAdoption = postForm.category === 'adoption';
  const isHelp = postForm.category === 'help';
  const isOfferHelp = postForm.category === 'offer_help';
  const isFinancial = (isHelp || isOfferHelp) && postForm.helpType === 'financial';
  const isPhysical = (isHelp || isOfferHelp) && postForm.helpType === 'physical';
  const targetType = postForm.targetType;
  const showAnimalFields = isAdoption || (isHelp && targetType === 'animal');
  const showOrgFields = isHelp && targetType === 'organization';
  const showOfferFields = isOfferHelp;

  useEffect(() => {
    if (!currentUser) {
      navigate(ROUTES.HOME);
    } else {
      setEditForm({ 
        name: currentUser.name || currentUser.full_name || '', 
        password: '', confirmPassword: '', avatar: currentUser.avatar 
      });
      fetchUserData(); 
    }
  }, [currentUser, navigate]); 

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // --- ЗАГЛУШКА (Фейкові дані) ---
      setTimeout(() => {
        setUserPosts(fakeUserPosts);
        setDonations(fakeDonations);
        setSubscriptions(fakeSubscriptions);
        setIsLoading(false);
      }, 800);
      
      // --- ДЛЯ ГОТОВОГО БЕКЕНДУ РОЗКОМЕНТУЙ ЦЕ: ---
      // const postsData = await postService.getUserPosts();
      // setUserPosts(postsData);
      // const financesData = await postService.getUserFinances(); // Припустимо, є такий метод
      // setDonations(financesData.donations);
      // setSubscriptions(financesData.subscriptions);
      // setIsLoading(false);
      
    } catch (error) {
      console.error("Помилка завантаження даних:", error);
      setIsLoading(false);
    }
  };

  if (!currentUser) return null; 

  const roleLabels = { user: 'Користувач', volunteer: 'Волонтер', shelter: 'Організація', admin: 'Адміністратор' };
  const tabs = [{ id: 'posts', label: 'Мої пости', icon: '📝' }, { id: 'donations', label: 'Історія донатів', icon: '💸' }, { id: 'subscriptions', label: 'Мої підписки', icon: '💎' }];

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editForm.password && editForm.password !== editForm.confirmPassword) return setErrorMsg('Паролі не збігаються!');
    try {
      if (updateUser) {
        await updateUser({ name: editForm.name, password: editForm.password, avatar: editForm.avatar });
        setErrorMsg(''); setIsEditModalOpen(false);
      } else alert("Оновлення профілю поки в розробці на сервері!");
    } catch (error) { setErrorMsg(error.error || 'Помилка оновлення профілю'); }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditForm({ ...editForm, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handlePostImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPostForm({ ...postForm, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Ви впевнені, що хочете НАЗАВЖДИ видалити свій акаунт?")) {
      alert("Акаунт видалено (демонстрація)");
      logout(); navigate(ROUTES.HOME);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postForm.image) return alert('Будь ласка, завантажте фотографію!');
    alert('Пост успішно відправлено на модерацію (демонстрація)!');
    setIsPostModalOpen(false);
  };

  const handleCancelSubscription = (subId) => {
    if(window.confirm('Ви впевнені, що хочете скасувати цю регулярну підписку?')) {
      const updatedSubs = subscriptions.map(sub => sub.id === subId ? {...sub, status: 'cancelled'} : sub);
      setSubscriptions(updatedSubs);
      alert('Підписку скасовано.');
    }
  };

  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 outline-none text-sm text-slate-900 transition-all font-medium";
  const disabledInputStyle = "w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed opacity-70 font-medium";

  const EyeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
  const EyeOffIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;

  const unreadCount = 0; // Заглушка

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 pt-12 pb-24 px-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto">
        
        {/* БЛОК ПРОФІЛЮ */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-gradient-to-tr from-rose-400 to-purple-500 shadow-xl flex items-center justify-center overflow-hidden shrink-0">
              {currentUser.avatar ? <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white" /> : <div className="w-full h-full rounded-full bg-rose-50 border-4 border-white flex items-center justify-center text-4xl font-black text-rose-400 uppercase">{(currentUser.name || currentUser.full_name || 'U').charAt(0)}</div>}
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-black text-slate-900">{currentUser.name || currentUser.full_name}</h1>
                <span className="inline-block px-4 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full border border-rose-100 uppercase tracking-widest">{roleLabels[currentUser.role] || 'Користувач'}</span>
              </div>
              <p className="text-slate-400 font-bold tracking-tight text-lg">@{currentUser.login}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-medium">
                <span className="text-xl">✉️</span> {currentUser.email}
              </div>
            </div>
            <button onClick={() => setIsEditModalOpen(true)} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap">
              Налаштування
            </button>
          </div>
        </div>

        {/* НАВІГАЦІЯ (ТАБИ) */}
        <div className="flex gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 mb-8 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Вкладка: МОЇ ПОСТИ */}
              {activeTab === 'posts' && (
                <div className="animate-fade-in space-y-6">
                  {userPosts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {userPosts.map(post => {
                        const badgeText = post.category === 'adoption' ? 'ШУКАЄ ДІМ' : post.category === 'offer_help' ? 'ПРОПОНУЄ ДОПОМОГУ' : 'ПОТРЕБУЄ ДОПОМОГИ';
                        return (
                          <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</span>
                                <span className={`text-xs font-bold ${post.category === 'adoption' ? 'text-purple-500' : post.category === 'offer_help' ? 'text-blue-500' : 'text-rose-500'}`}>{badgeText}</span>
                              </div>
                              {post.status === 'pending' ? <span className="px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] font-bold rounded-full uppercase flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> На модерації</span> : 
                               post.status === 'rejected' ? <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold rounded-full uppercase flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Відхилено</span> : 
                               <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full uppercase flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Опубліковано</span>}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              {post.image && <img src={post.image} alt="Ілюстрація" className="w-full sm:w-32 h-32 rounded-xl object-cover shadow-sm shrink-0" />}
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{post.title}</h3>
                                <p className="text-slate-600 text-sm line-clamp-2 mb-2">{post.description}</p>
                                {post.status === 'rejected' && post.admin_comment && <div className="p-3 bg-red-50 rounded-xl text-xs text-red-700 italic border border-red-100"><strong>Коментар модератора:</strong> {post.admin_comment}</div>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <span className="text-5xl mb-4 block opacity-50">📭</span>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">У вас ще немає постів</h3>
                      <button onClick={() => setIsPostModalOpen(true)} className="px-6 py-2.5 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors">Створити перший запис</button>
                    </div>
                  )}
                </div>
              )}

              {/* Вкладка: ІСТОРІЯ ДОНАТІВ */}
              {activeTab === 'donations' && (
                <div className="animate-fade-in space-y-4">
                  {donations.length > 0 ? (
                    <>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-6 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="text-emerald-800 font-bold text-sm mb-1">Загальна сума допомоги</p>
                          <p className="text-3xl font-black text-emerald-600">{donations.reduce((sum, d) => sum + d.amount, 0)} ₴</p>
                        </div>
                        <div className="text-4xl">🏆</div>
                      </div>
                      {donations.map(don => (
                        <div key={don.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-200 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl shrink-0">💖</div>
                            <div>
                              <p className="font-bold text-slate-900 mb-0.5 line-clamp-1">{don.postTitle}</p>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(don.date).toLocaleDateString('uk-UA', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                            </div>
                          </div>
                          <div className="text-right w-full sm:w-auto">
                            <span className="text-lg font-black text-emerald-600">+{don.amount} ₴</span>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Успішно</p>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <span className="text-5xl mb-4 block opacity-50">🤍</span>
                      <h3 className="text-xl font-bold text-slate-800">Історія донатів порожня</h3>
                    </div>
                  )}
                </div>
              )}

              {/* Вкладка: ПІДПИСКИ */}
              {activeTab === 'subscriptions' && (
                <div className="animate-fade-in space-y-4">
                  {subscriptions.length > 0 ? (
                    subscriptions.map(sub => (
                      <div key={sub.id} className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${sub.status === 'active' ? 'border-purple-200' : 'border-slate-100 opacity-70'}`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${sub.status === 'active' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>🔄</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-slate-900">{sub.postTitle}</h3>
                              {sub.status === 'active' ? <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-black uppercase rounded-md border border-purple-100">Активна</span> : <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-md">Скасована</span>}
                            </div>
                            <p className="text-sm text-slate-500 font-medium mb-1">Картка: **** {sub.cardLast4}</p>
                            {sub.status === 'active' && <p className="text-xs text-slate-400">Наступний платіж: <span className="font-bold">{new Date(sub.nextPayment).toLocaleDateString()}</span></p>}
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto gap-4">
                          <span className="text-2xl font-black text-slate-900">{sub.amount} ₴<span className="text-sm text-slate-400 font-medium">/міс</span></span>
                          {sub.status === 'active' && <button onClick={() => handleCancelSubscription(sub.id)} className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline">Скасувати підписку</button>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <span className="text-5xl mb-4 block opacity-50">🔄</span>
                      <h3 className="text-xl font-bold text-slate-800">У вас немає активних підписок</h3>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ПЛАВАЮЧІ ВІДЖЕТИ */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-40">
        <Link to={ROUTES.MESSAGES} className="flex items-center gap-3 px-5 py-4 bg-white text-slate-800 font-bold rounded-full shadow-xl border border-slate-100 hover:text-rose-500 hover:shadow-2xl hover:-translate-y-1 transition-all group">
          <div className="relative">
            <span className="text-2xl group-hover:animate-bounce block">💬</span>
            {unreadCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black rounded-full shadow-md border-2 border-white flex items-center justify-center min-w-[20px] h-[20px] px-1">{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </div>
          <span className="hidden sm:block whitespace-nowrap">Мої чати</span>
        </Link>
        <button onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-rose-300 hover:-translate-y-1 hover:scale-105 transition-all group">
          <span className="text-2xl group-hover:rotate-12 transition-transform">✨</span>
          <span className="hidden sm:block whitespace-nowrap">Створити пост</span>
        </button>
      </div>

      {/* МОДАЛКА: СТВОРЕННЯ ПОСТА */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in py-10">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative border border-slate-100 max-h-full flex flex-col">
            <div className="p-6 md:p-8 border-b border-slate-100 shrink-0 relative flex items-center justify-center">
              <button onClick={() => setIsPostModalOpen(false)} className="absolute right-6 p-2 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-full transition-colors">✕</button>
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-900 mb-1">Створення публікації</h2>
                <p className="text-sm text-slate-500 font-medium">Заповніть усі дані. Пост пройде модерацію перед публікацією.</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <form id="postForm" onSubmit={handlePostSubmit} className="space-y-6 pr-2">
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">1. Мета публікації</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select required value={postForm.category} onChange={e => {
                        const newCategory = e.target.value;
                        setPostForm({...postForm, category: newCategory, targetType: newCategory === 'adoption' ? 'animal' : postForm.targetType});
                      }} className={inputStyle + " cursor-pointer bg-white"}
                    >
                      <option value="adoption">Віддам у добрі руки (Адопція)</option>
                      <option value="help">Потрібна допомога</option>
                      <option value="offer_help">Надаю допомогу</option>
                    </select>
                    
                    {(isHelp || isOfferHelp) && (
                      <select required value={postForm.helpType} onChange={e => setPostForm({...postForm, helpType: e.target.value})} className={inputStyle + " cursor-pointer bg-white"}>
                        <option value="financial">Фінансова</option>
                        <option value="physical">Фізична (Речі, Волонтерство тощо)</option>
                      </select>
                    )}
                  </div>
                  <input type="text" required value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} placeholder="Яскравий заголовок" className={inputStyle + " bg-white mt-4"} />
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">2. Фото та опис</h3>
                  <div className="mb-4">
                    <input type="file" ref={postImageRef} onChange={handlePostImageChange} accept="image/*" className="hidden" />
                    <div onClick={() => postImageRef.current.click()} className="w-full h-32 rounded-2xl cursor-pointer group border-2 border-dashed border-slate-300 hover:border-rose-400 transition-colors bg-white flex items-center justify-center">
                      {postForm.image ? <img src={postForm.image} alt="Preview" className="w-full h-full object-cover rounded-2xl" /> : <div className="text-slate-400 group-hover:text-rose-500 flex flex-col items-center"><span className="text-2xl mb-1">📸</span><span className="text-xs font-bold uppercase tracking-wider">Завантажити фото</span></div>}
                    </div>
                  </div>
                  <textarea required rows="4" value={postForm.description} onChange={e => setPostForm({...postForm, description: e.target.value})} placeholder="Детальний опис ситуації..." className={inputStyle + " bg-white resize-none custom-scrollbar mb-4"}></textarea>
                  
                  {isFinancial && !isOfferHelp && (
                    <input type="text" required value={postForm.requisites} onChange={e => setPostForm({...postForm, requisites: e.target.value})} placeholder="Реквізити (Посилання на Банку, номер картки)" className={inputStyle + " bg-white mb-4"} />
                  )}
                  <input type="tel" required value={postForm.keeperPhone} onChange={e => setPostForm({...postForm, keeperPhone: e.target.value})} placeholder="Контактний телефон: +380..." className={inputStyle + " bg-white"} />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 shrink-0 bg-slate-50/50">
              <button form="postForm" type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 active:scale-95 transition-all text-lg">
                Відправити на модерацію
              </button>
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛКА: РЕДАГУВАННЯ ПРОФІЛЮ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in py-10">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative border border-slate-100 overflow-hidden my-auto">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-full transition-colors z-10">✕</button>
            
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Налаштування</h2>
              {errorMsg && <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center border border-red-100">{errorMsg}</div>}
              
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div className="flex flex-col items-center mb-6">
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                  <div onClick={() => fileInputRef.current.click()} className="relative w-24 h-24 rounded-full cursor-pointer group p-1.5 border-2 border-dashed border-slate-300 hover:border-rose-400 transition-colors">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 flex items-center justify-center">
                      {editForm.avatar ? <img src={editForm.avatar} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-3xl text-slate-300">📷</span>}
                    </div>
                    <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-white text-[10px] font-bold tracking-widest uppercase">Змінити</span></div>
                  </div>
                </div>

                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Ім'я</label><input type="text" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className={inputStyle} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Логін</label><input type="text" disabled value={currentUser.login} className={disabledInputStyle} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Email</label><input type="email" disabled value={currentUser.email} className={disabledInputStyle} /></div>
                
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Зміна пароля</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <input type={showPwd ? "text" : "password"} placeholder="Новий пароль" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} className={inputStyle} />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-[14px] text-slate-400 hover:text-rose-500">{showPwd ? <EyeOffIcon /> : <EyeIcon />}</button>
                    </div>
                    <div className="relative">
                      <input type={showConfirmPwd ? "text" : "password"} placeholder="Повторіть" value={editForm.confirmPassword} onChange={e => setEditForm({...editForm, confirmPassword: e.target.value})} className={inputStyle} />
                      <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-4 top-[14px] text-slate-400 hover:text-rose-500">{showConfirmPwd ? <EyeOffIcon /> : <EyeIcon />}</button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg hover:bg-slate-800 transition-all">Зберегти зміни</button>
                  <button type="button" onClick={handleDeleteAccount} className="w-full py-4 bg-white text-red-500 border border-red-100 font-bold rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2">🗑 Видалити акаунт</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;