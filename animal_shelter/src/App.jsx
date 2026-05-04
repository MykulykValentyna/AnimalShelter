import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Компоненти
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminRoute from './components/common/AdminRoute.jsx'; // <-- Імпорт захисту адмінки

// Сторінки
import AdminPanel from './pages/AdminPanel';
import MapPage from './pages/MapPage';
import Home from './pages/Home';
import AnimalsPage from './pages/AnimalsPage';
import AnimalDetailPage from './pages/AnimalDetailPage';
import FeedPage from './pages/FeedPage';
import MessagesPage from './pages/MessagesPage';
import DonatePage from './pages/DonatePage';
import RulesPage from './pages/RulesPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import PostDetails from './pages/PostDetails';

import { ROUTES } from './utils/constants';

const ConditionalFooter = () => {
  const location = useLocation();
  
  if (
    location.pathname === ROUTES.PROFILE || 
    location.pathname === ROUTES.MESSAGES ||
    location.pathname.includes('/animals/') 
  ) {
    return null; 
  }
  return <Footer />;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                {/* ЗАХИЩЕНИЙ МАРШРУТ АДМІНА */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } 
                />
                
                {/* ОСНОВНІ МАРШРУТИ */}
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.MAP} element={<MapPage />} />
                <Route path={ROUTES.ANIMALS} element={<AnimalsPage />} />
                <Route path={ROUTES.ANIMAL_DETAIL} element={<AnimalDetailPage />} />
                <Route path={ROUTES.FEED} element={<FeedPage />} />
                <Route path={ROUTES.MESSAGES} element={<MessagesPage />} />
                <Route path={ROUTES.DONATE} element={<DonatePage />} />
                <Route path={ROUTES.RULES} element={<RulesPage />} />
                <Route path={ROUTES.CONTACT} element={<ContactPage />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                
                {/* МАРШРУТИ З ПАРАМЕТРАМИ (ДЕТАЛІ) */}
                <Route path="/posts/:id" element={<PostDetails />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/messages/:id" element={<MessagesPage />} />
              </Routes>
            </main>

            <ConditionalFooter />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;