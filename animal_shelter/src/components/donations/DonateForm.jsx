import React, { useState } from 'react';

const DonateForm = ({ onSubmit }) => {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetAmounts = [50, 100, 200, 500, 1000];

  const handlePresetClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalAmount = customAmount ? Number(customAmount) : selectedAmount;
    
    if (onSubmit && finalAmount > 0) {
      await onSubmit({ amount: finalAmount, currency: 'UAH', type: 'one-time' });
    }
    
    setIsSubmitting(false);
    setSelectedAmount(100);
    setCustomAmount('');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-rose-100 shadow-xl shadow-rose-100/50">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-rose-200 to-purple-200 rounded-full flex items-center justify-center shadow-sm mb-4">
          <span className="text-3xl">🌸</span>
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Разова допомога
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Ваш внесок допоможе забезпечити хвостиків їжею та лікуванням
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
            Оберіть суму (₴)
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                className={`py-3 rounded-2xl font-bold text-base transition-all duration-200 ${
                  selectedAmount === amount
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md transform scale-105'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
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
              className={`w-full bg-gray-50 border ${customAmount ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-200'} text-gray-900 text-lg font-bold rounded-2xl pl-10 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || (!selectedAmount && !customAmount) || Number(customAmount) <= 0}
          className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-8"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <span>Підтримати</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DonateForm;