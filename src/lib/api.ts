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
  videoUrl?: string | null;
  videoType?: 'youtube' | 'upload' | 'none';
  mediaToDisplay?: 'image' | 'video';
  tags?: string[];
};

export type TagInfo = {
  name: string;
  count: number;
};

export type User = {
  _id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
};

export type HomepageSettings = {
  pinnedHeroArticleId: string | null;
  pinnedHeroType: 'none' | 'article';
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, options);
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

export async function fetchTags(): Promise<TagInfo[]> {
  return apiFetch<TagInfo[]>('/tags');
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

// Admin API calls

export async function fetchUsers(): Promise<User[]> {
  return apiFetch<User[]>('/users');
}

export async function createUser(user: Omit<User, '_id'>): Promise<User> {
  return apiFetch<User>('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
}

export async function updateUser(id: string, user: Partial<User>): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
}

export async function deleteUser(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/users/${id}`, {
    method: 'DELETE',
  });
}

export async function createArticle(article: Omit<Article, '_id' | 'slug' | 'publishedAt'>): Promise<Article> {
  return apiFetch<Article>('/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  });
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  });
}

export async function deleteArticle(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/articles/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchSettings(): Promise<HomepageSettings> {
  return apiFetch<HomepageSettings>('/settings');
}

export async function updateSettings(settings: HomepageSettings): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
}

export async function uploadMediaFile(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Upload failed');
  }
  return res.json() as Promise<{ url: string }>;
}
