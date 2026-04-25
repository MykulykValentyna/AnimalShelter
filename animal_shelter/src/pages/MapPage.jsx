import React, { useState, useEffect } from 'react';

const MapPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeLocation, setActiveLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 

  // ЖОРСТКЕ БЛОКУВАННЯ СКРОЛУ СТОРІНКИ
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const locations = [
    { id: 1, name: "Притулок 'Милосердя'", address: "вул. Шевченка, 12, Львів", phone: "+380 97 111 22 33", type: "shelter", icon: "🏡" },
    { id: 2, name: "Ветклініка 'Лев'", address: "вул. Городоцька, 15, Львів", phone: "+380 63 999 88 77", type: "vet", icon: "🏥" },
    { id: 3, name: "Пункт допомоги 'Хвостики'", address: "вул. Івана Франка, 24, Львів", phone: "+380 50 555 44 33", type: "volunteer", icon: "🆘" },
    { id: 4, name: "Центр 'Добре Серце'", address: "вул. Стрийська, 45, Львів", phone: "+380 67 000 00 00", type: "shelter", icon: "🏡" },
    { id: 5, name: "Ветсервіс 'Здорові лапки'", address: "вул. Личаківська, 33, Львів", phone: "+380 99 123 45 67", type: "vet", icon: "🏥" },
    { id: 6, name: "Волонтерський хаб", address: "вул. Зелена, 102, Львів", phone: "+380 93 444 55 66", type: "volunteer", icon: "🤝" }
  ];

  const filteredLocations = locations.filter(loc => {
    const matchesFilter = activeFilter === 'all' || loc.type === activeFilter;
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loc.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const mapQuery = activeLocation 
    ? `${activeLocation.name}, ${activeLocation.address}` 
    : 'Ветеринарні клініки та притулки Львів';
  
  // НАДІЙНЕ ПОСИЛАННЯ НА GOOGLE MAPS
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=${activeLocation ? 16 : 12}&ie=UTF8&iwloc=&output=embed`;

  return (
    // 100vh мінус висота Navbar (80px). overflow-hidden запобігає появі скролу
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 relative overflow-hidden">
      
      {/* ТЕМНИЙ ФОН ШАПКИ (Фіксована висота для стабільності) */}
      <div className="absolute top-0 left-0 w-full h-[280px] md:h-[320px] bg-slate-900 rounded-b-[3rem] z-0 shadow-lg"></div>

      {/* ЗАГОЛОВОК */}
      <header className="relative z-10 shrink-0 text-center pt-6 md:pt-8 pb-4 px-4 animate-fade-in">
        <div className="inline-flex flex-nowrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-3 backdrop-blur-md shadow-sm w-max mx-auto">
          <span className="text-rose-500 text-sm shrink-0">📍</span>
          <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest whitespace-nowrap shrink-0">
            Інтерактивна карта
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-md">
          Допомога поруч <span className="text-rose-500">із вами</span>
        </h1>
        <p className="max-w-xl mx-auto text-xs md:text-sm text-slate-300">
          Знаходьте найближчі притулки, волонтерські пункти та ветеринарні клініки у Львові.
        </p>
      </header>

      {/* ОСНОВНИЙ КОНТЕЙНЕР-ОСТРІВ */}
      {/* pb-6 дає відступ знизу, щоб картка не прилипала до краю екрана */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 pb-6 flex flex-col min-h-0 animate-slide-up">
        
        {/* КАРТКА З УСІМА ЗАОКРУГЛЕННЯМИ (rounded-[2rem] замість rounded-t) */}
        <div className="bg-white w-full h-full rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
          
          {/* ЛІВА ПАНЕЛЬ */}
          <div className="w-full md:w-[350px] lg:w-[400px] flex flex-col h-[45%] md:h-full shrink-0 border-b md:border-b-0 md:border-r border-gray-100 bg-white z-10">
            
            <div className="p-5 border-b border-gray-50 shrink-0">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-4">
                <span className="text-rose-500">🌸</span> Локації допомоги
              </h2>

              {/* ПОШУК */}
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input 
                  type="text"
                  placeholder="Пошук за назвою або вулицею..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-rose-300 outline-none transition-all placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* ФІЛЬТРИ */}
              <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                {[
                  { id: 'all', label: 'Всі' },
                  { id: 'shelter', label: 'Притулки' },
                  { id: 'vet', label: 'Клініки' },
                  { id: 'volunteer', label: 'Пункти' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      setActiveFilter(filter.id);
                      setActiveLocation(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      activeFilter === filter.id 
                        ? 'bg-rose-50 text-rose-500 border border-rose-200' 
                        : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* СПИСОК ЛОКАЦІЙ */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-gray-50/30">
              {filteredLocations.length > 0 ? (
                filteredLocations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocation(loc)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 group flex gap-3 ${
                      activeLocation?.id === loc.id
                        ? 'bg-white border-rose-400 shadow-md transform scale-[1.02]'
                        : 'bg-white border-gray-100 hover:border-rose-200 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-colors ${
                      activeLocation?.id === loc.id ? 'bg-rose-100' : 'bg-gray-50 group-hover:bg-rose-50'
                    }`}>
                      {loc.icon}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className={`font-bold text-sm truncate mb-0.5 transition-colors ${
                        activeLocation?.id === loc.id ? 'text-rose-600' : 'text-gray-900 group-hover:text-rose-500'
                      }`}>
                        {loc.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1 truncate">
                        <span className="opacity-70">📍</span> {loc.address}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-10">
                  <span className="text-3xl opacity-50 block mb-2">📭</span>
                  <p className="text-sm font-bold text-gray-500">Нічого не знайдено</p>
                </div>
              )}
            </div>
          </div>

          {/* ПРАВА ПАНЕЛЬ: КАРТА */}
          <div className="flex-1 w-full h-[55%] md:h-full relative bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 -z-0">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
            </div>

            <iframe 
              src={mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full relative z-10 transition-opacity duration-500"
            ></iframe>
            
            {activeLocation && (
              <button 
                onClick={() => setActiveLocation(null)}
                className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-200 text-xs font-bold text-gray-700 hover:text-rose-500 hover:bg-white transition-all flex items-center gap-2 animate-fade-in"
              >
                <span>🌍</span> Показати все місто
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default MapPage;