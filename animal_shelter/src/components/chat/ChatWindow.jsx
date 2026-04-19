import React, { useState, useRef, useEffect } from 'react';

const ChatWindow = ({ chat, messages = [], currentUser, onSendMessage, onDeleteChat, onToggleMute }) => {
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Виправлення стрибків сторінки: скролимо тільки сам контейнер повідомлень
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, chat]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  // Закриття меню при кліку за межами
  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    if (showMenu) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim() && onSendMessage) {
      onSendMessage(inputText.trim(), 'text');
      setInputText('');
    }
  };

  // Обробка файлів
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && onSendMessage) {
      const isImage = file.type.startsWith('image/');
      const fileUrl = URL.createObjectURL(file); // Створюємо тимчасове посилання для відображення
      onSendMessage(file.name, isImage ? 'image' : 'file', fileUrl);
    }
    e.target.value = ''; // Очищаємо інпут, щоб можна було завантажити той самий файл ще раз
  };

  const formatTime = (dateString) => {
    try {
      return new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateString || Date.now()));
    } catch (e) {
      return '';
    }
  };

  if (!chat) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-3xl border border-rose-100 shadow-xl p-12 text-center animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-tr from-rose-100 via-purple-50 to-rose-100 rounded-full flex items-center justify-center shadow-inner mb-6">
          <span className="text-5xl animate-bounce">🌸</span>
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">Оберіть діалог</h3>
        <p className="text-gray-500 font-medium max-w-xs mx-auto">
          Тут з'явиться ваша історія допомоги та спілкування з притулками
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white/90 backdrop-blur-md rounded-3xl border border-rose-100 shadow-2xl overflow-hidden relative">
      
      {/* Шапка чату */}
      <div className="px-6 py-4 border-b border-rose-100 bg-white/50 flex items-center justify-between shrink-0 z-10 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-200 to-purple-200 flex items-center justify-center shadow-sm border-2 border-white overflow-hidden">
              <span className="text-lg font-black text-rose-600">
                {chat.contactName?.charAt(0).toUpperCase() || '👤'}
              </span>
            </div>
            {chat.isOnline && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-gray-900 leading-none mb-1">{chat.contactName}</h3>
              {chat.isMuted && <span className="text-sm">🔕</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${chat.isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {chat.isOnline ? 'В мережі' : 'Не в мережі'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Три крапки: Меню */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 transition-all rounded-xl ${showMenu ? 'bg-rose-100 text-rose-600' : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50 animate-fade-in origin-top-right">
              <button 
                onClick={() => { onToggleMute(chat.id); setShowMenu(false); }}
                className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center gap-2"
              >
                {chat.isMuted ? '🔔 Увімкнути сповіщення' : '🔕 Вимкнути сповіщення'}
              </button>
              <div className="border-t border-rose-50 my-1"></div>
              <button 
                onClick={() => { onDeleteChat(chat.id); setShowMenu(false); }}
                className="w-full text-left px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                🗑 Видалити чат
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Область повідомлень */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-gray-50/50 to-white">
        {messages.map((msg, index) => {
          const isMine = msg.senderId === currentUser?.id;
          
          return (
            <div key={msg.id || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`max-w-[80%] md:max-w-[70%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`px-5 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed font-medium transition-all ${
                    isMine 
                      ? 'bg-gradient-to-br from-rose-500 to-purple-600 text-white rounded-tr-none shadow-rose-200' 
                      : 'bg-white border border-rose-50 text-gray-800 rounded-tl-none shadow-gray-100'
                  }`}
                >
                  {/* Відображення різних типів повідомлень */}
                  {msg.type === 'image' ? (
                    <div className="flex flex-col gap-2">
                      <img src={msg.fileUrl} alt="attachment" className="max-w-full h-auto max-h-48 rounded-xl object-cover cursor-pointer hover:opacity-90" />
                      <span className="text-xs opacity-80">{msg.text}</span>
                    </div>
                  ) : msg.type === 'file' ? (
                    <div className="flex items-center gap-2 bg-white/20 p-2 rounded-xl">
                      <span className="text-xl">📎</span>
                      <span className="underline truncate max-w-[200px]">{msg.text}</span>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-1.5 px-1 uppercase tracking-widest">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Поле вводу */}
      <div className="p-4 bg-white/80 border-t border-rose-100 shrink-0 backdrop-blur-sm">
        <form onSubmit={handleSend} className="flex items-end gap-3 max-w-5xl mx-auto">
          
          {/* Кнопка скріпки для файлів */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="shrink-0 p-3 text-gray-400 hover:text-purple-500 transition-all rounded-2xl hover:bg-purple-50 group"
            title="Прикріпити файл"
          >
            <svg className="w-6 h-6 group-hover:-rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
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

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="shrink-0 p-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:shadow-none"
          >
            <svg className="w-5 h-5 rotate-90 translate-x-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;