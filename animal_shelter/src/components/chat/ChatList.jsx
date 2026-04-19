import React from 'react';

const ChatList = ({ chats = [], onSelectChat, activeChatId }) => {
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' }).format(date);
      }
      return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short' }).format(date);
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white/90 backdrop-blur-md rounded-3xl border border-rose-100 shadow-xl shadow-rose-100/30 overflow-hidden">
      <div className="p-6 border-b border-rose-100 bg-white/50 shrink-0">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 flex items-center gap-2">
          <span className="text-3xl">🌸</span>
          Мої чати
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium tracking-tight">
              У вас поки немає <br /> активних діалогів
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-rose-50">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onSelectChat(chat)}
                  className={`w-full flex items-center gap-4 p-4 transition-all duration-300 text-left relative overflow-hidden group ${
                    activeChatId === chat.id 
                      ? 'bg-rose-50/80 border-l-4 border-rose-500 pl-3' 
                      : 'hover:bg-rose-50/30 border-l-4 border-transparent pl-3'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-200 to-purple-200 flex items-center justify-center shadow-sm border-2 border-white transition-transform group-hover:scale-105">
                      <span className="text-lg font-bold text-rose-600">
                        {chat.contactName?.charAt(0).toUpperCase() || '👤'}
                      </span>
                    </div>
                    {chat.isOnline && (
                      <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm animate-pulse"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className={`text-base font-bold truncate transition-colors ${
                          activeChatId === chat.id ? 'text-gray-900' : 'text-gray-800'
                        }`}>
                          {chat.contactName}
                        </h3>
                        {chat.isMuted && <span className="text-[12px] shrink-0 opacity-70">🔕</span>}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2 uppercase tracking-tighter">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-sm truncate leading-snug ${
                        chat.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'
                      }`}>
                        {chat.lastMessage}
                      </p>
                      
                      {chat.unreadCount > 0 && !chat.isMuted && (
                        <span className="shrink-0 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-rose-200">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatList;