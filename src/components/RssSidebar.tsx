import { useEffect, useState } from 'react';
import { fetchArticles, fetchFeedStatus, type Article } from '@/lib/api';
import { Clock, Rss } from 'lucide-react';

type RssSidebarProps = {
  onNavigate: (path: string) => void;
};

type FeedStatus = {
  total: number;
  aggregated: number;
  editorial: number;
  byCommunity: Record<string, number>;
  sources: number;
};

export default function RssSidebar({ onNavigate }: RssSidebarProps) {
  const [loading, setLoading] = useState(true);
  const [rssArticles, setRssArticles] = useState<Article[]>([]);
  const [feedStatus, setFeedStatus] = useState<FeedStatus | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [rssData, status] = await Promise.all([
          fetchArticles({ source: 'aggregated', limit: 15 }).catch(() => []),
          fetchFeedStatus().catch(() => null),
        ]);
        setRssArticles(rssData);
        setFeedStatus(status);
      } catch (err) {
        console.error('Failed to load RSS Sidebar data', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <aside className="space-y-6">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 shadow-sm animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/2" />
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
          <div className="space-y-3 pt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-neutral-200 rounded w-1/4" />
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="h-3 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-6">
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 shadow-sm space-y-6">
        <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Rss className="w-4 h-4 text-red-600 animate-pulse" />
            Live RSS Feed
          </h2>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
        </div>

        {feedStatus && (
          <div className="text-xs text-neutral-600 bg-white border border-neutral-200/60 rounded-md p-3 space-y-1">
            <p className="font-semibold text-neutral-700">Aggregation Status</p>
            <p>{feedStatus.aggregated} stories aggregated from {feedStatus.sources} feeds.</p>
          </div>
        )}

        {rssArticles.length === 0 ? (
          <div className="py-6 text-center text-neutral-500 text-xs space-y-2">
            <p>No RSS news items found.</p>
            <p className="text-[11px] text-neutral-400">
              Click{' '}
              <button
                onClick={() => onNavigate('/admin')}
                className="text-red-600 hover:underline font-semibold"
              >
                "Update Feeds"
              </button>{' '}
              in the Admin Dashboard to pull live stories.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-1 scrollbar-thin">
            {rssArticles.map((art) => (
              <article
                key={art.slug}
                onClick={() => onNavigate(`/article/${art.slug}`)}
                className="group cursor-pointer block border-b border-neutral-200/70 last:border-0 pb-3.5 last:pb-0"
              >
                <div className="flex items-center gap-1.5 text-[10px] text-red-600 font-bold uppercase tracking-wide mb-1">
                  <span>{art.source}</span>
                </div>
                <h3 className="text-neutral-900 text-xs font-semibold leading-snug group-hover:text-red-600 transition-colors line-clamp-3 mb-1.5">
                  {art.title}
                </h3>
                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {art.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/tag/${encodeURIComponent(tag)}`);
                        }}
                        className="text-[9px] bg-neutral-200/60 hover:bg-red-50 hover:text-red-600 text-neutral-600 px-1.5 py-0.5 rounded transition-all font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(art.publishedAt).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · {new Date(art.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
