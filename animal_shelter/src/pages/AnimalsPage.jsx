import React, { useState, useEffect } from 'react';
import SearchBar from '../components/animals/SearchBar';
import AnimalCard from '../components/animals/AnimalCard';

const AnimalsPage = () => {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockAnimals = [
    {
      id: '1',
      name: 'Марсик',
      species: 'cat',
      age: 2,
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      name: 'Рекс',
      species: 'dog',
      age: 1,
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      name: 'Луна',
      species: 'cat',
      age: 4,
      imageUrl: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '4',
      name: 'Барон',
      species: 'dog',
      age: 6,
      imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '5',
      name: 'Мілка',
      species: 'cat',
      age: 1,
      imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '6',
      name: 'Арчі',
      species: 'dog',
      age: 3,
      imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const fetchAnimals = async (filters = {}) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = [...mockAnimals];
      
      if (filters.species) {
        filtered = filtered.filter(a => a.species === filters.species);
      }
      if (filters.maxAge) {
        filtered = filtered.filter(a => a.age <= parseInt(filters.maxAge));
      }
      
      setAnimals(filtered);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleSearch = (filters) => {
    fetchAnimals(filters);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-rose-100 shadow-sm mb-6">
            <span className="text-xl">🐾</span>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 uppercase tracking-wider">
              Адопція
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Знайди свого ідеального друга
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Ці хвостики чекають на свою людину. Скористайтеся фільтрами, щоб знайти тваринку, яка ідеально підійде для вашого дому.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 rounded-lg w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-2xl w-full mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : animals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {animals.map(animal => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-rose-200 p-16 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto bg-rose-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Тваринок не знайдено</h3>
            <p className="text-gray-500 text-lg">
              За вашими критеріями зараз немає хвостиків. Спробуйте змінити фільтри пошуку.
            </p>
            <button 
              onClick={() => fetchAnimals()}
              className="mt-8 px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors duration-200"
            >
              Скинути фільтри
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalsPage;