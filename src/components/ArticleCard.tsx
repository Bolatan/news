import type { Article } from '@/lib/api';
import { formatRelativeTime, CATEGORY_SLUGS, COMMUNITY_SLUGS } from '@/lib/utils';
import { MapPin, Rss } from 'lucide-react';

type ArticleCardProps = {
  article: Article;
  onNavigate: (path: string) => void;
  variant?: 'hero' | 'featured' | 'standard' | 'compact' | 'list';
};

export default function ArticleCard({
  article,
  onNavigate,
  variant = 'standard',
}: ArticleCardProps) {
  const navigate = () => onNavigate(`/article/${article.slug}`);
  const categoryPath = `/category/${CATEGORY_SLUGS[article.category] ?? ''}`;
  const communityPath = article.community
    ? `/community/${COMMUNITY_SLUGS[article.community] ?? ''}`
    : null;

  if (variant === 'hero') {
    return (
      <article
        className="group cursor-pointer relative overflow-hidden rounded-lg bg-neutral-900 min-h-[420px] sm:min-h-[520px]"
        onClick={navigate}
      >
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(categoryPath);
              }}
              className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded hover:bg-red-700 transition-colors"
            >
              {article.category}
            </button>
            {communityPath && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(communityPath);
                }}
                className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded hover:bg-white/30 transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                {article.community}
              </button>
            )}
          </div>
          <h1 className="text-white text-2xl sm:text-4xl font-bold leading-tight mb-3 group-hover:text-red-100 transition-colors">
            {article.title}
          </h1>
          <p className="text-neutral-200 text-sm sm:text-base leading-relaxed mb-3 line-clamp-2">
            {article.summary}
          </p>
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {article.tags.map((t) => (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/tag/${t}`);
                  }}
                  className="bg-black/45 backdrop-blur-sm text-neutral-200 hover:text-white text-xs font-semibold px-2 py-0.5 rounded transition-colors"
                >
                  #{t}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-neutral-300">
            <span className="font-semibold">{article.author}</span>
            <span>·</span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
            {article.isAggregated && article.source && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Rss className="w-3 h-3" />
                  {article.source}
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="group cursor-pointer" onClick={navigate}>
        <div className="overflow-hidden rounded-lg mb-3 aspect-video bg-neutral-200">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(categoryPath);
          }}
          className="text-red-600 text-xs font-bold uppercase tracking-wider mb-2 hover:underline"
        >
          {article.category}
        </button>
        <h2 className="text-neutral-900 text-lg sm:text-xl font-bold leading-tight mb-2 group-hover:text-red-600 transition-colors">
          {article.title}
        </h2>
        <p className="text-neutral-600 text-sm leading-relaxed mb-2 line-clamp-2">
          {article.summary}
        </p>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {article.tags.map((t) => (
              <button
                key={t}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(`/tag/${t}`);
                }}
                className="text-xs text-red-600 hover:underline font-medium"
              >
                #{t}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-700">{article.author}</span>
          <span>·</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group cursor-pointer flex gap-3" onClick={navigate}>
        <div className="shrink-0 w-24 h-16 overflow-hidden rounded bg-neutral-200">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-neutral-900 text-sm font-semibold leading-snug mb-1 line-clamp-3 group-hover:text-red-600 transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>{formatRelativeTime(article.publishedAt)}</span>
            {article.community && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" />
                  {article.community}
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'list') {
    return (
      <article
        className="group cursor-pointer flex gap-4 py-4 border-b border-neutral-200 last:border-0"
        onClick={navigate}
      >
        <div className="shrink-0 w-28 sm:w-40 h-20 sm:h-28 overflow-hidden rounded bg-neutral-200">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(categoryPath);
              }}
              className="text-red-600 text-xs font-bold uppercase tracking-wider hover:underline"
            >
              {article.category}
            </button>
            {article.community && communityPath && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(communityPath);
                }}
                className="text-neutral-500 text-xs font-medium hover:text-red-600 transition-colors flex items-center gap-0.5"
              >
                <MapPin className="w-3 h-3" />
                {article.community}
              </button>
            )}
          </div>
          <h3 className="text-neutral-900 text-base sm:text-lg font-bold leading-tight mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-neutral-600 text-sm leading-relaxed mb-1 line-clamp-2 hidden sm:block">
            {article.summary}
          </p>
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {article.tags.map((t) => (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/tag/${t}`);
                  }}
                  className="text-xs text-red-600 hover:underline font-medium"
                >
                  #{t}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-700">{article.author}</span>
            <span>·</span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
            {article.isAggregated && article.source && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <Rss className="w-3 h-3" />
                  {article.source}
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group cursor-pointer" onClick={navigate}>
      <div className="overflow-hidden rounded-lg mb-3 aspect-video bg-neutral-200">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(categoryPath);
          }}
          className="text-red-600 text-xs font-bold uppercase tracking-wider hover:underline"
        >
          {article.category}
        </button>
        {article.community && communityPath && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(communityPath);
            }}
            className="text-neutral-500 text-xs font-medium hover:text-red-600 transition-colors flex items-center gap-0.5"
          >
            <MapPin className="w-3 h-3" />
            {article.community}
          </button>
        )}
      </div>
      <h3 className="text-neutral-900 text-base font-bold leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-3">
        {article.title}
      </h3>
      <p className="text-neutral-600 text-sm leading-relaxed mb-2 line-clamp-2">
        {article.summary}
      </p>
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {article.tags.map((t) => (
            <button
              key={t}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(`/tag/${t}`);
              }}
              className="text-xs text-red-600 hover:underline font-medium"
            >
              #{t}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <span className="font-semibold text-neutral-700">{article.author}</span>
        <span>·</span>
        <span>{formatRelativeTime(article.publishedAt)}</span>
        {article.isAggregated && article.source && (
          <>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              <Rss className="w-3 h-3" />
              {article.source}
            </span>
          </>
        )}
      </div>
    </article>
  );
}
