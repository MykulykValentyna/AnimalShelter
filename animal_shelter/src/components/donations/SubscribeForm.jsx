import React, { useState } from 'react';

const SubscribeForm = ({ onSubmit }) => {
  const [selectedAmount, setSelectedAmount] = useState(200);
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetAmounts = [100, 200, 500, 1000, 2000];

  const handlePresetClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const currentAmount = customAmount ? Number(customAmount) : selectedAmount;
  const platformFee = currentAmount ? (currentAmount * 0.05).toFixed(0) : 0;
  const shelterAmount = currentAmount ? (currentAmount - platformFee).toFixed(0) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (onSubmit && currentAmount > 0) {
      await onSubmit({ amount: currentAmount, currency: 'UAH', type: 'subscription' });
    }
    
    setIsSubmitting(false);
    setSelectedAmount(200);
    setCustomAmount('');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-purple-100 shadow-xl shadow-purple-100/50 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500"></div>
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-200 to-rose-200 rounded-full flex items-center justify-center shadow-sm mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V8" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Щомісячна підписка
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Станьте янголом-охоронцем для хвостиків на постійній основі
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
            Сума щомісячного внеску (₴)
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                className={`py-3 rounded-2xl font-bold text-base transition-all duration-200 ${
                  selectedAmount === amount
                    ? 'bg-gradient-to-r from-purple-600 to-rose-500 text-white shadow-md transform scale-105'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
          
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <span className="text-gray-500 font-bold">₴</span>
            </div>
            <input
              type="number"
              min="1"
              step="1"
              value={customAmount}
              onChange={handleCustomChange}
              placeholder="Інша сума"
              className={`w-full bg-gray-50 border ${customAmount ? 'border-purple-400 ring-2 ring-purple-100' : 'border-gray-200'} text-gray-900 text-lg font-bold rounded-2xl pl-10 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all`}
            />
          </div>
        </div>

        {currentAmount > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-purple-50/50 rounded-2xl p-4 border border-purple-100/50 mt-6 animate-fade-in">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Прозорість розподілу</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Допомога тваринкам (95%)
                </span>
                <span className="font-bold text-gray-900">₴{shelterAmount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Підтримка платформи (5%)
                </span>
                <span className="font-bold text-gray-900">₴{platformFee}</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || currentAmount <= 0}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white font-bold rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-8"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <span>Оформити підписку</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SubscribeForm;