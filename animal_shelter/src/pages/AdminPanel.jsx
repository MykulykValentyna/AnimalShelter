import React, { useState, useEffect } from 'react';
// import { adminService } from '../services/postService'; // Тимчасово закоментовано для фронтенд-демо

// === ФЕЙКОВІ ДАНІ (Mock Data) ===
const fakePendingPosts = [
  {
    id: 'pend_1',
    type: 'looking_for_home',
    authorName: 'Анна (Волонтер)',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // Годину тому
    title: 'Знайшли двох маленьких цуценят',
    content: 'Хтось залишив коробку з двома цуценятами біля магазину. Хлопчик і дівчинка, на вигляд місяць-півтора. Віддамо тільки в надійні руки, не на ланцюг.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pend_2',
    type: 'need_financial',
    authorName: 'Притулок "Сірко"',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 години тому
    title: 'Потрібна допомога з оплатою оренди!',
    content: 'Наш притулок опинився під загрозою виселення. До кінця місяця потрібно зібрати 15 000 грн за оренду території. Якщо ми не зберемо кошти, 40 собак опиняться на вулиці. Просимо вашої допомоги!',
    image: 'https://images.unsplash.com/photo-1535090467336-9501f96eef89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pend_3',
    type: 'offer_physical',
    authorName: 'Олександр',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Вчора
    title: 'Можу зробити будки для собак',
    content: 'Маю залишки дощок після будівництва та вільний час на вихідних. Можу безкоштовно збити 3-4 утеплені будки для середніх собак. Тільки самовивіз із Броварів.',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];

const AdminPanel = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState({}); // Для збереження тексту причини для кожного поста

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setIsLoading(true);
    try {
      // --- ДЛЯ ГОТОВОГО БЕКЕНДУ РОЗКОМЕНТУЙ ЦЕ: ---
      // const data = await adminService.getPendingPosts();
      // setPendingPosts(Array.isArray(data) ? data : (data.posts || []));

      // --- ЗАГЛУШКА (Фейкові дані) ---
      setTimeout(() => {
        setPendingPosts(fakePendingPosts);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error("Доступ заборонено або помилка сервера");
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Опублікувати цей пост?")) return;
    try {
      // Імітація запиту на сервер
      // await adminService.approvePost(id);
      
      // Видаляємо схвалений пост зі списку
      setPendingPosts(prev => prev.filter(post => post.id !== id));
      alert("Пост успішно опубліковано!");
    } catch (err) { 
      alert("Помилка при схваленні"); 
    }
  };

  const handleReject = async (id) => {
    const reason = rejectReason[id];
    if (!reason || reason.length < 5) {
      alert("Вкажіть причину відхилення (мінімум 5 символів)");
      return;
    }
    try {
      // Імітація запиту на сервер
      // await adminService.rejectPost(id, reason);
      
      // Видаляємо відхилений пост зі списку
      setPendingPosts(prev => prev.filter(post => post.id !== id));
      alert("Пост відхилено. Автору надіслано повідомлення.");
    } catch (err) { 
      alert("Помилка при відхиленні"); 
    }
  };

  const badgeLabels = {
    'looking_for_home': 'Шукає дім',
    'need_financial': 'Потрібна фін. допомога',
    'need_physical': 'Потрібна фіз. допомога',
    'offer_financial': 'Пропоную фін. допомогу',
    'offer_physical': 'Пропоную фіз. допомогу',
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-24 px-4 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Панель модерації</h1>
            <p className="text-slate-500 font-medium">У черзі на перевірку: {pendingPosts.length} постів</p>
          </div>
          <div className="bg-rose-500 text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-lg shadow-rose-200">
            Admin Mode
          </div>
        </header>

        <div className="space-y-6">
          {pendingPosts.length > 0 ? (
            pendingPosts.map(post => (
              <div key={post.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col md:flex-row">
                
                {/* Мініатюра фото */}
                <div className="w-full md:w-64 bg-slate-100 relative shrink-0">
                  <img src={post.image || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-slate-700 shadow-sm border border-slate-100">
                    {badgeLabels[post.type] || post.type}
                  </div>
                </div>

                {/* Текст поста */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-400">Автор: {post.authorName} • {new Date(post.createdAt).toLocaleDateString('uk-UA')}</span>
                    <h2 className="text-2xl font-black mt-2 text-slate-900 leading-tight">{post.title}</h2>
                    <p className="text-slate-600 text-sm mt-3 line-clamp-3 leading-relaxed">"{post.content}"</p>
                  </div>

                  {/* Блок управління */}
                  <div className="mt-auto border-t border-slate-100 pt-6 flex flex-col gap-4">
                    <input 
                      type="text" 
                      placeholder="Причина відхилення (обов'язково, якщо відхиляєте)..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all font-medium placeholder-slate-400"
                      onChange={(e) => setRejectReason({...rejectReason, [post.id]: e.target.value})}
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => handleApprove(post.id)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm py-3.5 rounded-xl transition-all shadow-md shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span className="text-lg">✅</span> Схвалити та опублікувати
                      </button>
                      <button 
                        onClick={() => handleReject(post.id)}
                        className="flex-1 bg-white hover:bg-red-50 text-red-500 font-bold text-sm py-3.5 rounded-xl transition-all border border-red-200 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span className="text-lg">❌</span> Відхилити пост
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300 shadow-sm animate-fade-in">
              <span className="text-6xl mb-4 block opacity-50">☕</span>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Черга порожня!</h3>
              <p className="text-slate-500 font-medium">Всі пости перевірено. Можна випити кави та відпочити.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;