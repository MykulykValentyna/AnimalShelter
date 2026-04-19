import React, { useState, useEffect } from 'react';
import ShelterMap from '../components/Map/ShelterMap';

const MapPage = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section з темним фоном, щоб текст було ВИДНО */}
      <header className="bg-slate-900 pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
            <span className="text-rose-500">📍</span>
            <span className="text-sm font-bold text-white uppercase tracking-widest">
              Інтерактивна карта
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Допомога поруч <span className="text-rose-500">із вами</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
            Знаходьте найближчі притулки, волонтерські пункти та ветеринарні клініки у Львові. 
            Клікніть на карту, щоб побачити деталі.
          </p>
        </div>
      </header>

      {/* Map Section - піднята вгору за допомогою негативного margin */}
      <main className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-20">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 rounded-3xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        )}
        <ShelterMap locations={locations} isAdmin={true} />

        {/* Info Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Притулки", icon: "🏡", color: "rose", desc: "Місця чекання на нову родину." },
            { title: "Ветклініки", icon: "🏥", color: "purple", desc: "Професійна медична допомога." },
            { title: "Пункти допомоги", icon: "🆘", color: "emerald", desc: "Збір кормів та ліків." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 hover:scale-105 transition-transform">
              <div className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center mb-6`}>
                <span className="text-3xl">{item.icon}</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MapPage;