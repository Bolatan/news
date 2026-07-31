export type Article = {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category: string;
  imageUrl: string | null;
  imageCredit: string | null;
  author: string;
  location: string | null;
  community?: string | null;
  isFeatured: boolean;
  isBreaking: boolean;
  readTimeMinutes: number;
  publishedAt: string;
  source?: string;
  sourceUrl?: string;
  isAggregated?: boolean;
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchArticles(params?: {
  category?: string;
  community?: string;
  featured?: boolean;
  breaking?: boolean;
  limit?: number;
  source?: 'aggregated' | 'editorial';
}): Promise<Article[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.community) qs.set('community', params.community);
  if (params?.featured) qs.set('featured', 'true');
  if (params?.breaking) qs.set('breaking', 'true');
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.source) qs.set('source', params.source);
  const query = qs.toString();
  return apiFetch<Article[]>(`/articles${query ? `?${query}` : ''}`);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return await apiFetch<Article>(`/articles/${slug}`);
  } catch {
    return null;
  }
}

export async function fetchRelatedArticles(slug: string): Promise<Article[]> {
  return apiFetch<Article[]>(`/articles/${slug}/related`);
}

export async function searchArticles(query: string): Promise<Article[]> {
  if (!query.trim()) return [];
  return apiFetch<Article[]>(`/search?q=${encodeURIComponent(query)}`);
}

export async function refreshFeeds(): Promise<{
  added: number;
  skipped: number;
  errors: number;
}> {
  const res = await fetch('/api/feeds/refresh', { method: 'POST' });
  if (!res.ok) throw new Error('Refresh failed');
  return res.json();
}

export async function fetchFeedStatus(): Promise<{
  total: number;
  aggregated: number;
  editorial: number;
  byCommunity: Record<string, number>;
  sources: number;
}> {
  return apiFetch('/api/feeds/status');
}
