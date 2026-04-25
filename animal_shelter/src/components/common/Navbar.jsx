import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, register, login, logout, checkLoginExists, checkEmailExists } = useAuth(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); 
  const [errorMsg, setErrorMsg] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false); 

  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [showRegConfirmPwd, setShowRegConfirmPwd] = useState(false);

  const [authStep, setAuthStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [formData, setFormData] = useState({
    name: '', login: '', email: '', password: '', confirmPassword: '', role: 'user'
  });
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });

  const isActive = (path) => location.pathname === path;

  const inputStyle = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 outline-none text-sm text-gray-900 shadow-[inset_0_0_0px_1000px_#f9fafb] [-webkit-text-fill-color:#111827] transition-all pr-12";

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMsg('');
    setAuthStep(1);
    setLoginData({ identifier: '', password: '' });
    setFormData({ name: '', login: '', email: '', password: '', confirmPassword: '', role: 'user' });
    setUploadedFileName('');
    setShowLoginPwd(false);
    setShowRegPwd(false);
    setShowRegConfirmPwd(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setAuthStep(1);
    setLoginData({ identifier: '', password: '' });
    setFormData({ name: '', login: '', email: '', password: '', confirmPassword: '', role: 'user' });
    setShowLoginPwd(false);
    setShowRegPwd(false);
    setShowRegConfirmPwd(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const result = login(loginData.identifier, loginData.password);
    if (result.success) {
      handleCloseModal(); 
      navigate(ROUTES.PROFILE); 
    } else setErrorMsg(result.message);
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setErrorMsg(''); };

  const handleLoginChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[a-zA-Z0-9_]+$/.test(value)) {
      setFormData({ ...formData, login: value.toLowerCase() }); 
      setErrorMsg('');
    } else setErrorMsg('Логін може містити лише англійські літери, цифри та "_"');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (authStep === 1) {
      if (checkLoginExists(formData.login)) return setErrorMsg('Цей логін вже зайнятий. Будь ласка, оберіть інший!');
      if (checkEmailExists(formData.email)) return setErrorMsg('Користувач із цією поштою вже зареєстрований!');
      if (formData.password !== formData.confirmPassword) return setErrorMsg('Паролі не збігаються! Перевірте введені дані.');
      formData.role === 'user' ? setAuthStep(3) : setAuthStep(2);
    } else if (authStep === 2) setAuthStep(3);
  };

  const handleDijaVerification = () => {
    setIsVerifying(true);
    setTimeout(() => { setIsVerifying(false); setVerificationResult('success'); setAuthStep(4); }, 2000);
  };

  const handleFinishRegister = () => {
    const result = register(formData);
    if (result.success) { handleCloseModal(); navigate(ROUTES.PROFILE); } 
    else { setAuthStep(1); setErrorMsg(result.message); }
  };

  const EyeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
  const EyeOffIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-rose-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
            <span className="text-2xl text-rose-500 group-hover:scale-110 transition-transform">🌸</span>
            <span className="text-xl font-black text-rose-500 tracking-tight">AnimalShelter</span>
          </Link>

          {/* Видалили лінку на Чати звідси */}
          <div className="hidden md:flex items-center gap-8">
            <Link to={ROUTES.ANIMALS} className={`font-bold text-sm ${isActive(ROUTES.ANIMALS) ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>Знайти друга</Link>
            <Link to={ROUTES.FEED} className={`font-bold text-sm ${isActive(ROUTES.FEED) ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>Стрічка допомоги</Link>
            <Link to={ROUTES.MAP} className={`font-bold text-sm ${isActive(ROUTES.MAP) ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>Карта</Link>
          </div>

          <div>
            {!currentUser ? (
              <button onClick={() => { setIsModalOpen(true); setActiveTab('login'); }} className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-full shadow-md hover:scale-105 transition-all text-sm">
                Увійти
              </button>
            ) : (
              <div className="relative">
                <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 cursor-pointer group p-1.5 pr-4 bg-rose-50 rounded-full border border-rose-100 transition-all hover:bg-rose-100">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-purple-500 flex items-center justify-center shadow-sm text-sm border-2 border-white text-white font-bold uppercase overflow-hidden">
                     {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        currentUser.name.charAt(0)
                      )}
                   </div>
                   <div className="flex flex-col">
                     <span className="font-bold text-sm text-gray-800 leading-none">{currentUser.name}</span>
                   </div>
                </div>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 animate-fade-in z-50">
                    <Link to={ROUTES.PROFILE} onClick={() => setShowProfileMenu(false)} className="block px-5 py-3 text-sm font-bold text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                      👤 Мій профіль
                    </Link>
                    <div className="border-t border-rose-50 my-1"></div>
                    <button onClick={() => { logout(); setShowProfileMenu(false); navigate(ROUTES.HOME); }} className="w-full text-left px-5 py-3 text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                      Вийти з акаунта
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Модальне вікно (Без змін) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2rem] shadow-2xl relative border border-gray-100 p-8">
            <button onClick={handleCloseModal} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-rose-500 bg-gray-50 rounded-full z-20 transition-colors">✕</button>

            {authStep === 1 && (
              <div className="flex bg-gray-50 p-1 rounded-2xl mb-6">
                <button type="button" onClick={() => switchTab('login')} className={`flex-1 py-2.5 font-bold text-sm rounded-xl transition-all ${activeTab === 'login' ? 'bg-white shadow-sm text-rose-500' : 'text-gray-500 hover:text-gray-900'}`}>Вхід</button>
                <button type="button" onClick={() => switchTab('register')} className={`flex-1 py-2.5 font-bold text-sm rounded-xl transition-all ${activeTab === 'register' ? 'bg-white shadow-sm text-rose-500' : 'text-gray-500 hover:text-gray-900'}`}>Реєстрація</button>
              </div>
            )}

            {errorMsg && <div className="mb-6 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-xl text-center animate-slide-up">{errorMsg}</div>}

            {activeTab === 'login' && authStep === 1 && (
              <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4 animate-fade-in">
                <div style={{ display: 'none' }}><input type="text" name="hidden_login" autoComplete="username" /><input type="password" name="hidden_password" autoComplete="current-password" /></div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Пошта або логін</label>
                  <input type="text" name="identifier" required value={loginData.identifier} onChange={(e) => { setLoginData({...loginData, identifier: e.target.value}); setErrorMsg(''); }} placeholder="" autoComplete="off" className={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Пароль</label>
                  <div className="relative">
                    <input type={showLoginPwd ? "text" : "password"} name="password" required value={loginData.password} onChange={(e) => { setLoginData({...loginData, password: e.target.value}); setErrorMsg(''); }} placeholder="" autoComplete="new-password" className={inputStyle} />
                    <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 focus:outline-none transition-colors">{showLoginPwd ? <EyeOffIcon /> : <EyeIcon />}</button>
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-all active:scale-95 mt-6">Увійти</button>
              </form>
            )}

            {activeTab === 'register' && (
              <>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3].map(step => (<div key={step} className={`h-1.5 flex-1 rounded-full transition-colors ${authStep >= step ? 'bg-rose-500' : 'bg-gray-100'}`}></div>))}
                </div>

                {authStep === 1 && (
                  <form onSubmit={handleNextStep} autoComplete="off" className="animate-slide-up">
                    <div style={{ display: 'none' }}><input type="email" name="hidden_email" autoComplete="email" /><input type="password" name="hidden_password" autoComplete="new-password" /></div>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Роль на платформі</label>
                      <select name="role" value={formData.role} onChange={handleChange} className={inputStyle + " cursor-pointer font-bold"}>
                        <option value="user">Користувач (Шукаю друга)</option>
                        <option value="volunteer">Волонтер</option>
                        <option value="shelter">Організація / Притулок</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Ім'я / Назва</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="" autoComplete="off" className={inputStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Унікальний логін</label>
                        <input type="text" name="login" required value={formData.login} onChange={handleLoginChange} placeholder="" autoComplete="off" className={inputStyle} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Email</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="" autoComplete="off" className={inputStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Пароль</label>
                        <div className="relative">
                          <input type={showRegPwd ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} placeholder="" autoComplete="new-password" className={inputStyle} />
                          <button type="button" onClick={() => setShowRegPwd(!showRegPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 focus:outline-none transition-colors">{showRegPwd ? <EyeOffIcon /> : <EyeIcon />}</button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Повторіть пароль</label>
                        <div className="relative">
                          <input type={showRegConfirmPwd ? "text" : "password"} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="" autoComplete="new-password" className={inputStyle} />
                          <button type="button" onClick={() => setShowRegConfirmPwd(!showRegConfirmPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 focus:outline-none transition-colors">{showRegConfirmPwd ? <EyeOffIcon /> : <EyeIcon />}</button>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-95 transition-all">Продовжити &rarr;</button>
                  </form>
                )}

                {authStep === 2 && (
                  <div className="text-center animate-slide-up">
                    <h2 className="text-xl font-black mb-4">Документи</h2>
                    <label className="border-2 border-dashed border-rose-200 bg-rose-50 rounded-3xl p-6 flex flex-col items-center cursor-pointer hover:bg-rose-100 transition-colors">
                      <span className="text-3xl mb-2">📁</span>
                      <span className="text-sm font-bold text-gray-700">{uploadedFileName || 'Завантажити файл'}</span>
                      <input type="file" className="hidden" onChange={(e) => e.target.files[0] && setUploadedFileName(e.target.files[0].name)} />
                    </label>
                    <button onClick={handleNextStep} disabled={!uploadedFileName} className="w-full py-4 mt-6 bg-gray-900 text-white font-bold rounded-2xl disabled:opacity-50 transition-all hover:bg-gray-800">Далі</button>
                  </div>
                )}

                {authStep === 3 && (
                  <div className="text-center animate-slide-up">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-xl">Дія</div>
                    <h2 className="text-xl font-black mb-6">Верифікація</h2>
                    {isVerifying ? (
                      <div className="py-4"><div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div></div>
                    ) : (
                      <button onClick={handleDijaVerification} className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-all active:scale-95">Підтвердити особу</button>
                    )}
                  </div>
                )}

                {authStep === 4 && (
                  <div className="text-center animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner animate-[bounce_1s_ease-in-out_1]">✓</div>
                    <h2 className="text-xl font-black mb-6">Успішно!</h2>
                    <button onClick={handleFinishRegister} className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all">Увійти в профіль</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;