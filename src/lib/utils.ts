export const CATEGORIES = [
  'Politics',
  'Business',
  'Sports',
  'Community',
  'Health',
  'Education',
  'Culture',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_SLUGS: Record<string, string> = {
  Politics: 'politics',
  Business: 'business',
  Sports: 'sports',
  Community: 'community',
  Health: 'health',
  Education: 'education',
  Culture: 'culture',
};

export const CATEGORY_FROM_SLUG: Record<string, string> = Object.entries(
  CATEGORY_SLUGS,
).reduce(
  (acc, [name, slug]) => {
    acc[slug] = name;
    return acc;
  },
  {} as Record<string, string>,
);

export const COMMUNITIES = [
  'Igbe Laara',
  'Igbogbo',
  'Igboke',
  'Ginti',
  'Ijede',
  'Oreyo',
  'Ebute',
  'Elepe',
] as const;

export type Community = (typeof COMMUNITIES)[number];

export const COMMUNITY_SLUGS: Record<string, string> = {
  'Igbe Laara': 'igbe-laara',
  Igbogbo: 'igbogbo',
  Igboke: 'igboke',
  Ginti: 'ginti',
  Ijede: 'ijede',
  Oreyo: 'oreyo',
  Ebute: 'ebute',
  Elepe: 'elepe',
};

export const COMMUNITY_FROM_SLUG: Record<string, string> = Object.entries(
  COMMUNITY_SLUGS,
).reduce(
  (acc, [name, slug]) => {
    acc[slug] = name;
    return acc;
  },
  {} as Record<string, string>,
);

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
