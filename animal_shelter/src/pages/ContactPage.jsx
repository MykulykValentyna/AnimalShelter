import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Імітація відправки форми
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-gray-50/50 pt-16 pb-24 px-4 overflow-hidden">
      
      {/* Декоративні плями на фоні */}
      <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-rose-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Заголовок */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-100 shadow-sm mb-6">
            <span className="text-rose-500">💌</span>
            <span className="text-sm font-bold text-gray-800 uppercase tracking-widest">
              Зв'язок з нами
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Ми завжди раді <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">допомогти</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Маєте питання, пропозиції щодо співпраці або хочете стати волонтером? Напишіть нам, і ми відповімо якнайшвидше.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Ліва колонка: Контакти */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">📍</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Наша адреса</h4>
                <p className="text-gray-600 text-sm">м. Львів, вул. Городоцька, 15<br/>Головний офіс Animal Shelter</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">📞</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Телефон</h4>
                <p className="text-gray-600 text-sm">+380 (97) 123 45 67<br/>Щодня з 09:00 до 20:00</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">✉️</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                <p className="text-gray-600 text-sm">hello@animalshelter.ua<br/>Для загальних питань</p>
              </div>
            </div>
          </div>

          {/* Права колонка: Форма */}
          <div className="w-full lg:w-2/3 bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-rose-100 shadow-2xl shadow-rose-100/30 p-8 md:p-10 relative overflow-hidden">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Написати нам</h3>
            
            {isSubmitted ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
                  ✨
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Дякуємо за повідомлення!</h4>
                <p className="text-gray-500">Ми отримали ваш лист і зв'яжемося з вами найближчим часом.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Ваше ім'я</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Наприклад, Олена"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Ваш Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2">Повідомлення</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Напишіть ваше питання або пропозицію..."
                    rows="5"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Надіслати листа
                  <svg className="w-5 h-5 translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;