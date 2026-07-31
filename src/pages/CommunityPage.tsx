import { useEffect, useState } from 'react';
import { fetchArticles, type Article } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import RssSidebar from '@/components/RssSidebar';
import { COMMUNITY_FROM_SLUG } from '@/lib/utils';
import { MapPin, ChevronRight, RefreshCw } from 'lucide-react';

type CommunityPageProps = {
  slug: string;
  onNavigate: (path: string) => void;
};

export default function CommunityPage({ slug, onNavigate }: CommunityPageProps) {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const communityName = COMMUNITY_FROM_SLUG[slug] ?? slug;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchArticles({ tag: communityName, limit: 50 });
      setArticles(data);
      setLoading(false);
      window.scrollTo(0, 0);
    })();
  }, [communityName]);

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
        <span className="text-neutral-900 font-semibold">{communityName}</span>
      </nav>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
          <MapPin className="w-5 h-5" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          {communityName}
        </h1>
      </div>
      <p className="text-neutral-600 mb-8 pl-13 ml-13">
        News and stories from the {communityName} community in the Ikorodu division.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {articles.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-lg border border-neutral-200">
              <RefreshCw className="w-8 h-8 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 mb-2">
                No stories tagged for {communityName} yet.
              </p>
              <p className="text-sm text-neutral-400 mb-6">
                Try updating the news feeds — new stories from Nigerian news sources
                are tagged automatically when they mention this community.
              </p>
              <button
                onClick={() => onNavigate('/')}
                className="text-red-600 font-semibold hover:underline"
              >
                Back to Home
              </button>
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
