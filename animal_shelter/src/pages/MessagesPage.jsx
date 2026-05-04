import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';
import apiClient from '../services/apiClient'; // <--- ДОДАНО: Перевір шлях до файлу apiClient!

// --- КОМПОНЕНТ СПИСКУ ЧАТІВ ---
const ChatList = ({ chats = [], onSelectChat, activeChatId, onOpenSearch }) => {
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
      <div className="p-6 border-b border-rose-100 bg-white/50 shrink-0 flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 flex items-center gap-2">
          <span className="text-3xl">🌸</span>
          Мої чати
        </h2>
        <button 
          onClick={onOpenSearch}
          className="w-10 h-10 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
          title="Створити чат"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium tracking-tight">У вас поки немає <br /> активних діалогів</p>
            <button onClick={onOpenSearch} className="text-rose-500 font-bold text-sm hover:underline">Знайти когось</button>
          </div>
        ) : (
          <ul className="divide-y divide-rose-50">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onSelectChat(chat)}
                  className={`w-full flex items-center gap-4 p-4 transition-all duration-300 text-left relative overflow-hidden group ${
                    activeChatId === chat.id ? 'bg-rose-50/80 border-l-4 border-rose-500 pl-3' : 'hover:bg-rose-50/30 border-l-4 border-transparent pl-3'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-200 to-purple-200 flex items-center justify-center shadow-sm border-2 border-white transition-transform group-hover:scale-105 overflow-hidden">
                      {chat.contactAvatar ? (
                        <img src={chat.contactAvatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-rose-600">{chat.contactName?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-base font-bold truncate transition-colors ${activeChatId === chat.id || chat.unreadCount > 0 ? 'text-gray-900' : 'text-gray-800'}`}>
                        {chat.contactName}
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2 uppercase tracking-tighter">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-sm truncate leading-snug ${chat.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                        {chat.lastMessage || 'Немає повідомлень'}
                      </p>
                      
                      {chat.unreadCount > 0 && (
                        <span className="shrink-0 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-rose-200 min-w-[20px] text-center">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
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

// --- КОМПОНЕНТ ВІКНА ЧАТУ ---
const ChatWindow = ({ chat, currentUser, onSendMessage, onDeleteChat }) => {
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
  }, [chat?.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    if (showMenu) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim() && onSendMessage) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const formatTime = (dateString) => {
    try {
      return new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateString || Date.now()));
    } catch (e) { return ''; }
  };

  if (!chat) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-3xl border border-rose-100 shadow-xl p-12 text-center animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-tr from-rose-100 via-purple-50 to-rose-100 rounded-full flex items-center justify-center shadow-inner mb-6">
          <span className="text-5xl animate-bounce">🌸</span>
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">Оберіть діалог</h3>
        <p className="text-gray-500 font-medium max-w-xs mx-auto">Тут з'явиться ваша історія допомоги та спілкування</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white/90 backdrop-blur-md rounded-3xl border border-rose-100 shadow-2xl overflow-hidden relative">
      <div className="px-6 py-4 border-b border-rose-100 bg-white/50 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-200 to-purple-200 flex items-center justify-center shadow-sm border-2 border-white overflow-hidden">
            {chat.contactAvatar ? (
              <img src={chat.contactAvatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-black text-rose-600">{chat.contactName?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 leading-none mb-1">{chat.contactName}</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">@{chat.contactLogin}</span>
          </div>
        </div>
        
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setShowMenu(!showMenu)} className={`p-2 transition-all rounded-xl ${showMenu ? 'bg-rose-100 text-rose-600' : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50 animate-fade-in">
              <button onClick={() => { onDeleteChat(chat.id); setShowMenu(false); }} className="w-full text-left px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                🗑 Видалити чат
              </button>
            </div>
          )}
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-gray-50/50 to-white">
        {chat.messages.length === 0 && <div className="text-center text-gray-400 text-sm mt-10">Напишіть перше повідомлення...</div>}
        {chat.messages.map((msg) => {
          const isMine = msg.senderLogin === currentUser?.login;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`max-w-[80%] md:max-w-[70%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed font-medium transition-all ${
                  isMine ? 'bg-gradient-to-br from-rose-500 to-purple-600 text-white rounded-tr-none shadow-rose-200' : 'bg-white border border-rose-50 text-gray-800 rounded-tl-none shadow-gray-100'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-1.5 px-1 uppercase tracking-widest">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-white/80 border-t border-rose-100 shrink-0 backdrop-blur-sm">
        <form onSubmit={handleSend} className="flex items-end gap-3 max-w-5xl mx-auto">
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl shadow-inner focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-200 transition-all overflow-hidden pl-2">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Напишіть повідомлення..."
              className="w-full bg-transparent border-none text-gray-800 text-base px-5 py-3 min-h-[48px] max-h-[120px] resize-none focus:outline-none focus:ring-0 custom-scrollbar font-medium"
              rows="1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
          </div>
          <button type="submit" disabled={!inputText.trim()} className="shrink-0 p-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:scale-100">
            <svg className="w-5 h-5 rotate-90 translate-x-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

// --- ГОЛОВНА СТОРІНКА ЧАТІВ ---
const MessagesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  
  // ДОДАНО: Стан для зберігання користувачів з бази даних
  const [allDbUsers, setAllDbUsers] = useState([]);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // ДОДАНО: Завантажуємо користувачів з MySQL при старті
  useEffect(() => {
    if (!currentUser) {
      navigate(ROUTES.HOME);
      return;
    }

    const fetchInitialData = async () => {
      try {
        const response = await apiClient.get('/users');
        setAllDbUsers(response.data);
      } catch (error) {
        console.error("Помилка завантаження користувачів:", error);
      }
    };

    fetchInitialData();
  }, [currentUser, navigate]);

  // Оновлюємо список чатів, коли змінюються користувачі в базі (щоб підтягнути аватарки)
  useEffect(() => {
    if (currentUser) {
      loadChats();
    }
  }, [currentUser, allDbUsers]);

  const loadChats = () => {
    const allChats = JSON.parse(localStorage.getItem('app_chats') || '[]');
    const myChats = allChats.filter(chat => chat.participants.some(p => p.login === currentUser.login));
    
    const formattedChats = myChats.map(chat => {
      const contact = chat.participants.find(p => p.login !== currentUser.login);
      
      // ВИПРАВЛЕНО: Шукаємо аватарки у справжній базі, а не в localStorage
      const contactUser = allDbUsers.find(u => u.login === contact.login) || {};
      const lastMsg = chat.messages[chat.messages.length - 1];
      
      const unreadCount = chat.messages.filter(m => m.senderLogin !== currentUser.login && !m.read).length;

      return {
        ...chat,
        contactName: contactUser.name || contact.name,
        contactLogin: contact.login,
        contactAvatar: contactUser.avatar || null,
        lastMessage: lastMsg ? lastMsg.text : '',
        lastMessageTime: lastMsg ? lastMsg.timestamp : chat.createdAt,
        unreadCount: unreadCount
      };
    }).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    setChats(formattedChats);
  };

  const selectChat = (chat) => {
    setActiveChatId(chat.id);
    
    const allChats = JSON.parse(localStorage.getItem('app_chats') || '[]');
    const chatIndex = allChats.findIndex(c => c.id === chat.id);
    
    if (chatIndex !== -1) {
      let changed = false;
      allChats[chatIndex].messages.forEach(m => {
        if (m.senderLogin !== currentUser.login && !m.read) {
          m.read = true; 
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem('app_chats', JSON.stringify(allChats));
        loadChats(); 
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2) { setFoundUsers([]); return; }
    
    // ВИПРАВЛЕНО: Шукаємо у справжній базі (allDbUsers), а не в порожньому localStorage
    const results = allDbUsers.filter(u => 
      u.login !== currentUser.login && 
      (
        (u.name && u.name.toLowerCase().includes(query.toLowerCase())) || 
        (u.login && u.login.toLowerCase().includes(query.toLowerCase()))
      )
    );
    setFoundUsers(results);
  };

  const createChat = (contact) => {
    const allChats = JSON.parse(localStorage.getItem('app_chats') || '[]');
    let existingChat = allChats.find(chat => 
      chat.participants.some(p => p.login === currentUser.login) &&
      chat.participants.some(p => p.login === contact.login)
    );

    if (!existingChat) {
      existingChat = {
        id: `chat_${Date.now()}`,
        createdAt: new Date().toISOString(),
        participants: [
          { login: currentUser.login, name: currentUser.name },
          { login: contact.login, name: contact.name }
        ],
        messages: []
      };
      allChats.push(existingChat);
      localStorage.setItem('app_chats', JSON.stringify(allChats));
    }

    loadChats();
    setActiveChatId(existingChat.id);
    setIsSearchOpen(false);
    setSearchQuery('');
    setFoundUsers([]);
  };

  const sendMessage = (text) => {
    const allChats = JSON.parse(localStorage.getItem('app_chats') || '[]');
    const chatIndex = allChats.findIndex(c => c.id === activeChatId);
    
    if (chatIndex !== -1) {
      const newMessage = {
        id: Date.now(),
        senderLogin: currentUser.login,
        text: text,
        timestamp: new Date().toISOString(),
        read: false 
      };
      allChats[chatIndex].messages.push(newMessage);
      localStorage.setItem('app_chats', JSON.stringify(allChats));
      loadChats();
    }
  };

  const deleteChat = (chatId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей діалог?')) {
      const allChats = JSON.parse(localStorage.getItem('app_chats') || '[]');
      const updatedChats = allChats.filter(c => c.id !== chatId);
      localStorage.setItem('app_chats', JSON.stringify(updatedChats));
      if (activeChatId === chatId) setActiveChatId(null);
      loadChats();
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50/50 p-4 md:p-6 gap-6 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-rose-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"></div>

      <div className="w-1/3 min-w-[320px] max-w-sm h-full z-10 hidden md:block">
        <ChatList 
          chats={chats} 
          activeChatId={activeChatId} 
          onSelectChat={selectChat} 
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      </div>

      <div className="flex-1 h-full z-10">
        <ChatWindow chat={activeChat} currentUser={currentUser} onSendMessage={sendMessage} onDeleteChat={deleteChat} />
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl relative border border-gray-100 p-6">
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-rose-500 bg-gray-50 rounded-full transition-colors">✕</button>
            <h2 className="text-xl font-black text-gray-900 mb-4">Пошук користувачів</h2>
            
            <input type="text" autoFocus value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Введіть ім'я або логін..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 outline-none text-sm font-medium mb-4" />

            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
              {searchQuery.length < 2 ? (
                <p className="text-center text-gray-400 text-sm py-4">Введіть мінімум 2 символи для пошуку</p>
              ) : foundUsers.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">Користувачів не знайдено 😔</p>
              ) : (
                foundUsers.map(user => (
                  <button key={user.login} onClick={() => createChat(user)} className="w-full flex items-center gap-3 p-3 hover:bg-rose-50 rounded-xl transition-colors text-left group border border-transparent hover:border-rose-100">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center font-bold overflow-hidden">
                      {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm group-hover:text-rose-600">{user.name}</p>
                      <p className="text-xs text-gray-400">@{user.login}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;