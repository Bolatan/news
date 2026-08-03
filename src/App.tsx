import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ArticlePage from '@/pages/ArticlePage';
import CategoryPage from '@/pages/CategoryPage';
import CommunityPage from '@/pages/CommunityPage';
import SearchPage from '@/pages/SearchPage';
import AdminPage from '@/pages/AdminPage';
import TagPage from '@/pages/TagPage';
import AboutUsPage from '@/pages/AboutUsPage';
import ContactPage from '@/pages/ContactPage';
import AdvertisePage from '@/pages/AdvertisePage';
import CareersPage from '@/pages/CareersPage';
import EditorialStandardsPage from '@/pages/EditorialStandardsPage';
import LoginPage from '@/pages/LoginPage';

export default function App() {
  const [route, setRoute] = useState('/');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('igbe_is_admin') === 'true';
  });

  const navigate = useCallback((path: string) => {
    setRoute(path);
    window.scrollTo(0, 0);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    localStorage.setItem('igbe_is_admin', 'true');
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('igbe_is_admin');
    setIsLoggedIn(false);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (route === '/admin' && !isLoggedIn) {
      navigate('/login');
    }
  }, [route, isLoggedIn, navigate]);

  const renderPage = () => {
    if (route === '/admin') {
      return isLoggedIn ? <AdminPage onLogout={handleLogout} /> : null;
    }
    if (route === '/') {
      return <HomePage onNavigate={navigate} />;
    }
    if (route === '/about') {
      return <AboutUsPage onNavigate={navigate} />;
    }
    if (route === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    if (route === '/advertise') {
      return <AdvertisePage onNavigate={navigate} />;
    }
    if (route === '/careers') {
      return <CareersPage onNavigate={navigate} />;
    }
    if (route === '/editorial-standards') {
      return <EditorialStandardsPage onNavigate={navigate} />;
    }
    if (route === '/login') {
      return <LoginPage onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />;
    }
    if (route.startsWith('/article/')) {
      const slug = route.replace('/article/', '');
      return <ArticlePage slug={slug} onNavigate={navigate} />;
    }
    if (route.startsWith('/category/')) {
      const slug = route.replace('/category/', '');
      return <CategoryPage slug={slug} onNavigate={navigate} />;
    }
    if (route.startsWith('/community/')) {
      const slug = route.replace('/community/', '');
      return <CommunityPage slug={slug} onNavigate={navigate} />;
    }
    if (route.startsWith('/tag/')) {
      const tag = route.replace('/tag/', '');
      return <TagPage tag={tag} onNavigate={navigate} />;
    }
    if (route.startsWith('/search')) {
      const url = new URL(`http://x${route}`);
      const q = url.searchParams.get('q') ?? '';
      return <SearchPage query={q} onNavigate={navigate} />;
    }
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        onNavigate={navigate}
        currentPath={route}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
