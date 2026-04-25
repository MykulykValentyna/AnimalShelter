import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';

const AnimalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Скрол наверх при завантаженні сторінки
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const inputStyle = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 outline-none text-sm text-gray-900 shadow-[inset_0_0_0px_1000px_#f9fafb] [-webkit-text-fill-color:#111827] transition-all";

  const [formData, setFormData] = useState({
    phone: '', city: '', housing: 'Квартира (Власна)', experience: '', message: ''
  });

  const animalsDB = {
    "1": {
      name: "Марсик", type: "Кіт", age: "2 роки", gender: "Хлопчик",
      breed: "Європейська короткошерста", weight: "4.5 кг", height: "25 см", color: "Чорно-білий",
      health: "Вакцинований, кастрований, оброблений від паразитів.",
      documents: "Має ветеринарний паспорт.",
      description: "Марсик — це справжній клубочок ніжності. Він дуже ласкавий, обожнює сидіти на ручках і голосно муркотіти. Трохи лякливий до гучних звуків, тому шукає спокійну родину без дуже маленьких дітей.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      keeper: { name: "Олена Волонтер", role: "volunteer", login: "olena_vol", phone: "+380 99 123 45 67", avatar: null }
    },
    "2": {
      name: "Рекс", type: "Пес", age: "1 рік", gender: "Хлопчик",
      breed: "Мітис бігля", weight: "12 кг", height: "40 см", color: "Рудо-білий",
      health: "Вакцинований, чипований.",
      documents: "Ветеринарний паспорт, свідоцтво про чипування.",
      description: "Рекс — неймовірно активний та життєрадісний хлопчик. Обожнює довгі прогулянки та ігри з м'ячем. Ідеально підійде для активної сім'ї.",
      image: "https://images.unsplash.com/photo-1537151608804-ea2f1fa114a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      keeper: { name: "Притулок 'Надія'", role: "shelter", login: "nadiya_shelter", phone: "+380 67 000 00 00", avatar: null }
    },
    "3": {
      name: "Луна", type: "Кішка", age: "4 роки", gender: "Дівчинка",
      breed: "Мейн-кун (мітис)", weight: "6 кг", height: "30 см", color: "Черепаховий",
      health: "Стерилізована, вакцинована.",
      documents: "Ветеринарний паспорт.",
      description: "Луна — дуже спокійна та мудра кішка. Любить спостерігати за всім з висоти. Не нав'язлива, але цінує увагу.",
      image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      keeper: { name: "Валентина Микулик", role: "user", login: "valentyna_m", phone: "+380 63 111 22 33", avatar: null }
    }
  };

  const animal = animalsDB[id];

  if (!animal) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50/50 p-4">
        <span className="text-6xl mb-4">😿</span>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Тваринку не знайдено</h2>
        <button onClick={() => navigate(ROUTES.ANIMALS)} className="text-rose-500 font-bold hover:underline">Повернутися до списку</button>
      </div>
    );
  }

  const roleLabels = { user: 'Користувач', volunteer: 'Волонтер', shelter: 'Організація', vet: 'Ветклініка' };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Будь ласка, авторизуйтесь, щоб відправити заявку!");
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 pt-4 pb-16 px-4 overflow-hidden relative">
      <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-rose-200/40 rounded-full mix-blend-multiply blur-3xl opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply blur-3xl opacity-70 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-rose-500 font-bold text-sm mb-4 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Повернутися до списку
        </button>

        {/* БЛОК 1: Основна інформація */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-rose-100/40 border border-rose-50 p-5 md:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            
            {/* Фото */}
            <div className="w-full lg:w-2/5 shrink-0">
              <div className="w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-inner relative group">
                <img src={animal.image} alt={animal.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full font-black text-rose-500 shadow-md text-sm">
                  {animal.age}
                </div>
              </div>
            </div>

            {/* Деталі */}
            <div className="w-full lg:w-3/5 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${animal.type === 'Кіт' || animal.type === 'Кішка' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {animal.type}
                </span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {animal.gender}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{animal.name}</h1>

              {/* ХАРАКТЕРИСТИКИ (Більше не обрізаються) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Порода</p>
                  <p className="font-bold text-gray-800 text-sm break-words leading-tight">{animal.breed}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Колір</p>
                  <p className="font-bold text-gray-800 text-sm break-words leading-tight">{animal.color}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Вага</p>
                  <p className="font-bold text-gray-800 text-sm break-words leading-tight">{animal.weight}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Зріст</p>
                  <p className="font-bold text-gray-800 text-sm break-words leading-tight">{animal.height}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-1.5"><span className="text-emerald-500 text-base">⚕️</span> Здоров'я</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{animal.health}</p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-1.5"><span className="text-blue-500 text-base">📜</span> Документи</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{animal.documents}</p>
                </div>
              </div>

              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                <p className="text-gray-700 italic text-sm leading-relaxed">"{animal.description}"</p>
              </div>
            </div>

          </div>
        </div>

        {/* БЛОК 2: Куратор та Анкета */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Картка куратора */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 text-center h-full flex flex-col justify-center">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Куратор тваринки</h3>
              
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-rose-200 to-purple-200 p-1 mb-3 shadow-md">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {animal.keeper.avatar ? (
                    <img src={animal.keeper.avatar} alt="Keeper" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-rose-300">{animal.keeper.name.charAt(0)}</span>
                  )}
                </div>
              </div>
              
              <h4 className="text-lg font-black text-gray-900 mb-1 break-words">{animal.keeper.name}</h4>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
                {roleLabels[animal.keeper.role]}
              </span>
              
              <div className="text-xs text-gray-500 font-medium space-y-1 mb-5 break-words">
                <p>@{animal.keeper.login}</p>
                <p>📞 {animal.keeper.phone}</p>
              </div>

              <button 
                onClick={() => navigate(ROUTES.MESSAGES)}
                className="w-full py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-auto"
              >
                <span>💬</span> Написати куратору
              </button>
            </div>
          </div>

          {/* Форма заявки */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 md:p-8">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner animate-[bounce_1s_ease-in-out_1]">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">Заявку надіслано!</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Ваша анкета успішно відправлена куратору <strong>{animal.keeper.name}</strong>. З вами зв'яжуться найближчим часом для обговорення деталей.
                </p>
                <button onClick={() => navigate(ROUTES.ANIMALS)} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all">
                  Повернутися до списку
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-gray-900 mb-1">Анкета власника</h2>
                  <p className="text-gray-500 text-xs">Заповніть інформацію, щоб куратор міг з вами зв'язатися.</p>
                </div>

                {!currentUser && (
                  <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-2 items-center">
                    <span className="text-lg">⚠️</span>
                    <p className="text-xs text-yellow-800 font-bold">Увійдіть у свій акаунт, щоб заявка збереглася у вашому профілі.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase">ПІБ</label>
                      <input type="text" required defaultValue={currentUser?.name || ''} placeholder="Іванов Іван Іванович" className={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase">Телефон</label>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+380 99 000 00 00" className={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase">Місто</label>
                      <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Львів" className={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase">Тип житла</label>
                      <select value={formData.housing} onChange={e => setFormData({...formData, housing: e.target.value})} className={inputStyle + " font-bold cursor-pointer"}>
                        <option value="Квартира (Власна)">Квартира (Власна)</option>
                        <option value="Квартира (Орендована)">Квартира (Орендована)</option>
                        <option value="Приватний будинок">Приватний будинок</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase">Ваш досвід з тваринами</label>
                    <textarea required rows="2" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="Напишіть коротко..." className={inputStyle + " resize-none custom-scrollbar py-2"}></textarea>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase">Чому хочете забрати тваринку?</label>
                    <textarea required rows="2" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Ваше повідомлення..." className={inputStyle + " resize-none custom-scrollbar py-2"}></textarea>
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200 hover:scale-[1.01] active:scale-95 transition-all mt-2 flex items-center justify-center gap-2">
                    <span className="text-lg">🏡</span> Надіслати заявку
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnimalDetailPage;