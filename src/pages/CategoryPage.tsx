import { useEffect, useState } from 'react';
import { fetchArticles, type Article } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import RssSidebar from '@/components/RssSidebar';
import { CATEGORY_FROM_SLUG } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

type CategoryPageProps = {
  slug: string;
  onNavigate: (path: string) => void;
};

export default function CategoryPage({ slug, onNavigate }: CategoryPageProps) {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const categoryName = CATEGORY_FROM_SLUG[slug] ?? slug;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchArticles({ tag: categoryName, limit: 50 });
      setArticles(data);
      setLoading(false);
      window.scrollTo(0, 0);
    })();
  }, [categoryName]);

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
        <span className="text-neutral-900 font-semibold">{categoryName}</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 border-l-4 border-red-600 pl-4">
        {categoryName}
      </h1>
      <p className="text-neutral-600 mb-8 pl-4">
        The latest {categoryName.toLowerCase()} news from across the Ikorodu division.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {articles.length === 0 ? (
            <div className="text-center py-16 border border-neutral-200 rounded-lg">
              <p className="text-neutral-500">
                No {categoryName.toLowerCase()} stories at the moment. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {articles[0] && (
                <div className="pb-8 border-b border-neutral-200">
                  <ArticleCard
                    article={articles[0]}
                    onNavigate={onNavigate}
                    variant="hero"
                  />
                </div>
              )}
              {articles.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {articles.slice(1).map((article) => (
                    <ArticleCard
                      key={article.slug}
                      article={article}
                      onNavigate={onNavigate}
                      variant="standard"
                    />
                  ))}
                </div>
              )}
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
