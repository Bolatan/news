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
  tags?: string[];
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
  tag?: string;
}): Promise<Article[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.community) qs.set('community', params.community);
  if (params?.featured) qs.set('featured', 'true');
  if (params?.breaking) qs.set('breaking', 'true');
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.source) qs.set('source', params.source);
  if (params?.tag) qs.set('tag', params.tag);
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

export async function fetchTags(): Promise<string[]> {
  return apiFetch<string[]>('/tags');
}

export async function createArticle(article: Partial<Article>): Promise<Article> {
  const res = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to create article (${res.status})`);
  }
  return res.json() as Promise<Article>;
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<{ success: boolean }> {
  const res = await fetch(`/api/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to update article (${res.status})`);
  }
  return res.json() as Promise<{ success: boolean }>;
}

export async function deleteArticle(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/articles/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to delete article (${res.status})`);
  }
  return res.json() as Promise<{ success: boolean }>;
}
