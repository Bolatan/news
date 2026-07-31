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

  const renderMedia = (isHero: boolean) => {
    if (displayMode === 'video' && hasVideo) {
      if (article.videoType === 'youtube') {
        return (
          <iframe
            src={getYoutubeEmbedUrl(article.videoUrl!)}
            title={article.title}
            className={`${
              isHero ? 'absolute inset-0 w-full h-full' : 'w-full h-full aspect-video'
            } border-0 z-10`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      } else if (article.videoType === 'upload') {
        return (
          <video
            src={article.videoUrl!}
            controls
            className={`${
              isHero ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-full object-cover aspect-video'
            } z-10`}
          />
        );
      }
    }

    if (article.imageUrl) {
      return (
        <img
          src={article.imageUrl}
          alt={article.title}
          className={
            isHero
              ? 'absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700'
              : 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          }
        />
      );
    }

    return <div className="w-full h-full bg-neutral-200" />;
  };

  if (variant === 'hero') {
    return (
      <article className="group cursor-pointer relative overflow-hidden rounded-lg bg-neutral-900 min-h-[420px] sm:min-h-[520px]">
        {renderMedia(true)}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        {/* Content Controls */}
        {hasVideo && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDisplayMode('image');
              }}
              className={`p-1 rounded-full transition-colors ${
                displayMode === 'image' ? 'bg-red-600' : 'hover:bg-white/20'
              }`}
              title="Show Image"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDisplayMode('video');
              }}
              className={`p-1 rounded-full transition-colors ${
                displayMode === 'video' ? 'bg-red-600' : 'hover:bg-white/20'
              }`}
              title="Show Video"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        )}

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
          {renderMedia(false)}
          {hasVideo && (
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-white text-[10px] font-bold">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayMode('image');
                }}
                className={`p-0.5 rounded-full ${displayMode === 'image' ? 'bg-red-600' : ''}`}
              >
                <ImageIcon className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayMode('video');
                }}
                className={`p-0.5 rounded-full ${displayMode === 'video' ? 'bg-red-600' : ''}`}
              >
                <Play className="w-3 h-3 fill-current" />
              </button>
            </div>
          )}
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
          {renderMedia(false)}
        </div>
        <div className="min-w-0" onClick={navigate}>
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
          {renderMedia(false)}
          {hasVideo && (
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-white text-[10px] font-bold">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayMode('image');
                }}
                className={`p-0.5 rounded-full ${displayMode === 'image' ? 'bg-red-600' : ''}`}
              >
                <ImageIcon className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayMode('video');
                }}
                className={`p-0.5 rounded-full ${displayMode === 'video' ? 'bg-red-600' : ''}`}
              >
                <Play className="w-3 h-3 fill-current" />
              </button>
            </div>
          )}
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
        {renderMedia(false)}
        {hasVideo && (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-white text-[10px] font-bold">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDisplayMode('image');
              }}
              className={`p-0.5 rounded-full ${displayMode === 'image' ? 'bg-red-600' : ''}`}
            >
              <ImageIcon className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDisplayMode('video');
              }}
              className={`p-0.5 rounded-full ${displayMode === 'video' ? 'bg-red-600' : ''}`}
            >
              <Play className="w-3 h-3 fill-current" />
            </button>
          </div>
        )}
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
