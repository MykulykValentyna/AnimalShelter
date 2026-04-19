import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [species, setSpecies] = useState('');
  const [maxAge, setMaxAge] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ species, maxAge });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <form 
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md border border-rose-100 rounded-3xl p-4 shadow-lg shadow-rose-100/50 flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="w-full md:flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 text-base font-medium rounded-2xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">Кого ви шукаєте?</option>
            <option value="cat">Котики</option>
            <option value="dog">Песики</option>
            <option value="other">Інші тваринки</option>
          </select>
        </div>

        <div className="w-full md:flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <select
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 text-base font-medium rounded-2xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">Будь-який вік</option>
            <option value="1">До 1 року (малюки)</option>
            <option value="3">До 3 років</option>
            <option value="5">До 5 років</option>
            <option value="10">До 10 років</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Знайти
        </button>
      </form>
    </div>
  );
};

export default SearchBar;