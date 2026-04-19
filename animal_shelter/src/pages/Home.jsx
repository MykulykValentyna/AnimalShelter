import React from 'react';
import ShelterMap from '../components/Map/ShelterMap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-rose-100 shadow-sm mb-8">
            <span className="text-xl">🌸</span>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 uppercase tracking-wider">
              Animal Shelter
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
            Твоя любов може <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
              змінити їхній світ
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
            Платформа, що об'єднує небайдужих сердець. Знайдіть вірного друга, надайте фінансову допомогу або запропонуйте тимчасовий прихисток для тих, хто цього найбільше потребує.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              to="/animals" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-full shadow-lg shadow-rose-500/30 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
            >
              <span>Знайти друга</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link 
              to="/donate" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-full shadow-md border border-gray-100 hover:border-rose-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
            >
              <span>Підтримати фінансово</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-rose-50/50 rounded-3xl p-8 border border-rose-100/50 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🐾</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Адопція</h3>
              <p className="text-gray-600 leading-relaxed">
                Переглядайте анкети тваринок, які шукають дім. Зручні фільтри допоможуть знайти саме вашого майбутнього улюбленця.
              </p>
            </div>

            <div className="bg-purple-50/50 rounded-3xl p-8 border border-purple-100/50 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">💝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Благодійність</h3>
              <p className="text-gray-600 leading-relaxed">
                Робіть разові внески або оформлюйте щомісячну підписку. Всі збори проходять модерацію для вашої безпеки.
              </p>
            </div>

            <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100/50 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Спільнота</h3>
              <p className="text-gray-600 leading-relaxed">
                Створюйте пости, пропонуйте перетримку, спілкуйтеся в особистих чатах та знаходьте найближчі ветклініки на карті.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-rose-500 to-purple-600 rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
            
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10">
            Готові стати частиною змін?
          </h2>
          <p className="text-rose-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
            Авторизуйтесь через Дію, щоб отримати повний доступ до всіх можливостей платформи. Це швидко, безпечно та надійно.
          </p>
          <button 
            // Цей рядок шукає кнопку в хедері і клікає на неї
            onClick={() => document.querySelector('header button')?.click()} 
            className="relative z-10 px-10 py-4 bg-white text-rose-600 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
          >
            Увійти через Дію
          </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;