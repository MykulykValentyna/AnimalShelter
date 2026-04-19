import React, { useState } from 'react';

const DonatePage = () => {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');

  // Дані для нашої "Банки"
  const targetAmount = 100000;
  const currentAmount = 65420;
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleDonate = (e) => {
    e.preventDefault();
    const finalAmount = customAmount || selectedAmount;
    if (!finalAmount) return;
    
    // Тут буде логіка переходу на платіжну систему (Monobank, LiqPay тощо)
    alert(`Дякуємо! Перенаправлення на оплату ${finalAmount} ₴... 🌸`);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 pt-12 pb-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Ліва колонка: Текст та мотивація */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/50 border border-rose-100 shadow-sm">
            <span className="text-rose-500">💖</span>
            <span className="text-sm font-bold text-rose-600 uppercase tracking-widest">
              Благодійний фонд
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
            Твоя підтримка <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
              рятує життя
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Кожна гривня йде на закупівлю корму, оплату складних операцій та облаштування теплих вольєрів для хвостиків, які постраждали від війни. Зроби свій внесок у добре майбутнє.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-white p-4 rounded-2xl border border-rose-50 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-2xl shrink-0">🏥</div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900">Лікування</h4>
                <p className="text-xs text-gray-500">Медикаменти та операції</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-purple-50 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl shrink-0">🥣</div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900">Харчування</h4>
                <p className="text-xs text-gray-500">Спецкорми для малюків</p>
              </div>
            </div>
          </div>
        </div>

        {/* Права колонка: Віджет Банки */}
        <div className="w-full lg:w-[480px] shrink-0">
          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-rose-100 shadow-2xl shadow-rose-100/50 p-8 relative overflow-hidden">
            {/* Декоративний градієнт на фоні */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-rose-100/50 to-purple-100/50 -z-10"></div>
            
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-md mx-auto mb-4 border-4 border-rose-50">
                🐾
              </div>
              <h2 className="text-2xl font-black text-gray-900">Велика банка добра</h2>
              <p className="text-gray-500 text-sm font-medium mt-1">Ціль: Теплі вольєри на зиму</p>
            </div>

            {/* Прогрес бар (як у Монобанку) */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Зібрано</p>
                  <p className="text-2xl font-black text-gray-900">{currentAmount.toLocaleString('uk-UA')} ₴</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase">Ціль</p>
                  <p className="text-lg font-bold text-gray-500">{targetAmount.toLocaleString('uk-UA')} ₴</p>
                </div>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Вибір суми */}
            <form onSubmit={handleDonate} className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {[50, 100, 200, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountClick(amount)}
                    className={`py-3 px-2 rounded-2xl font-bold text-sm transition-all duration-200 border-2 ${
                      selectedAmount === amount
                        ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-sm scale-105'
                        : 'border-gray-100 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50/30'
                    }`}
                  >
                    {amount} ₴
                  </button>
                ))}
                <div className="relative">
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Інша"
                    className={`w-full h-full py-3 px-2 rounded-2xl font-bold text-sm text-center outline-none transition-all duration-200 border-2 ${
                      customAmount 
                        ? 'border-purple-500 bg-purple-50 text-purple-600 shadow-sm scale-105' 
                        : 'border-gray-100 bg-white text-gray-600 focus:border-purple-300'
                    }`}
                  />
                </div>
              </div>

              {/* Кнопка оплати */}
              <button
                type="submit"
                disabled={!selectedAmount && !customAmount}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white font-black text-lg shadow-xl shadow-gray-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                <span>Поповнити банку</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Безпечні платежі
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default DonatePage;