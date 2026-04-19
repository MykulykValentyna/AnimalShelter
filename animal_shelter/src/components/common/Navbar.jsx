import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const Navbar = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Стан для багатокрокової реєстрації
  const [authStep, setAuthStep] = useState(1); // 1: Форма, 2: Документи, 3: Дія, 4: Результат
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null); // 'success' або 'error'

  const [formData, setFormData] = useState({
    name: '',
    login: '',
    email: '',
    password: '',
    role: 'user' // user, volunteer, shelter, vet
  });
  const [uploadedFileName, setUploadedFileName] = useState('');

  const isActive = (path) => location.pathname === path;

  // Обробка вводу форми
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Перехід між кроками
  const handleNextStep = (e) => {
    e.preventDefault();
    if (authStep === 1) {
      if (formData.role === 'user') {
        setAuthStep(3); // Звичайний користувач пропускає документи
      } else {
        setAuthStep(2); // Інші ролі завантажують документи
      }
    } else if (authStep === 2) {
      setAuthStep(3); // Після документів йдемо в Дію
    }
  };

  // Завантаження документа
  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  // Імітація перевірки через Дію
  const handleDijaVerification = () => {
    setIsVerifying(true);
    
    // Імітація затримки мережі та перевірки (3 секунди)
    setTimeout(() => {
      setIsVerifying(false);
      // У 90% випадків успіх, у 10% - помилка (для реалістичності)
      const isSuccess = Math.random() > 0.1; 
      setVerificationResult(isSuccess ? 'success' : 'error');
      setAuthStep(4);
    }, 3000);
  };

  // Фіналізація входу
  const handleFinishLogin = () => {
    setIsLoggedIn(true);
    setCurrentUser({ name: formData.name || 'Валентина', role: formData.role });
    setIsModalOpen(false);
    // Скидаємо стан для наступних відкриттів
    setTimeout(() => {
      setAuthStep(1);
      setVerificationResult(null);
      setFormData({ name: '', login: '', email: '', password: '', role: 'user' });
      setUploadedFileName('');
    }, 500);
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-rose-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
            <span className="text-2xl text-rose-500 group-hover:scale-110 transition-transform duration-300">🌸</span>
            <span className="text-xl font-black text-rose-500 tracking-tight">AnimalShelter</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to={ROUTES.ANIMALS} className={`font-bold text-sm transition-colors ${isActive(ROUTES.ANIMALS) ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>Знайти друга</Link>
            <Link to={ROUTES.FEED} className={`font-bold text-sm transition-colors ${isActive(ROUTES.FEED) ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>Стрічка допомоги</Link>
            <Link to={ROUTES.MAP} className={`font-bold text-sm transition-colors ${isActive(ROUTES.MAP) ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>Карта</Link>
            <Link to={ROUTES.MESSAGES} className={`font-bold text-sm transition-colors ${isActive(ROUTES.MESSAGES) ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'}`}>Чати</Link>
          </div>

          <div>
            {!isLoggedIn ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm flex items-center gap-2"
              >
                Реєстрація / Вхід
              </button>
            ) : (
              // ОСЬ ЦЯ ЧАСТИНА ЗМІНЕНА: Тепер це Link на ROUTES.PROFILE
              <Link 
                to={ROUTES.PROFILE}
                className="flex items-center gap-3 cursor-pointer group p-1.5 pr-4 bg-rose-50 rounded-full border border-rose-100 transition-all hover:bg-rose-100 hover:shadow-sm"
              >
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-purple-500 flex items-center justify-center shadow-sm text-sm border-2 border-white text-white font-bold uppercase">
                   {currentUser?.name.charAt(0)}
                 </div>
                 <div className="flex flex-col">
                   <span className="font-bold text-sm text-gray-800 leading-none group-hover:text-rose-600 transition-colors">{currentUser?.name}</span>
                   <span className="text-[10px] text-gray-500 uppercase font-bold mt-0.5">
                     {currentUser?.role === 'vet' ? 'Ветклініка' : currentUser?.role === 'shelter' ? 'Організація' : currentUser?.role === 'volunteer' ? 'Волонтер' : 'Користувач'}
                   </span>
                 </div>
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Модальне вікно Реєстрації */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2.5rem] shadow-2xl relative border border-gray-100">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 rounded-full transition-colors z-20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 relative">
              {/* Прогрес бар */}
              <div className="flex gap-1 mb-8">
                {[1, 2, 3].map(step => (
                  <div key={step} className={`h-1.5 flex-1 rounded-full transition-colors ${authStep >= step ? 'bg-rose-500' : 'bg-gray-100'}`}></div>
                ))}
              </div>

              {/* КРОК 1: Основні дані */}
              {authStep === 1 && (
                <form onSubmit={handleNextStep} className="space-y-5 animate-slide-up">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-gray-900">Створення профілю</h2>
                    <p className="text-gray-500 text-sm mt-1">Заповніть дані для реєстрації на платформі</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 ml-2 uppercase">Хто ви?</label>
                    <select 
                      name="role" 
                      value={formData.role} 
                      onChange={handleChange}
                      className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-rose-300 outline-none font-bold text-gray-800 cursor-pointer"
                    >
                      <option value="user">Користувач (Шукаю друга)</option>
                      <option value="volunteer">Волонтер</option>
                      <option value="shelter">Організація / Притулок</option>
                      <option value="vet">Ветеринарна клініка</option>
                    </select>
                  </div>

                  <div>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Повне ім'я або Назва організації" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-purple-300 outline-none transition-shadow" />
                  </div>
                  <div>
                    <input type="text" name="login" required value={formData.login} onChange={handleChange} placeholder="Логін (Username)" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-purple-300 outline-none transition-shadow" />
                  </div>
                  <div>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Пошта (Email)" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-purple-300 outline-none transition-shadow" />
                  </div>
                  <div>
                    <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Пароль" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-purple-300 outline-none transition-shadow" />
                  </div>

                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 mt-4">
                    Далі &rarr;
                  </button>
                </form>
              )}

              {/* КРОК 2: Завантаження документів (Тільки для спец. ролей) */}
              {authStep === 2 && (
                <div className="space-y-6 animate-slide-up text-center">
                  <h2 className="text-2xl font-black text-gray-900">Підтвердження статусу</h2>
                  <p className="text-gray-500 text-sm">Оскільки ви реєструєтесь як <strong>{formData.role === 'vet' ? 'Ветклініка' : 'Організація/Волонтер'}</strong>, завантажте скан-копії установчих документів або довідок.</p>
                  
                  <label className="border-2 border-dashed border-rose-200 bg-rose-50/50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-colors group">
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">📁</span>
                    <span className="text-sm font-bold text-gray-700">{uploadedFileName || 'Натисніть для завантаження файлу'}</span>
                    <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG до 10MB</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" />
                  </label>

                  <button 
                    onClick={handleNextStep}
                    disabled={!uploadedFileName} 
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
                  >
                    Перевірити документи
                  </button>
                </div>
              )}

              {/* КРОК 3: Перевірка через Дію */}
              {authStep === 3 && (
                <div className="text-center animate-slide-up">
                  <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-xl">
                    Дія
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Верифікація особи</h2>
                  <p className="text-gray-500 text-sm mb-8 px-4">
                    Для безпеки тварин ми просимо підтвердити особу через державний реєстр.
                  </p>

                  {isVerifying ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4"></div>
                      <p className="font-bold text-gray-800 animate-pulse">Отримання даних з реєстру...</p>
                    </div>
                  ) : (
                    <button 
                      onClick={handleDijaVerification} 
                      className="w-full py-4 bg-black text-white font-bold text-lg rounded-2xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2 group hover:scale-[1.02]"
                    >
                      <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                      Пройти перевірку (Дія.Підпис)
                    </button>
                  )}
                </div>
              )}

              {/* КРОК 4: Результат перевірки */}
              {authStep === 4 && (
                <div className="text-center animate-fade-in">
                  {verificationResult === 'success' ? (
                    <>
                      <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner animate-[bounce_1s_ease-in-out_1]">
                        ✓
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">Особу підтверджено!</h2>
                      <p className="text-gray-500 text-sm mb-8">
                        Реєстрація успішно завершена. Ваші дані перевірено, тепер ви маєте повний доступ до платформи.
                      </p>
                      <button 
                        onClick={handleFinishLogin} 
                        className="w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                      >
                        Увійти в профіль
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner animate-pulse">
                        ✕
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">Помилка верифікації</h2>
                      <p className="text-gray-500 text-sm mb-8">
                        Дані не збігаються або запит було відхилено. Будь ласка, перевірте правильність введених даних і спробуйте ще раз.
                      </p>
                      <button 
                        onClick={() => setAuthStep(1)} 
                        className="w-full py-4 bg-gray-100 text-gray-900 font-bold text-lg rounded-2xl hover:bg-gray-200 transition-all active:scale-95 hover:scale-[1.02]"
                      >
                        Спробувати знову
                      </button>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;