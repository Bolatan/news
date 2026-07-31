import { useEffect, useState } from 'react';
import { fetchArticles, type Article } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import { ChevronRight, Tag } from 'lucide-react';

type TagPageProps = {
  tag: string;
  onNavigate: (path: string) => void;
};

export default function TagPage({ tag, onNavigate }: TagPageProps) {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);

  // Format the tag name nicely (e.g., "infrastructure" -> "Infrastructure")
  const decodedTag = decodeURIComponent(tag);
  const tagName = decodedTag.trim();
  const displayName = tagName.charAt(0).toUpperCase() + tagName.slice(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchArticles({ tag: tagName.toLowerCase(), limit: 50 });
      setArticles(data);
      setLoading(false);
      window.scrollTo(0, 0);
    })();
  }, [tagName]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-10 bg-neutral-200 rounded w-1/3 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-40 bg-neutral-200 rounded" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-4">
        <button onClick={() => onNavigate('/')} className="hover:text-red-600">
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-semibold">Tags</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-semibold">{displayName}</span>
      </nav>

      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-7 h-7 text-red-600" />
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          {displayName}
        </h1>
      </div>
      <p className="text-neutral-600 mb-8 pl-9">
        News and updates tagged with <span className="font-semibold">#{tagName.toLowerCase()}</span> from across Ikorodu.
      </p>

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-500">
            No stories tagged with "{tagName}" at the moment. Check back soon.
          </p>
        </div>
      ) : (
        <>
          {articles[0] && (
            <div className="mb-8 pb-8 border-b border-neutral-200">
              <ArticleCard
                article={articles[0]}
                onNavigate={onNavigate}
                variant="hero"
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1).map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                onNavigate={onNavigate}
                variant="standard"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
