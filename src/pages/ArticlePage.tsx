import { useEffect, useState } from 'react';
import { fetchArticleBySlug, fetchRelatedArticles, type Article } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import {
  formatFullDate,
  formatRelativeTime,
  CATEGORY_SLUGS,
  COMMUNITY_SLUGS,
} from '@/lib/utils';
import {
  Clock,
  MapPin,
  ChevronLeft,
  Share2,
  Bookmark,
  Rss,
  ExternalLink,
} from 'lucide-react';

type ArticlePageProps = {
  slug: string;
  onNavigate: (path: string) => void;
};

export default function ArticlePage({ slug, onNavigate }: ArticlePageProps) {
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);

      const current = await fetchArticleBySlug(slug);
      if (!current) {
        setError(true);
        setLoading(false);
        return;
      }

      setArticle(current);
      const relatedArticles = await fetchRelatedArticles(slug);
      setRelated(relatedArticles);
      setLoading(false);
      window.scrollTo(0, 0);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-6 bg-neutral-200 rounded w-24 mb-4" />
        <div className="h-10 bg-neutral-200 rounded w-3/4 mb-4" />
        <div className="h-64 bg-neutral-200 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-neutral-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Article not found</h1>
        <p className="text-neutral-600 mb-6">
          The story you are looking for may have been moved or is no longer available.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded hover:bg-red-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const communityPath = article.community
    ? `/community/${COMMUNITY_SLUGS[article.community] ?? ''}`
    : null;

  const getFormattedBody = (bodyText: string) => {
    if (!bodyText) return '';
    const hasHtml = /<[a-z][\s\S]*>/i.test(bodyText);
    if (hasHtml) {
      return bodyText;
    }
    return bodyText
      .split(/\n\s*\n/)
      .map(para => `<p>${para.replace(/\n/g, '<br />')}</p>`)
      .join('');
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1 text-sm text-neutral-600 hover:text-red-600 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => onNavigate(`/category/${CATEGORY_SLUGS[article.category]}`)}
          className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded hover:bg-red-700 transition-colors"
        >
          {article.category}
        </button>
        {article.community && communityPath && (
          <button
            onClick={() => onNavigate(communityPath)}
            className="bg-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded hover:bg-neutral-300 transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            {article.community}
          </button>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight mb-4">
        {article.title}
      </h1>
      <p className="text-lg text-neutral-600 leading-relaxed mb-6">
        {article.summary}
      </p>

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onNavigate(`/tag/${encodeURIComponent(tag)}`)}
              className="text-xs bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 border border-neutral-200 hover:border-red-600 transition-all font-semibold px-2.5 py-1.5 rounded-full flex items-center"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-neutral-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
            {article.author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{article.author}</p>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Clock className="w-3 h-3" />
              <span suppressHydrationWarning>
                {formatFullDate(article.publishedAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Bookmark"
            className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-red-600 hover:text-red-600 transition-colors"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            aria-label="Share"
            className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-red-600 hover:text-red-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {article.imageUrl && (
        <figure className="mb-6">
          <div className="overflow-hidden rounded-lg">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
          {article.imageCredit && (
            <figcaption className="text-xs text-neutral-500 mt-2">
              Photo: {article.imageCredit}
            </figcaption>
          )}
        </figure>
      )}

      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mb-8 pb-4 border-b border-neutral-100">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {article.readTimeMinutes} min read
        </span>
        {article.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {article.location}, Ikorodu
          </span>
        )}
        <span suppressHydrationWarning>
          Published {formatRelativeTime(article.publishedAt)}
        </span>
        {article.isAggregated && article.source && (
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <Rss className="w-3.5 h-3.5" />
            Via {article.source}
          </span>
        )}
      </div>

      <div
        className="prose prose-rich-text prose-lg max-w-none text-neutral-800"
        dangerouslySetInnerHTML={{ __html: getFormattedBody(article.body) }}
      />

      {article.isAggregated && article.sourceUrl && (
        <div className="mt-6 mb-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-600 mb-2">
            This story was aggregated from {article.source} via RSS feed.
          </p>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-red-600 font-semibold hover:underline flex items-center gap-1"
          >
            Read original at {article.source}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-neutral-200">
        <p className="text-sm font-semibold text-neutral-900">
          {article.author} reports for IGBE News from{' '}
          {article.location ?? 'Ikorodu'}, Lagos.
        </p>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-neutral-900 border-l-4 border-red-600 pl-3 mb-6">
            Related Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((a) => (
              <ArticleCard
                key={a.slug}
                article={a}
                onNavigate={onNavigate}
                variant="standard"
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
