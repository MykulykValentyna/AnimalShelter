import React, { useState } from 'react';

const PostForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('offer_help');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (onSubmit) {
      await onSubmit({ title, content, type });
    }

    setTitle('');
    setContent('');
    setType('offer_help');
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xl shadow-rose-100/50">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🌸</span>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Створити публікацію
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
            Тип публікації
          </label>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-base font-medium rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all cursor-pointer"
              required
            >
              <option value="offer_help">Пропоную допомогу</option>
              <option value="looking_for_home">Шукаю дім для тваринки</option>
              <option value="financial_help_animal">Потребую фінансової допомоги (Збір)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {type === 'financial_help_animal' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start animate-fade-in">
            <svg className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-amber-700 font-medium leading-relaxed">
              Публікації про фінансові збори потребують попередньої перевірки адміністраторами платформи. Пост буде опубліковано після успішної модерації.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
            Заголовок
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Коротко про головне..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
            Деталі
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Опишіть ситуацію детальніше..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-2xl px-5 py-4 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
            required
            maxLength={2000}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !content.trim()}
          className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <span>Опублікувати</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PostForm;