import { useEffect, useState } from 'react';
import { searchArticles, type Article } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import RssSidebar from '@/components/RssSidebar';
import { Search, ChevronRight } from 'lucide-react';

type SearchPageProps = {
  query: string;
  onNavigate: (path: string) => void;
};

export default function SearchPage({ query, onNavigate }: SearchPageProps) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Article[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await searchArticles(query).catch(() => []);
      setResults(data);
      setLoading(false);
    })();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-4">
        <button onClick={() => onNavigate('/')} className="hover:text-red-600">
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-semibold">Search</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-8">
            <Search className="w-6 h-6 text-red-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Search results
            </h1>
          </div>

          <p className="text-neutral-600 mb-8">
            {loading
              ? 'Searching...'
              : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
          </p>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-neutral-200 rounded" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 mb-4">
                No stories found matching your search.
              </p>
              <button
                onClick={() => onNavigate('/')}
                className="text-red-600 font-semibold hover:underline"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
              {results.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  onNavigate={onNavigate}
                  variant="list"
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <RssSidebar onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
