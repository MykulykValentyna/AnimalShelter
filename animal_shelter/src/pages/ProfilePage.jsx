import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';

const ProfilePage = () => {
  const { 
    currentUser, updateUser, deleteUser, addPost, getUserPosts, getGlobalUnreadCount 
  } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [forceRender, setForceRender] = useState(0); 
  
  const [editForm, setEditForm] = useState({ name: '', password: '', confirmPassword: '', avatar: null });
  
  // РОЗШИРЕНА ФОРМА ПОСТА (додані поля для "Надаю допомогу")
  const [postForm, setPostForm] = useState({ 
    category: 'adoption', // 'adoption', 'help', 'offer_help'
    helpType: 'financial', // 'financial', 'physical'
    targetType: 'animal', // 'animal', 'organization'
    offerProviderType: 'person', // 'person', 'organization' (для "Надаю допомогу")
    title: '', 
    // Поля для тваринки
    animalName: '', animalType: 'Кіт / Кішка', gender: 'Хлопчик',
    breed: '', age: '', weight: '', height: '', color: '', health: '', documents: '', 
    // Поля для організації (якщо просять допомогу)
    orgName: '', orgType: 'Притулок', orgCity: '', orgAddress: '',
    // Поля для надавача допомоги
    providerName: '', region: '',
    // Спільні
    description: '', keeperPhone: '', requisites: '', image: null
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const fileInputRef = useRef(null);
  const postImageRef = useRef(null);

  // === ЛОГІКА ВІДОБРАЖЕННЯ ПОЛІВ ===
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
      setEditForm({ name: currentUser.name, password: currentUser.password, confirmPassword: currentUser.password, avatar: currentUser.avatar });
      setUserPosts(getUserPosts(currentUser.login)); 
    }
  }, [currentUser, navigate, getUserPosts, forceRender]); 

  useEffect(() => {
    const handleUpdate = () => setForceRender(prev => prev + 1);
    window.addEventListener('app_data_updated', handleUpdate);
    return () => window.removeEventListener('app_data_updated', handleUpdate);
  }, []);

  if (!currentUser) return null; 

  const roleLabels = { user: 'Користувач', volunteer: 'Волонтер', shelter: 'Організація', vet: 'Ветклініка' };
  const tabs = [{ id: 'posts', label: 'Пости', icon: '📝' }, { id: 'subscriptions', label: 'Підписки', icon: '💎' }, { id: 'donations', label: 'Донати', icon: '💸' }];

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editForm.password !== editForm.confirmPassword) return setErrorMsg('Паролі не збігаються!');
    updateUser({ name: editForm.name, password: editForm.password, avatar: editForm.avatar });
    setErrorMsg(''); setIsEditModalOpen(false);
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

  const handleDeleteAccount = () => {
    if (window.confirm("Ви впевнені, що хочете НАЗАВЖДИ видалити свій акаунт?")) {
      deleteUser(); navigate(ROUTES.HOME);
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postForm.image) {
      alert('Будь ласка, завантажте фотографію!');
      return;
    }
    
    // Очищаємо поля, які не відносяться до вибраної категорії, щоб не засмічувати базу
    const finalPostData = { ...postForm };
    if (isOfferHelp) {
      finalPostData.animalName = ''; finalPostData.orgName = '';
    } else if (showOrgFields) {
      finalPostData.animalName = ''; finalPostData.providerName = '';
    } else if (showAnimalFields) {
      finalPostData.orgName = ''; finalPostData.providerName = '';
    }

    addPost(finalPostData);
    setUserPosts(getUserPosts(currentUser.login)); 
    setIsPostModalOpen(false);
    
    // Очищення форми
    setPostForm({ 
      category: 'adoption', helpType: 'financial', targetType: 'animal', offerProviderType: 'person', title: '', 
      animalName: '', animalType: 'Кіт / Кішка', gender: 'Хлопчик', breed: '', age: '', weight: '', height: '', color: '', health: '', documents: '', 
      orgName: '', orgType: 'Притулок', orgCity: '', orgAddress: '',
      providerName: '', region: '',
      description: '', keeperPhone: '', requisites: '', image: null
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputStyle = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 outline-none text-sm text-gray-900 transition-all";
  const disabledInputStyle = "w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed opacity-70";

  const EyeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
  const EyeOffIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;

  const unreadCount = getGlobalUnreadCount();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 pt-12 pb-24 px-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-rose-100/50 border border-rose-50 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-gradient-to-tr from-rose-400 to-purple-500 shadow-xl flex items-center justify-center overflow-hidden shrink-0">
              {currentUser.avatar ? <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white" /> : <div className="w-full h-full rounded-full bg-rose-50 border-4 border-white flex items-center justify-center text-4xl font-black text-rose-300 uppercase">{currentUser.name.charAt(0)}</div>}
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-black text-gray-900">{currentUser.name}</h1>
                <span className="inline-block px-4 py-1 bg-rose-50 text-rose-500 text-xs font-bold rounded-full border border-rose-100 uppercase tracking-widest">{roleLabels[currentUser.role] || 'Користувач'}</span>
              </div>
              <p className="text-gray-400 font-bold tracking-tight text-lg">@{currentUser.login}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 font-medium">
                <span className="text-xl">✉️</span> {currentUser.email}
              </div>
            </div>
            <button onClick={() => setIsEditModalOpen(true)} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-all active:scale-95 whitespace-nowrap">
              Редагувати профіль
            </button>
          </div>
        </div>

        <div className="flex gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === 'posts' && (
            <div className="animate-fade-in space-y-6">
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {userPosts.map(post => {
                    const isOrgPost = post.category === 'help' && post.targetType === 'organization';
                    const isOfferPost = post.category === 'offer_help';
                    
                    // Формуємо підзаголовок залежно від типу
                    const detailsArray = isOfferPost 
                      ? [post.providerName, post.region].filter(Boolean)
                      : isOrgPost 
                        ? [post.orgName, post.orgType, post.orgCity].filter(Boolean)
                        : [post.animalName, post.breed, post.age].filter(Boolean);
                        
                    const detailsString = detailsArray.length > 0 ? detailsArray.join(' • ') : '';

                    // Логіка для тексту бейджа
                    const badgeText = post.category === 'adoption' 
                      ? 'ШУКАЄ ДІМ' 
                      : post.category === 'offer_help' 
                        ? (post.helpType === 'financial' ? 'ПРОПОНУЄ ФІН. ДОПОМОГУ' : 'ПРОПОНУЄ ФІЗ. ДОПОМОГУ')
                        : (post.helpType === 'financial' ? 'ПОТРІБНА ФІН. ДОПОМОГА' : 'ПОТРІБНА ФІЗ. ДОПОМОГА');

                    return (
                      <div key={post.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{post.date}</span>
                            <span className={`text-xs font-bold ${post.category === 'adoption' ? 'text-purple-500' : post.category === 'offer_help' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {badgeText}
                            </span>
                          </div>
                          {post.status === 'pending' ? (
                            <span className="px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-600 text-[10px] font-bold rounded-full uppercase flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> На модерації
                            </span>
                          ) : post.status === 'rejected' ? (
                            <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold rounded-full uppercase flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span> Відхилено
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold rounded-full uppercase flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Опубліковано
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                          {post.image && (
                            <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 shadow-sm">
                              <img src={post.image} alt="Ілюстрація" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h3>
                            {detailsString && <p className="font-bold text-gray-700 text-sm mb-2">{detailsString}</p>}
                            <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-3">{post.description}</p>
                          </div>
                        </div>

                        {/* АВТОР ПУБЛІКАЦІЇ */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <Link to={ROUTES.PROFILE} className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center overflow-hidden border border-rose-200 group-hover:border-rose-400 transition-colors">
                              {post.authorAvatar ? (
                                <img src={post.authorAvatar} alt="Author" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-sm font-bold text-rose-500">{post.authorName?.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-rose-500 transition-colors leading-tight">{post.authorName}</p>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{roleLabels[post.authorRole] || 'Користувач'}</span>
                                <span className="text-[10px] text-gray-400">@{post.authorLogin}</span>
                              </div>
                            </div>
                          </Link>
                          <button className="text-xs font-bold text-rose-500 hover:text-white hover:bg-rose-500 bg-rose-50 px-4 py-2 rounded-xl transition-all shadow-sm">Зв'язатися</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <span className="text-5xl mb-4 block opacity-50">📭</span>
                  <h3 className="text-xl font-bold text-gray-800">У вас ще немає постів</h3>
                  <p className="text-gray-500 mt-2">Використовуйте кнопку віджета, щоб створити перший запис</p>
                </div>
              )}
            </div>
          )}

          {activeTab !== 'posts' && (
             <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
               <span className="text-5xl mb-4 block opacity-50">✨</span>
               <h3 className="text-xl font-bold text-gray-800">Тут поки порожньо</h3>
             </div>
          )}
        </div>
      </div>

      {/* ПЛАВАЮЧІ ВІДЖЕТИ */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-40">
        <Link to={ROUTES.MESSAGES} className="flex items-center gap-3 px-5 py-4 bg-white text-gray-800 font-bold rounded-full shadow-xl border border-gray-100 hover:text-rose-500 hover:shadow-2xl hover:-translate-y-1 transition-all group">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in py-10">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative border border-gray-100 max-h-full flex flex-col">
            
            <div className="p-6 md:p-8 border-b border-rose-50 shrink-0 relative flex items-center justify-center">
              <button onClick={() => setIsPostModalOpen(false)} className="absolute right-6 p-2 text-gray-400 hover:text-rose-500 bg-gray-50 rounded-full transition-colors">✕</button>
              <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 mb-1">Створення публікації</h2>
                <p className="text-sm text-gray-500">Заповніть усі дані. Пост пройде модерацію перед публікацією.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <form id="postForm" onSubmit={handlePostSubmit} className="space-y-6 pr-2">
                
                {/* 1. Мета публікації */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">1. Мета публікації</h3>
                  <div className="grid grid-cols-1 gap-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Категорія</label>
                        <select required value={postForm.category} onChange={e => {
                            const newCategory = e.target.value;
                            setPostForm({...postForm, category: newCategory, targetType: newCategory === 'adoption' ? 'animal' : postForm.targetType});
                          }} 
                          className={inputStyle + " font-bold cursor-pointer bg-white"}
                        >
                          <option value="adoption">Віддам у добрі руки (Адопція)</option>
                          <option value="help">Потрібна допомога</option>
                          <option value="offer_help">Надаю допомогу</option>
                        </select>
                      </div>
                      
                      {(isHelp || isOfferHelp) && (
                        <div className="space-y-2 animate-fade-in">
                          <label className="block text-[10px] font-bold text-rose-500 uppercase ml-1">Тип допомоги</label>
                          <select required value={postForm.helpType} onChange={e => setPostForm({...postForm, helpType: e.target.value})} className={inputStyle + " font-bold cursor-pointer bg-white border-rose-200"}>
                            <option value="financial">Фінансова</option>
                            <option value="physical">Фізична (Речі, Волонтерство тощо)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Вибір: кому потрібна допомога (Тільки якщо просять допомогу) */}
                    {isHelp && (
                      <div className="space-y-2 animate-fade-in border-t border-gray-200 pt-4 mt-2">
                        <label className="block text-[10px] font-bold text-purple-600 uppercase ml-1">Кому потрібна допомога?</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 flex-1 hover:border-purple-300 transition-colors">
                            <input type="radio" name="targetType" value="animal" checked={postForm.targetType === 'animal'} onChange={e => setPostForm({...postForm, targetType: e.target.value})} className="text-purple-500 focus:ring-purple-500" />
                            <span className="text-sm font-bold text-gray-800">Конкретній тваринці</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 flex-1 hover:border-purple-300 transition-colors">
                            <input type="radio" name="targetType" value="organization" checked={postForm.targetType === 'organization'} onChange={e => setPostForm({...postForm, targetType: e.target.value})} className="text-purple-500 focus:ring-purple-500" />
                            <span className="text-sm font-bold text-gray-800">Організації / Притулку</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Вибір: Хто надає допомогу (Тільки якщо пропонують допомогу) */}
                    {isOfferHelp && (
                      <div className="space-y-2 animate-fade-in border-t border-gray-200 pt-4 mt-2">
                        <label className="block text-[10px] font-bold text-blue-500 uppercase ml-1">Хто надає допомогу?</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 flex-1 hover:border-blue-300 transition-colors">
                            <input type="radio" name="offerProviderType" value="person" checked={postForm.offerProviderType === 'person'} onChange={e => setPostForm({...postForm, offerProviderType: e.target.value})} className="text-blue-500 focus:ring-blue-500" />
                            <span className="text-sm font-bold text-gray-800">Приватна особа (ПІБ)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 flex-1 hover:border-blue-300 transition-colors">
                            <input type="radio" name="offerProviderType" value="organization" checked={postForm.offerProviderType === 'organization'} onChange={e => setPostForm({...postForm, offerProviderType: e.target.value})} className="text-blue-500 focus:ring-blue-500" />
                            <span className="text-sm font-bold text-gray-800">Організація / Компанія</span>
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 mt-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Яскравий заголовок</label>
                      <input type="text" required value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} placeholder={isAdoption ? "Напр: Шукаємо родину для Марсика!" : isOfferHelp ? "Напр: Можу безкоштовно перевезти тваринок" : "Напр: Терміновий збір на корм для притулку"} className={inputStyle + " bg-white"} />
                    </div>
                  </div>
                </div>

                {/* 2. Дані (Тваринка, Організація або Надавач допомоги) */}
                <div className="bg-rose-50/30 p-5 rounded-2xl border border-rose-100 animate-fade-in">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">
                    2. {showOfferFields ? 'Детальна інформація' : (showOrgFields ? 'Інформація про Організацію' : 'Інформація про Тваринку')}
                  </h3>
                  {isHelp && !showOrgFields && <p className="text-xs text-gray-500 mb-4">Ці поля є необов'язковими, якщо допомога потрібна не конкретній тваринці.</p>}
                  
                  {/* Головне фото для всіх */}
                  <div className="mb-6 flex flex-col items-center sm:items-start mt-4">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2">Головне фото / Ілюстрація</label>
                    <input type="file" ref={postImageRef} onChange={handlePostImageChange} accept="image/*" className="hidden" />
                    <div onClick={() => postImageRef.current.click()} className="w-full sm:w-48 h-32 rounded-2xl cursor-pointer group border-2 border-dashed border-rose-300 hover:border-rose-500 transition-colors bg-white overflow-hidden relative flex items-center justify-center">
                      {postForm.image ? (
                        <img src={postForm.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-rose-400 group-hover:text-rose-600 transition-colors">
                          <span className="text-2xl mb-1">📸</span>
                          <span className="text-xs font-bold">Завантажити</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Поля для НАДАВАЧА ДОПОМОГИ */}
                  {showOfferFields && (
                    <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">
                          {postForm.offerProviderType === 'person' ? 'ПІБ' : 'Назва організації'}
                        </label>
                        <input type="text" required value={postForm.providerName} onChange={e => setPostForm({...postForm, providerName: e.target.value})} placeholder={postForm.offerProviderType === 'person' ? "Іванов Іван" : "ТОВ 'Добра справа'"} className={inputStyle + " bg-white px-3 py-2"} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Область / Місто</label>
                        <input type="text" required value={postForm.region} onChange={e => setPostForm({...postForm, region: e.target.value})} placeholder="Львівська обл., м. Львів" className={inputStyle + " bg-white px-3 py-2"} />
                      </div>
                    </div>
                  )}

                  {/* Поля для ТВАРИНКИ */}
                  {showAnimalFields && !showOfferFields && (
                    <div className="animate-fade-in">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Ім'я</label><input type="text" required={isAdoption} value={postForm.animalName} onChange={e => setPostForm({...postForm, animalName: e.target.value})} placeholder={isAdoption ? "Рекс" : "Залиште пустим..."} className={inputStyle + " bg-white px-3 py-2"} /></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Вид</label><select required={isAdoption} value={postForm.animalType} onChange={e => setPostForm({...postForm, animalType: e.target.value})} className={inputStyle + " bg-white px-3 py-2"}><option>Кіт / Кішка</option><option>Пес / Собака</option><option>Інше</option></select></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Стать</label><select required={isAdoption} value={postForm.gender} onChange={e => setPostForm({...postForm, gender: e.target.value})} className={inputStyle + " bg-white px-3 py-2"}><option>Хлопчик</option><option>Дівчинка</option><option>Невідомо</option></select></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Порода</label><input type="text" required={isAdoption} value={postForm.breed} onChange={e => setPostForm({...postForm, breed: e.target.value})} placeholder={isAdoption ? "Мітис" : ""} className={inputStyle + " bg-white px-3 py-2"} /></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Вік</label><input type="text" required={isAdoption} value={postForm.age} onChange={e => setPostForm({...postForm, age: e.target.value})} placeholder={isAdoption ? "2 роки" : ""} className={inputStyle + " bg-white px-3 py-2"} /></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Колір</label><input type="text" required={isAdoption} value={postForm.color} onChange={e => setPostForm({...postForm, color: e.target.value})} placeholder={isAdoption ? "Рудий" : ""} className={inputStyle + " bg-white px-3 py-2"} /></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Вага</label><input type="text" required={isAdoption} value={postForm.weight} onChange={e => setPostForm({...postForm, weight: e.target.value})} placeholder={isAdoption ? "4 кг" : ""} className={inputStyle + " bg-white px-3 py-2"} /></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Зріст</label><input type="text" required={isAdoption} value={postForm.height} onChange={e => setPostForm({...postForm, height: e.target.value})} placeholder={isAdoption ? "25 см" : ""} className={inputStyle + " bg-white px-3 py-2"} /></div>
                      </div>
                      <div className="space-y-4">
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Стан здоров'я</label><input type="text" required={isAdoption} value={postForm.health} onChange={e => setPostForm({...postForm, health: e.target.value})} placeholder={isAdoption ? "Вакцинований, оброблений" : ""} className={inputStyle + " bg-white px-3 py-2"} /></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Документи</label><input type="text" required={isAdoption} value={postForm.documents} onChange={e => setPostForm({...postForm, documents: e.target.value})} placeholder={isAdoption ? "Ветеринарний паспорт" : ""} className={inputStyle + " bg-white px-3 py-2"} /></div>
                      </div>
                    </div>
                  )}

                  {/* Поля для ОРГАНІЗАЦІЇ */}
                  {showOrgFields && !showOfferFields && (
                    <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Назва організації / Притулку</label>
                        <input type="text" required value={postForm.orgName} onChange={e => setPostForm({...postForm, orgName: e.target.value})} placeholder="Напр: Притулок 'Надія'" className={inputStyle + " bg-white px-3 py-2"} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Тип організації</label>
                        <select required value={postForm.orgType} onChange={e => setPostForm({...postForm, orgType: e.target.value})} className={inputStyle + " bg-white px-3 py-2 cursor-pointer"}>
                          <option value="Притулок">Притулок</option>
                          <option value="Благодійний фонд">Благодійний фонд</option>
                          <option value="Волонтерська група">Волонтерська група</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Місто</label>
                        <input type="text" required value={postForm.orgCity} onChange={e => setPostForm({...postForm, orgCity: e.target.value})} placeholder="Львів" className={inputStyle + " bg-white px-3 py-2"} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Адреса (необов'язково)</label>
                        <input type="text" value={postForm.orgAddress} onChange={e => setPostForm({...postForm, orgAddress: e.target.value})} placeholder="Вулиця, номер будинку..." className={inputStyle + " bg-white px-3 py-2"} />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Опис та контакти */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
                    3. {isOfferHelp ? 'Контактна інформація та опис' : 'Деталі та контакти'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">
                        {isOfferHelp && isPhysical ? 'Опис (яку саме фізичну допомогу ви надаєте)' : 
                         isOfferHelp && isFinancial ? 'Опис (деталі вашої фінансової підтримки)' :
                         isPhysical ? 'Опис (що саме потрібно зробити/передати)' : 'Детальний опис ситуації'}
                      </label>
                      <textarea required rows="4" value={postForm.description} onChange={e => setPostForm({...postForm, description: e.target.value})} placeholder="Опишіть деталі..." className={inputStyle + " bg-white resize-none custom-scrollbar"}></textarea>
                    </div>
                    
                    {/* Реквізити з'являються ТІЛЬКИ для фінансової допомоги і ТІЛЬКИ якщо допомога ПОТРІБНА */}
                    {isFinancial && !isOfferHelp && (
                      <div className="animate-fade-in">
                        <label className="block text-[10px] font-bold text-emerald-600 uppercase ml-1">Реквізити (Банка, Картка)</label>
                        <input type="text" required value={postForm.requisites} onChange={e => setPostForm({...postForm, requisites: e.target.value})} placeholder="https://send.monobank.ua/..." className={inputStyle + " bg-emerald-50 border-emerald-200"} />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">Контактний телефон для зв'язку</label>
                      <input type="tel" required value={postForm.keeperPhone} onChange={e => setPostForm({...postForm, keeperPhone: e.target.value})} placeholder="+380 XX XXX XX XX" className={inputStyle + " bg-white"} />
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-rose-50 shrink-0">
              <button form="postForm" type="submit" className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 hover:-translate-y-1 active:scale-95 transition-all text-lg flex justify-center items-center gap-2">
                Відправити на перевірку <span>🚀</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* МОДАЛКА: РЕДАГУВАННЯ ПРОФІЛЮ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative border border-gray-100 p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-rose-500 bg-gray-50 rounded-full">✕</button>
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Налаштування</h2>
            {errorMsg && <div className="mb-6 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl text-center">{errorMsg}</div>}
            
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div className="flex flex-col items-center mb-6">
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                <div onClick={() => fileInputRef.current.click()} className="relative w-24 h-24 rounded-full cursor-pointer group p-1 border-2 border-dashed border-rose-200 hover:border-rose-400 transition-colors">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                    {editForm.avatar ? <img src={editForm.avatar} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-3xl text-gray-300">📷</span>}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-white text-[10px] font-bold">ЗМІНИТИ</span></div>
                </div>
              </div>

              <div><label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Ім'я</label><input type="text" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className={inputStyle} /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Логін</label><input type="text" disabled value={currentUser.login} className={disabledInputStyle} /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Email</label><input type="email" disabled value={currentUser.email} className={disabledInputStyle} /></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Новий пароль</label>
                  <input type={showPwd ? "text" : "password"} required value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} className={inputStyle} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-[38px] text-gray-400">{showPwd ? <EyeOffIcon /> : <EyeIcon />}</button>
                </div>
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Повторіть</label>
                  <input type={showConfirmPwd ? "text" : "password"} required value={editForm.confirmPassword} onChange={e => setEditForm({...editForm, confirmPassword: e.target.value})} className={inputStyle} />
                  <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-4 top-[38px] text-gray-400">{showConfirmPwd ? <EyeOffIcon /> : <EyeIcon />}</button>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button type="submit" className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-all">Зберегти зміни</button>
                <button type="button" onClick={handleDeleteAccount} className="w-full py-4 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2">🗑 Видалити акаунт</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;