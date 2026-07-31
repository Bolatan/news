import { useEffect, useState } from 'react';
import { fetchArticles, fetchFeedStatus, type Article } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import BreakingNews from '@/components/BreakingNews';
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  COMMUNITIES,
  COMMUNITY_SLUGS,
  formatFullDate,
} from '@/lib/utils';
import { Clock, ChevronRight, MapPin, RefreshCw, Rss } from 'lucide-react';

type HomePageProps = {
  onNavigate: (path: string) => void;
};

type FeedStatus = {
  total: number;
  aggregated: number;
  editorial: number;
  byCommunity: Record<string, number>;
  sources: number;
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<Article | null>(null);
  const [secondary, setSecondary] = useState<Article[]>([]);
  const [breaking, setBreaking] = useState<Article[]>([]);
  const [latest, setLatest] = useState<Article[]>([]);
  const [byCategory, setByCategory] = useState<Record<string, Article[]>>({});
  const [byCommunity, setByCommunity] = useState<Record<string, Article[]>>({});
  const [feedStatus, setFeedStatus] = useState<FeedStatus | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const [featuredArticles, allArticles, breakingArticles, status] = await Promise.all([
        fetchArticles({ featured: true, limit: 1 }),
        fetchArticles({ limit: 50 }),
        fetchArticles({ breaking: true, limit: 6 }),
        fetchFeedStatus().catch(() => null),
      ]);

      const hero = featuredArticles[0] ?? allArticles[0] ?? null;
      const remaining = hero
        ? allArticles.filter((a) => a.slug !== hero.slug)
        : allArticles;

      setFeatured(hero);
      setBreaking(breakingArticles);
      setSecondary(remaining.slice(0, 4));
      setLatest(remaining.slice(4, 10));
      setFeedStatus(status);

      const catMap: Record<string, Article[]> = {};
      for (const cat of CATEGORIES) {
        catMap[cat] = allArticles.filter((a) => a.category === cat).slice(0, 4);
      }
      setByCategory(catMap);

      const commMap: Record<string, Article[]> = {};
      for (const community of COMMUNITIES) {
        commMap[community] = allArticles.filter((a) => a.community === community).slice(0, 3);
      }
      setByCommunity(commMap);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-neutral-200 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-40 bg-neutral-200 rounded" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BreakingNews articles={breaking} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Clock className="w-3 h-3" />
            <span suppressHydrationWarning>{formatFullDate(new Date().toISOString())}</span>
          </div>
          {feedStatus && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
              <Rss className="w-3 h-3 text-red-600" />
              <span>
                {feedStatus.total} stories · {feedStatus.aggregated} aggregated from{' '}
                {feedStatus.sources} feeds
              </span>
            </div>
          )}
        </div>

        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2">
              <ArticleCard article={featured} onNavigate={onNavigate} variant="hero" />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500 border-b-2 border-red-600 pb-2">
                Top Stories
              </h2>
              {secondary.slice(0, 4).map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  onNavigate={onNavigate}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}

        {secondary.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 pb-12 border-b border-neutral-200">
            {secondary.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                onNavigate={onNavigate}
                variant="standard"
              />
            ))}
          </div>
        )}

        {latest.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900 border-l-4 border-red-600 pl-3">
                Latest News
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
              {latest.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  onNavigate={onNavigate}
                  variant="list"
                />
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 border-l-4 border-red-600 pl-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Communities
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMMUNITIES.map((community) => {
              const count = feedStatus?.byCommunity[community] ?? byCommunity[community]?.length ?? 0;
              return (
                <button
                  key={community}
                  onClick={() => onNavigate(`/community/${COMMUNITY_SLUGS[community]}`)}
                  className="group flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-red-600 hover:bg-red-50 transition-all text-left"
                >
                  <div>
                    <p className="font-semibold text-neutral-900 group-hover:text-red-600 transition-colors">
                      {community}
                    </p>
                    <p className="text-xs text-neutral-500">{count} stories</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-red-600 transition-colors" />
                </button>
              );
            })}
          </div>
        </section>

        {CATEGORIES.map((cat) => {
          const catArticles = byCategory[cat] ?? [];
          if (catArticles.length === 0) return null;
          return (
            <section key={cat} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900 border-l-4 border-red-600 pl-3">
                  {cat}
                </h2>
                <button
                  onClick={() => onNavigate(`/category/${CATEGORY_SLUGS[cat]}`)}
                  className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  More {cat}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {catArticles.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    onNavigate={onNavigate}
                    variant="standard"
                  />
                ))}
              </div>
            </section>
          );
        })}

        <section className="mb-4 bg-neutral-50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 mb-1">
                Live News Aggregation
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                IGBE News automatically pulls stories from {feedStatus?.sources ?? 'multiple'}{' '}
                Nigerian news sources via RSS feeds. Stories mentioning Ikorodu or its
                communities are tagged and organized automatically. Use the "Update Feeds"
                button in the top bar to fetch the latest stories.
              </p>
              <p className="text-xs text-neutral-500">
                Sources include Punch, Vanguard, The Guardian, Premium Times, Channels TV,
                Daily Trust, and more.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
