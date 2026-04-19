import React, { useState } from 'react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');

  // Дані користувача
  const user = {
    name: "Валентина Микулик",
    login: "@valentyna_m",
    email: "valentyna.m@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
    role: "Волонтер"
  };

  // Розділи меню
  const tabs = [
    { id: 'posts', label: 'Пости', icon: '📝' },
    { id: 'subscriptions', label: 'Підписки', icon: '💎' },
    { id: 'donations', label: 'Донати', icon: '💸' },
    { id: 'comments', label: 'Коментарі', icon: '💬' },
    { id: 'notifications', label: 'Сповіщення', icon: '🔔' },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 pt-12 pb-24 px-4 overflow-hidden relative">
      {/* Декоративні елементи фону */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-5xl mx-auto">
        
        {/* Хедер профілю */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-rose-100/50 border border-rose-50 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Фото профілю */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-gradient-to-tr from-rose-400 to-purple-500 shadow-xl">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
              </div>
              <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-100 hover:scale-110 transition-transform">
                📷
              </button>
            </div>

            {/* Основна інфо */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl font-black text-gray-900">{user.name}</h1>
                <span className="inline-block px-4 py-1 bg-rose-50 text-rose-500 text-xs font-bold rounded-full border border-rose-100 uppercase tracking-widest">
                  {user.role}
                </span>
              </div>
              <p className="text-gray-400 font-bold tracking-tight text-lg">{user.login}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">
                <span className="text-xl opacity-70">✉️</span>
                <span className="font-medium">{user.email}</span>
              </div>
            </div>

            {/* Кнопка налаштувань */}
            <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-all active:scale-95">
              Редагувати профіль
            </button>
          </div>
        </div>

        {/* Навігація по розділах (Tabs) */}
        <div className="flex gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-rose-50/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Контент розділів */}
        <div className="space-y-6">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black text-rose-400 uppercase tracking-widest">19 Квітня</span>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase">Опубліковано</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Терміново потрібен корм для притулку</h3>
                <p className="text-gray-500 text-sm line-clamp-2">У нашому невеликому притулку закінчуються запаси...</p>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-xl shadow-purple-50 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">✨</span> Поточні підписки
              </h3>
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-rose-50 border border-purple-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Щомісячний внесок "Друг притулку"</p>
                  <p className="text-sm text-gray-500">Наступне списання: 15 травня</p>
                </div>
                <span className="text-xl font-black text-purple-600">200 ₴ / міс</span>
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-4 animate-fade-in">
              {[
                { to: "Банка 'Теплі вольєри'", amount: "500 ₴", date: "Вчора" },
                { to: "Лікування котика Марса", amount: "100 ₴", date: "15 квітня" }
              ].map((don, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-50 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">✓</div>
                    <div>
                      <p className="font-bold text-gray-900">{don.to}</p>
                      <p className="text-xs text-gray-400">{don.date}</p>
                    </div>
                  </div>
                  <span className="font-black text-gray-900">{don.amount}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white p-6 rounded-3xl border border-gray-100">
                <p className="text-xs font-bold text-rose-400 mb-2 uppercase">До поста: Потрібна допомога волонтерів</p>
                <p className="text-gray-700 italic">"Зможу приїхати у суботу після обіду, маю вільні руки! ✨"</p>
                <p className="text-[10px] text-gray-400 mt-4 uppercase font-bold">18 квітня о 12:40</p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-5 rounded-2xl bg-white border-l-4 border-rose-500 shadow-sm flex gap-4">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Новий коментар під вашим постом</p>
                  <p className="text-xs text-gray-500">Андрій: "Скинув трохи на банку. Тримайтеся!"</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;