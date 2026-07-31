import { useEffect, useState } from 'react';
import { fetchArticles, fetchFeedStatus, type Article } from '@/lib/api';
import { Clock, Rss } from 'lucide-react';

type RssSidebarProps = {
  onNavigate: (path: string) => void;
  articles?: Article[];
};

type FeedStatus = {
  total: number;
  aggregated: number;
  editorial: number;
  byCommunity: Record<string, number>;
  sources: number;
};

export default function RssSidebar({ onNavigate, articles }: RssSidebarProps) {
  const [rssArticles, setRssArticles] = useState<Article[]>(articles || []);
  const [loading, setLoading] = useState(!articles);
  const [feedStatus, setFeedStatus] = useState<FeedStatus | null>(null);

  useEffect(() => {
    if (articles) {
      setRssArticles(articles);
      setLoading(false);
    } else {
      let isMounted = true;
      (async () => {
        setLoading(true);
        try {
          const data = await fetchArticles({ source: 'aggregated', limit: 15 });
          if (isMounted) {
            setRssArticles(data);
          }
        } catch (error) {
          console.error('Failed to fetch RSS articles:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      })();
      return () => {
        isMounted = false;
      };
    }
  }, [articles]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const status = await fetchFeedStatus();
        if (isMounted) {
          setFeedStatus(status);
        }
      } catch (error) {
        console.error('Failed to fetch feed status:', error);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside className="space-y-6">
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 shadow-sm space-y-6 sticky top-20">
        <div className="border-b border-neutral-200 pb-3.5 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Rss className="w-4 h-4 text-red-600 animate-pulse" />
            Live RSS Feed
          </h2>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
        </div>

        {feedStatus && (
          <div className="bg-white border border-neutral-200/60 rounded-lg p-3 text-xs text-neutral-600 space-y-1 shadow-sm">
            <p className="font-semibold text-neutral-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Aggregation Active
            </p>
            <p className="text-[11px] text-neutral-500">
              {feedStatus.aggregated} stories parsed from {feedStatus.sources} premium feeds.
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-neutral-200/50 p-3 rounded-lg space-y-2">
                <div className="h-3 bg-neutral-200 rounded w-1/3" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : rssArticles.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 text-xs space-y-2">
            <p className="font-semibold">No RSS news items found.</p>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Live stories mentioning Ikorodu are aggregated automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1 scrollbar-thin">
            {rssArticles.map((art) => (
              <div
                key={art.slug}
                onClick={() => onNavigate(`/article/${art.slug}`)}
                className="group cursor-pointer bg-white hover:bg-neutral-50/50 p-3 rounded-lg border border-neutral-200 hover:border-red-400 hover:shadow-sm transition-all duration-300 flex gap-3"
              >
                {art.imageUrl && (
                  <div className="relative shrink-0 w-16 h-16 overflow-hidden rounded bg-neutral-100 border border-neutral-100/50">
                    <img
                      src={art.imageUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Hide or handle broken RSS images gracefully
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] text-red-600 font-extrabold uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                        {art.source}
                      </span>
                      <div className="text-[9px] text-neutral-400 flex items-center gap-1 shrink-0 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        <span>
                          {new Date(art.publishedAt).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-neutral-900 text-xs font-bold leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                  </div>

                  {art.tags && art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {art.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(`/tag/${encodeURIComponent(tag)}`);
                          }}
                          className="text-[9px] bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-500 px-1 py-0.5 rounded transition-all font-semibold border border-neutral-200/40 hover:border-red-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
