import React, { useState, useEffect } from 'react';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageGroups, setMessageGroups] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = { id: 'user-123', name: 'Валентина' };

  useEffect(() => {
    const loadInitialData = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockChats = [
          { id: 'chat-1', contactName: 'Олена Волонтер', lastMessage: 'Дякуємо за допомогу з кормом!', lastMessageTime: new Date().toISOString(), unreadCount: 2, isOnline: true, isMuted: false },
          { id: 'chat-2', contactName: 'Ветклініка "Лев"', lastMessage: 'Запис на щеплення підтверджено на 14:00', lastMessageTime: new Date(Date.now() - 86400000).toISOString(), unreadCount: 0, isOnline: false, isMuted: false },
          { id: 'chat-3', contactName: 'Андрій (Притулок)', lastMessage: 'Ви зможете приїхати у суботу?', lastMessageTime: new Date(Date.now() - 172800000).toISOString(), unreadCount: 0, isOnline: true, isMuted: false }
        ];

        const mockMessages = {
          'chat-1': [
            { id: 'm1', senderId: 'chat-1', text: 'Вітаю! Ви бачили наш пост про збір?', type: 'text', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 'm2', senderId: 'user-123', text: 'Так, вже надіслала внесок. Сподіваюся, ви швидко зберете потрібну суму.', type: 'text', timestamp: new Date(Date.now() - 3000000).toISOString() },
            { id: 'm3', senderId: 'chat-1', text: 'Дякуємо за допомогу з кормом!', type: 'text', timestamp: new Date().toISOString() }
          ],
          'chat-2': [
            { id: 'm4', senderId: 'chat-2', text: 'Запис на щеплення підтверджено на 14:00', type: 'text', timestamp: new Date(Date.now() - 86400000).toISOString() }
          ],
          'chat-3': [
            { id: 'm6', senderId: 'chat-3', text: 'Ви зможете приїхати у суботу?', type: 'text', timestamp: new Date(Date.now() - 172800000).toISOString() }
          ]
        };

        setChats(mockChats);
        setMessageGroups(mockMessages);
        setIsLoading(false);
      }, 800);
    };

    loadInitialData();
  }, []);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setChats(prevChats => prevChats.map(c => 
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  // Оновлена функція відправки: тепер приймає тип і URL файлу
  const handleSendMessage = (text, type = 'text', fileUrl = null) => {
    if (!activeChat) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: text,
      type: type,
      fileUrl: fileUrl,
      timestamp: new Date().toISOString()
    };

    setMessageGroups(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
    }));
    
    setChats(prevChats => prevChats.map(c => 
      c.id === activeChat.id 
        ? { ...c, lastMessage: type === 'text' ? text : '📁 ' + text, lastMessageTime: new Date().toISOString(), unreadCount: 0 }
        : c
    ));
  };

  const handleDeleteChat = (chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    const newMsgGroups = { ...messageGroups };
    delete newMsgGroups[chatId];
    setMessageGroups(newMsgGroups);
    if (activeChat?.id === chatId) setActiveChat(null);
  };

  const handleToggleMute = (chatId) => {
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, isMuted: !c.isMuted } : c
    ));
    if (activeChat?.id === chatId) {
      setActiveChat(prev => ({ ...prev, isMuted: !prev.isMuted }));
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 pt-8 pb-12 px-4 transition-colors duration-300 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto h-[750px] flex flex-col md:flex-row gap-6">
        
        <div className="w-full md:w-80 lg:w-96 shrink-0 h-full">
          {isLoading ? (
            <div className="w-full h-full bg-white rounded-3xl border border-rose-100 animate-pulse p-6 space-y-6 shadow-xl">
              <div className="h-8 bg-gray-100 rounded-xl w-1/2 mb-8"></div>
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ChatList 
              chats={chats} 
              onSelectChat={handleSelectChat} 
              activeChatId={activeChat?.id} 
            />
          )}
        </div>

        <div className="flex-1 h-full min-w-0">
          <ChatWindow 
            chat={activeChat} 
            messages={activeChat ? messageGroups[activeChat.id] || [] : []} 
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onDeleteChat={handleDeleteChat}
            onToggleMute={handleToggleMute}
          />
        </div>

      </div>
    </div>
  );
};

export default MessagesPage;