import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ArticlePage from '@/pages/ArticlePage';
import CategoryPage from '@/pages/CategoryPage';
import CommunityPage from '@/pages/CommunityPage';
import SearchPage from '@/pages/SearchPage';
import AdminPage from '@/pages/AdminPage';
import TagPage from '@/pages/TagPage';

export default function App() {
  const [route, setRoute] = useState('/');

  const navigate = useCallback((path: string) => {
    setRoute(path);
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    if (route === '/admin') {
      return <AdminPage />;
    }
    if (route === '/') {
      return <HomePage onNavigate={navigate} />;
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
      <Header onNavigate={navigate} currentPath={route} />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
