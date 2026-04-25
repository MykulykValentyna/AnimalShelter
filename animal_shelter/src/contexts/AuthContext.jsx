import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('activeUser');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const checkLoginExists = (login) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(u => u.login.toLowerCase() === login.toLowerCase());
  };

  const checkEmailExists = (email) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (checkLoginExists(userData.login) || checkEmailExists(userData.email)) {
      return { success: false, message: 'Користувач вже існує!' };
    }
    const newUser = { ...userData, avatar: null };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('activeUser', JSON.stringify(newUser));
    setCurrentUser(newUser);
    return { success: true };
  };

  const login = (emailOrLogin, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
      (u.email.toLowerCase() === emailOrLogin.toLowerCase() || u.login.toLowerCase() === emailOrLogin.toLowerCase()) && 
      u.password === password
    );
    if (user) {
      localStorage.setItem('activeUser', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, message: 'Невірний логін або пароль' };
  };

  const logout = () => {
    localStorage.removeItem('activeUser');
    setCurrentUser(null);
  };

  const updateUser = (updatedData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => u.login === currentUser.login ? { ...u, ...updatedData } : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    const newActiveUser = { ...currentUser, ...updatedData };
    localStorage.setItem('activeUser', JSON.stringify(newActiveUser));
    setCurrentUser(newActiveUser);
    return { success: true };
  };

  const deleteUser = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.filter(u => u.login !== currentUser.login);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    logout();
  };

  // --- ПОКРАЩЕНА ЛОГІКА ПОСТІВ ТА МОДЕРАЦІЇ ---
  const addPost = (postData) => {
    const posts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    const newPostId = Date.now();
    
    const newPost = {
      ...postData,
      id: newPostId,
      authorLogin: currentUser.login,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      status: 'pending', // Відразу йде на модерацію
      date: new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date())
    };
    posts.push(newPost);
    localStorage.setItem('userPosts', JSON.stringify(posts));

    // ІМІТАЦІЯ МОДЕРАЦІЇ (Через 5 секунд)
    setTimeout(() => {
      const currentPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
      const postIndex = currentPosts.findIndex(p => p.id === newPostId);
      
      if (postIndex > -1) {
        // У 95% випадків пост схвалюється
        const isApproved = Math.random() > 0.05; 
        currentPosts[postIndex].status = isApproved ? 'published' : 'rejected';
        localStorage.setItem('userPosts', JSON.stringify(currentPosts));

        // Відправляємо системне повідомлення в чат
        const allChats = JSON.parse(localStorage.getItem('app_chats') || '[]');
        let adminChat = allChats.find(chat => 
          chat.participants.some(p => p.login === currentUser.login) &&
          chat.participants.some(p => p.login === 'admin_support')
        );

        if (!adminChat) {
          adminChat = {
            id: `chat_admin_${Date.now()}`,
            createdAt: new Date().toISOString(),
            participants: [
              { login: currentUser.login, name: currentUser.name },
              { login: 'admin_support', name: 'Служба Підтримки' }
            ],
            messages: []
          };
          allChats.push(adminChat);
        }

        const adminMsg = {
          id: Date.now(),
          senderLogin: 'admin_support',
          text: isApproved 
            ? `✅ Ваш пост "${postData.title}" успішно пройшов модерацію та був опублікований на платформі!` 
            : `❌ На жаль, ваш пост "${postData.title}" був відхилений модератором. Перевірте правильність заповнення даних.`,
          timestamp: new Date().toISOString(),
          read: false
        };

        const chatIndex = allChats.findIndex(c => c.id === adminChat.id);
        if(chatIndex > -1) {
          allChats[chatIndex].messages.push(adminMsg);
        }
        localStorage.setItem('app_chats', JSON.stringify(allChats));

        // Сигнал додатку оновити інтерфейс (щоб з'явилася циферка сповіщення)
        window.dispatchEvent(new Event('app_data_updated'));
      }
    }, 5000); // Затримка 5 секунд для реалізму
  };

  const getUserPosts = (login) => {
    const posts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    return posts.filter(p => p.authorLogin === login).sort((a, b) => b.id - a.id);
  };

  const getGlobalUnreadCount = () => {
    if (!currentUser) return 0;
    const allChats = JSON.parse(localStorage.getItem('app_chats') || '[]');
    let count = 0;
    allChats.forEach(chat => {
      if (chat.participants.some(p => p.login === currentUser.login)) {
        chat.messages.forEach(m => {
          if (m.senderLogin !== currentUser.login && !m.read) count++;
        });
      }
    });
    return count;
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, register, login, logout, checkLoginExists, checkEmailExists, 
      updateUser, deleteUser, addPost, getUserPosts, getGlobalUnreadCount 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);