import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });

  useEffect(() => {
    const fetchAdminData = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockPending = [
          {
            id: 'post-101',
            title: 'Збір на операцію для врятованого пса',
            authorName: 'Волонтер Анна',
            content: 'Терміново потрібні кошти на операцію після ДТП. Клініка виставила рахунок на 15 000 грн.',
            type: 'financial_help_animal',
            createdAt: new Date().toISOString()
          },
          {
            id: 'post-102',
            title: 'Харчування для кошенят з гаражів',
            authorName: 'Микола І.',
            content: 'Знайшли 5 кошенят, потрібна допомога з покупкою замінника котячого молока.',
            type: 'financial_help_animal',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ];
        setPendingPosts(mockPending);
        setStats({ total: 124, verified: 89, pending: mockPending.length });
        setIsLoading(false);
      }, 700);
    };
    fetchAdminData();
  }, []);

  const handleAction = (id, action) => {
    setPendingPosts(pendingPosts.filter(post => post.id !== id));
    setStats(prev => ({
      ...prev,
      pending: prev.pending - 1,
      verified: action === 'approve' ? prev.verified + 1 : prev.verified
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-rose-100 shadow-sm mb-4">
              <span className="text-xl">🛡️</span>
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Панель модератора</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Керування контентом</h1>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Усього', val: stats.total, color: 'text-gray-900' },
              { label: 'Схвалено', val: stats.verified, color: 'text-emerald-500' },
              { label: 'Черга', val: stats.pending, color: 'text-rose-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-white px-5 py-3 rounded-2xl border border-rose-100 shadow-sm text-center">
                <div className={`text-xl font-black ${stat.color}`}>{stat.val}</div>
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-rose-100 shadow-xl shadow-rose-100/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-rose-50 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-xl font-bold text-gray-800">Запити на фінансову допомогу</h2>
            <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              Потребують уваги
            </span>
          </div>

          <div className="divide-y divide-rose-50">
            {isLoading ? (
              [1, 2].map(n => <div key={n} className="h-40 animate-pulse bg-gray-50/50"></div>)
            ) : pendingPosts.length > 0 ? (
              pendingPosts.map((post) => (
                <div key={post.id} className="p-8 hover:bg-rose-50/20 transition-colors">
                  <div className="flex flex-col lg:flex-row gap-8 justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center font-bold text-rose-600 border border-white">
                          {post.authorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none">{post.authorName}</p>
                          <p className="text-xs text-gray-400 mt-1">Сьогодні, о 14:20</p>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">{post.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{post.content}</p>
                    </div>

                    <div className="flex lg:flex-col gap-3 shrink-0 justify-end">
                      <button 
                        onClick={() => handleAction(post.id, 'approve')}
                        className="flex-1 lg:w-40 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        Схвалити
                      </button>
                      <button 
                        onClick={() => handleAction(post.id, 'reject')}
                        className="flex-1 lg:w-40 py-3 bg-white text-rose-500 border-2 border-rose-100 hover:border-rose-300 font-bold rounded-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Відхилити
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Черга порожня</h3>
                <p className="text-gray-500">Всі публікації опрацьовано. Гарна робота!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;