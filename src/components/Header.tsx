import { useEffect, useState } from 'react';
import { Search, Menu, X, Clock, MapPin, RefreshCw } from 'lucide-react';
import { CATEGORIES, CATEGORY_SLUGS, COMMUNITIES, COMMUNITY_SLUGS } from '@/lib/utils';
import { refreshFeeds } from '@/lib/api';

type HeaderProps = {
  onNavigate: (path: string) => void;
  currentPath: string;
};

export default function Header({ onNavigate, currentPath }: HeaderProps) {
  const [now, setNow] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState('');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMenuOpen(false);
      setSearchQuery('');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshMsg('');
    try {
      const result = await refreshFeeds();
      setRefreshMsg(
        `${result.added} new stories added from ${result.errors === 0 ? 'all' : 'some'} feeds`,
      );
      setTimeout(() => onNavigate('/'), 500);
    } catch {
      setRefreshMsg('Could not refresh feeds right now');
    }
    setRefreshing(false);
    setTimeout(() => setRefreshMsg(''), 4000);
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-neutral-900 text-neutral-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span suppressHydrationWarning>
              {now.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="w-3 h-3" />
              Ikorodu Division, Lagos
            </span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Updating...' : 'Update Feeds'}
            </button>
          </div>
        </div>
      </div>

      {refreshMsg && (
        <div className="bg-green-600 text-white text-xs px-4 py-1.5 text-center">
          {refreshMsg}
        </div>
      )}

      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-neutral-900"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2"
              aria-label="IGBE News home"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-neutral-900">
                  IGBE
                </span>
                <span className="text-2xl font-bold tracking-tight text-red-600">
                  NEWS
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-neutral-700 hover:text-red-600 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <div className="hidden md:block w-px h-6 bg-neutral-200" />
            <button
              onClick={() => onNavigate('/admin')}
              className={`text-sm font-semibold hover:text-red-600 transition-colors ${
                isActive('/admin') ? 'text-red-600' : 'text-neutral-700'
              }`}
            >
              Admin Dashboard
            </button>
            <div className="hidden md:block w-px h-6 bg-neutral-200" />
            <button
              onClick={() => onNavigate('/')}
              className="hidden md:block text-sm font-semibold text-neutral-700 hover:text-red-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-neutral-200 bg-white">
            <form
              onSubmit={handleSearch}
              className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Ikorodu news..."
                className="flex-1 outline-none text-neutral-900 placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-red-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      <nav className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="hidden lg:flex items-center gap-1 h-11">
            <li>
              <button
                onClick={() => onNavigate('/')}
                className={`px-3 h-11 flex items-center text-sm font-semibold border-b-2 transition-colors ${
                  isActive('/')
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-neutral-700 hover:text-red-600'
                }`}
              >
                Home
              </button>
            </li>
            {CATEGORIES.map((cat) => {
              const path = `/category/${CATEGORY_SLUGS[cat]}`;
              return (
                <li key={cat}>
                  <button
                    onClick={() => onNavigate(path)}
                    className={`px-3 h-11 flex items-center text-sm font-semibold border-b-2 transition-colors ${
                      isActive(path)
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-neutral-700 hover:text-red-600'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <nav className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden lg:flex items-center gap-1 h-9 overflow-x-auto">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide shrink-0 pr-2">
              Communities:
            </span>
            {COMMUNITIES.map((community) => {
              const path = `/community/${COMMUNITY_SLUGS[community]}`;
              return (
                <button
                  key={community}
                  onClick={() => onNavigate(path)}
                  className={`px-2.5 h-9 flex items-center text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive(path)
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-neutral-600 hover:text-red-600'
                  }`}
                >
                  {community}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {menuOpen && (
        <nav className="lg:hidden border-b border-neutral-200 bg-white max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-2">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide pt-2 pb-1">
              Main
            </p>
            <button
              onClick={() => {
                onNavigate('/');
                setMenuOpen(false);
              }}
              className="w-full text-left py-2.5 text-sm font-semibold text-neutral-800 border-b border-neutral-100"
            >
              Home
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onNavigate(`/category/${CATEGORY_SLUGS[cat]}`);
                  setMenuOpen(false);
                }}
                className="w-full text-left py-2.5 text-sm font-semibold text-neutral-800 border-b border-neutral-100"
              >
                {cat}
              </button>
            ))}
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide pt-3 pb-1">
              Communities
            </p>
            {COMMUNITIES.map((community) => (
              <button
                key={community}
                onClick={() => {
                  onNavigate(`/community/${COMMUNITY_SLUGS[community]}`);
                  setMenuOpen(false);
                }}
                className="w-full text-left py-2.5 text-sm font-medium text-neutral-700 border-b border-neutral-100"
              >
                {community}
              </button>
            ))}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full text-left py-2.5 text-sm font-semibold text-red-600 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Updating feeds...' : 'Update News Feeds'}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
