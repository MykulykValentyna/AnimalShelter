import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Фікс іконок Leaflet для Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const shelterIcon = new L.Icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

const ShelterMap = ({ locations = [], isAdmin = true }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeLocation, setActiveLocation] = useState(null);
  const [userPoints, setUserPoints] = useState([]);

  const defaultLocations = [
    { id: '1', name: "Ветклініка 'Лев'", type: "vet", lat: 49.8397, lng: 24.0297, address: "вул. Городоцька, 15", phone: "+380 97 123 4567" },
    { id: '2', name: "Пункт допомоги 'Хвостики'", type: "shelter", lat: 49.8419, lng: 24.0315, address: "вул. Івана Франка, 24", phone: "+380 63 987 6543" },
    { id: '3', name: "Центр 'Добре Серце'", type: "shelter", lat: 49.8250, lng: 24.0100, address: "вул. Стрийська, 45", phone: "+380 50 555 7788" }
  ];

  const data = [...(locations.length > 0 ? locations : defaultLocations), ...userPoints];
  const filteredData = activeFilter === 'all' ? data : data.filter(loc => loc.type === activeFilter);

  // Компонент для додавання точки кліком
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (isAdmin) {
          const name = prompt("Назва нової локації:");
          const type = prompt("Тип (shelter/vet/help):", "shelter");
          if (name) {
            setUserPoints([...userPoints, {
              id: Date.now().toString(),
              name,
              type,
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              address: "Додано користувачем"
            }]);
          }
        }
      },
    });
    return null;
  };

  return (
    <div className="w-full h-[700px] flex flex-col lg:flex-row bg-white rounded-3xl border border-rose-100 shadow-2xl overflow-hidden relative z-0">
      
      {/* Ліва панель зі списком */}
      <div className="w-full lg:w-1/3 flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-rose-100 z-10">
        <div className="p-6 border-b border-rose-100">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <span className="text-rose-500 text-3xl">🌸</span>
            Локації допомоги
          </h2>

          <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
            {['all', 'shelter', 'vet'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 py-2 px-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                  activeFilter === filter ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter === 'all' ? 'Всі' : filter === 'shelter' ? 'Притулки' : 'Клініки'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredData.map((loc) => (
            <div 
              key={loc.id}
              onClick={() => setActiveLocation(loc)}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                activeLocation?.id === loc.id
                  ? 'bg-rose-500 text-white shadow-lg scale-[1.02] border-transparent'
                  : 'bg-white border-gray-100 hover:border-rose-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{loc.name}</h3>
                <span>{loc.type === 'vet' ? '🏥' : '🏡'}</span>
              </div>
              <p className={`text-xs mt-1 ${activeLocation?.id === loc.id ? 'text-rose-100' : 'text-gray-400'}`}>
                {loc.address}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Сама Карта */}
      <div className="w-full lg:w-2/3 h-full relative z-0">
        <MapContainer center={[49.8397, 24.0297]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapEvents />
          
          {filteredData.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={shelterIcon}>
              <Popup>
                <div className="p-2 font-sans">
                  <h4 className="font-bold text-rose-500">{loc.name}</h4>
                  <p className="text-xs">{loc.address}</p>
                  {loc.phone && <p className="text-xs font-bold mt-1">{loc.phone}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ShelterMap;