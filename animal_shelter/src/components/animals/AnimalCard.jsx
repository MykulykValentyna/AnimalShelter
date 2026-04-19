import React from 'react';
import { Link } from 'react-router-dom';

const AnimalCard = ({ animal }) => {
  const { id, name, species, age, imageUrl } = animal;

  const fallbackImage = species === 'cat' 
    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

  const speciesText = species === 'cat' ? 'Котик' : species === 'dog' ? 'Песик' : species;

  const getAgeText = (age) => {
    if (age === 1) return 'рік';
    if (age > 1 && age < 5) return 'роки';
    return 'років';
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageUrl || fallbackImage} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20">
          <span className="text-sm font-bold text-rose-500">{age} {getAgeText(age)}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {name}
          </h3>
          <span className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider rounded-xl border border-rose-100">
            {speciesText}
          </span>
        </div>
        
        <Link 
          to={`/animals/${id}`}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gray-50 hover:bg-gradient-to-r hover:from-rose-500 hover:to-purple-600 text-gray-700 hover:text-white rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:shadow-lg"
        >
          <span>Забрати додому</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default AnimalCard;