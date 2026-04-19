import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import AnimalsPage from './pages/AnimalsPage';
import DonatePage from './pages/DonatePage';
import FeedPage from './pages/FeedPage';
import PostDetails from './pages/PostDetails';
import RulesPage from './pages/RulesPage';
import ContactPage from './pages/ContactPage';
import MapPage from './pages/MapPage';
import MessagesPage from './pages/MessagesPage';
import AdminPanel from './pages/AdminPanel';
import ProfilePage from './pages/ProfilePage';

import { ROUTES } from './utils/constants';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.ANIMALS} element={<AnimalsPage />} />
                <Route path={ROUTES.DONATE} element={<DonatePage />} />
                <Route path={ROUTES.FEED} element={<FeedPage />} />
                <Route path={`${ROUTES.FEED}/:id`} element={<PostDetails />} />
                <Route path={ROUTES.RULES} element={<RulesPage />} />
                <Route path={ROUTES.CONTACT} element={<ContactPage />} />
                <Route path={ROUTES.MAP} element={<MapPage />} />
                <Route path={ROUTES.MESSAGES} element={<MessagesPage />} />
                <Route path={ROUTES.ADMIN} element={<AdminPanel />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;