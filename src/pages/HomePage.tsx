import { useEffect, useState } from 'react';
import { fetchArticles, fetchFeedStatus, fetchSettings, type Article } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import BreakingNews from '@/components/BreakingNews';
import RssSidebar from '@/components/RssSidebar';
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  COMMUNITIES,
  COMMUNITY_SLUGS,
  formatFullDate,
} from '@/lib/utils';
import { Clock, ChevronRight, MapPin, Rss } from 'lucide-react';

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
  const [popularTags, setPopularTags] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const [featuredArticles, allArticles, breakingArticles, status, homeSettings] = await Promise.all([
        fetchArticles({ featured: true, limit: 1 }).catch(() => []),
        fetchArticles({ limit: 50 }).catch(() => []),
        fetchArticles({ breaking: true, limit: 6 }).catch(() => []),
        fetchFeedStatus().catch(() => null),
        fetchSettings().catch(() => null),
      ]);

      // Calculate popular tags from fetched articles
      const tagCounts: Record<string, number> = {};
      allArticles.forEach((art) => {
        if (Array.isArray(art.tags)) {
          art.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
      const sortedTags = Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);
      setPopularTags(sortedTags);

      // Determine the hero article based on Pinned Hero settings or standard featured fallback
      let hero: Article | null = null;
      if (homeSettings && homeSettings.pinnedHeroType === 'article' && homeSettings.pinnedHeroArticleId) {
        // Find the pinned article by either ID or slug
        hero = allArticles.find(
          (a) =>
            a._id === homeSettings.pinnedHeroArticleId ||
            a.id === homeSettings.pinnedHeroArticleId ||
            a.slug === homeSettings.pinnedHeroArticleId
        ) ?? null;
      }

      if (!hero) {
        hero = featuredArticles[0] ?? allArticles[0] ?? null;
      }

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
        catMap[cat] = allArticles.filter((a) =>
          Array.isArray(a.tags) && a.tags.some(t => t.toLowerCase() === cat.toLowerCase())
        ).slice(0, 4);
      }
      setByCategory(catMap);

      const commMap: Record<string, Article[]> = {};
      for (const community of COMMUNITIES) {
        commMap[community] = allArticles.filter((a) =>
          Array.isArray(a.tags) && a.tags.some(t => t.toLowerCase() === community.toLowerCase())
        ).slice(0, 3);
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

        {popularTags.length > 0 && (
          <div className="mb-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-500 mb-3">Trending Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => onNavigate(`/tag/${encodeURIComponent(tag.name)}`)}
                  className="text-xs bg-white border border-neutral-200 hover:border-red-600 hover:bg-red-50 text-neutral-700 hover:text-red-600 transition-all font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5"
                >
                  <span>#{tag.name}</span>
                  <span className="text-[10px] text-neutral-400 bg-neutral-100 rounded-full w-4 h-4 flex items-center justify-center font-normal">{tag.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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

        {/* Main Content Layout with 2-column Right Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Left Column (Main Feed Content) */}
          <div className="lg:col-span-3 space-y-12">
            {secondary.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 border-b border-neutral-200">
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
              <section className="pb-12 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 border-l-4 border-red-600 pl-3">
                    Latest News
                  </h2>
                </div>
                <div className="space-y-4">
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

            <section className="pb-12 border-b border-neutral-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900 border-l-4 border-red-600 pl-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Communities
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                <section key={cat} className="pb-12 border-b border-neutral-200 last:border-b-0 last:pb-0">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>

          {/* Right Column (RSS Right Sidebar) */}
          <RssSidebar onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
