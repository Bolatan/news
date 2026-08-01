import { useState } from 'react';
import type { Article } from '@/lib/api';
import { formatRelativeTime, CATEGORY_SLUGS, COMMUNITY_SLUGS } from '@/lib/utils';
import { MapPin, Rss, Play, Image as ImageIcon } from 'lucide-react';

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
  const [displayMode, setDisplayMode] = useState<'image' | 'video'>(
    article.mediaToDisplay || 'image'
  );

  const navigate = () => onNavigate(`/article/${article.slug}`);
  const categoryPath = `/category/${CATEGORY_SLUGS[article.category] ?? ''}`;
  const communityPath = article.community
    ? `/community/${COMMUNITY_SLUGS[article.community] ?? ''}`
    : null;

  const hasVideo = !!article.videoUrl && article.videoType !== 'none';

  // Helper to extract clean youtube ID
  const getYoutubeEmbedUrl = (url: string) => {
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const renderMedia = () => {
    if (displayMode === 'video' && hasVideo) {
      if (article.videoType === 'youtube') {
        return (
          <iframe
            src={getYoutubeEmbedUrl(article.videoUrl!)}
            title={article.title}
            className="absolute inset-0 w-full h-full border-0 z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      } else if (article.videoType === 'upload') {
        return (
          <video
            src={article.videoUrl!}
            controls
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        );
      }
    }

    if (article.imageUrl) {
      return (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
        />
      );
    }

    return (
      <div className="absolute inset-0 w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-300">
        <ImageIcon className="w-8 h-8" />
      </div>
    );
  };

  // Standarized media controller component to avoid duplication
  const renderMediaControls = (isLarge: boolean) => {
    if (!hasVideo) return null;
    return (
      <div
        className={`absolute z-20 flex items-center gap-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg transition-all ${
          isLarge ? 'top-4 right-4 px-2 py-1' : 'top-2 right-2 px-1.5 py-0.5 scale-90 sm:scale-100'
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDisplayMode('image');
          }}
          className={`p-1 rounded-full transition-all text-white ${
            displayMode === 'image'
              ? 'bg-red-600 font-bold scale-105'
              : 'hover:bg-white/15 text-neutral-300'
          }`}
          title="Show Image"
        >
          <ImageIcon className={isLarge ? 'w-4 h-4' : 'w-3 h-3'} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDisplayMode('video');
          }}
          className={`p-1 rounded-full transition-all text-white ${
            displayMode === 'video'
              ? 'bg-red-600 font-bold scale-105'
              : 'hover:bg-white/15 text-neutral-300'
          }`}
          title="Show Video"
        >
          <Play className={isLarge ? 'w-4 h-4 fill-current' : 'w-3 h-3 fill-current'} />
        </button>
      </div>
    );
  };

  if (variant === 'hero') {
    return (
      <article className="group cursor-pointer relative overflow-hidden rounded-lg bg-neutral-950 min-h-[420px] sm:min-h-[520px]">
        {renderMedia()}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent pointer-events-none" />

        {renderMediaControls(true)}

        <div className="relative h-full flex flex-col justify-end p-6 sm:p-8" onClick={navigate}>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(categoryPath);
              }}
              className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded hover:bg-red-700 transition-colors z-20"
            >
              {article.category}
            </button>
            {communityPath && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(communityPath);
                }}
                className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded hover:bg-white/30 transition-colors flex items-center gap-1 z-20"
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
            <div className="flex flex-wrap gap-1.5 mb-3 z-20">
              {article.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/tag/${encodeURIComponent(tag)}`);
                  }}
                  className="text-[10px] sm:text-xs bg-white/20 hover:bg-red-600 text-white border border-white/20 hover:border-red-600 px-2.5 py-0.5 rounded-full transition-all font-semibold"
                >
                  #{tag}
                </span>
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
      <article className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-3 aspect-video bg-neutral-200">
          {renderMedia()}
          {renderMediaControls(false)}
        </div>
        <div onClick={navigate}>
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
            <div className="flex flex-wrap gap-1 mb-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/tag/${encodeURIComponent(tag)}`);
                  }}
                  className="text-[10px] bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 border border-neutral-200 hover:border-red-600 px-2 py-0.5 rounded transition-all font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-700">{article.author}</span>
            <span>·</span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group cursor-pointer flex gap-3">
        <div className="relative shrink-0 w-24 h-16 overflow-hidden rounded bg-neutral-200">
          {renderMedia()}
          {renderMediaControls(false)}
        </div>
        <div className="min-w-0 flex-1" onClick={navigate}>
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
      <article className="group cursor-pointer flex gap-4 py-4 border-b border-neutral-200 last:border-0">
        <div className="relative shrink-0 w-28 sm:w-40 h-20 sm:h-28 overflow-hidden rounded bg-neutral-200">
          {renderMedia()}
          {renderMediaControls(false)}
        </div>
        <div className="min-w-0 flex-1" onClick={navigate}>
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
            <div className="flex flex-wrap gap-1 mb-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/tag/${encodeURIComponent(tag)}`);
                  }}
                  className="text-[10px] bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 border border-neutral-200 hover:border-red-600 px-2 py-0.5 rounded transition-all font-semibold"
                >
                  #{tag}
                </span>
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
    <article className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-3 aspect-video bg-neutral-200">
        {renderMedia()}
        {renderMediaControls(false)}
      </div>
      <div onClick={navigate}>
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
          <div className="flex flex-wrap gap-1 mb-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(`/tag/${encodeURIComponent(tag)}`);
                }}
                className="text-[10px] bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 border border-neutral-200 hover:border-red-600 px-2 py-0.5 rounded transition-all font-semibold"
              >
                #{tag}
              </span>
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
