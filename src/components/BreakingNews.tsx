import { AlertCircle } from 'lucide-react';
import type { Article } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';

type BreakingNewsProps = {
  articles: Article[];
  onNavigate: (path: string) => void;
};

export default function BreakingNews({ articles, onNavigate }: BreakingNewsProps) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 h-10 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0 font-bold text-sm uppercase tracking-wide">
          <AlertCircle className="w-4 h-4 animate-pulse" />
          Breaking
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {[...articles, ...articles].map((article, i) => (
              <button
                key={`${article.slug}-${i}`}
                onClick={() => onNavigate(`/article/${article.slug}`)}
                className="text-sm hover:underline"
              >
                {article.title}
                <span className="ml-3 text-red-200">
                  · {formatRelativeTime(article.publishedAt)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
