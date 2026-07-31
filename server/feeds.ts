export type Community =
  | 'Igbe Laara'
  | 'Igbogbo'
  | 'Igboke'
  | 'Ginti'
  | 'Ijede'
  | 'Oreyo'
  | 'Ebute'
  | 'Elepe';

export const COMMUNITIES: Community[] = [
  'Igbe Laara',
  'Igbogbo',
  'Igboke',
  'Ginti',
  'Ijede',
  'Oreyo',
  'Ebute',
  'Elepe',
];

export const COMMUNITY_SLUGS: Record<Community, string> = {
  'Igbe Laara': 'igbe-laara',
  Igbogbo: 'igbogbo',
  Igboke: 'igboke',
  Ginti: 'ginti',
  Ijede: 'ijede',
  Oreyo: 'oreyo',
  Ebute: 'ebute',
  Elepe: 'elepe',
};

export const COMMUNITY_FROM_SLUG: Record<string, Community> = Object.entries(
  COMMUNITY_SLUGS,
).reduce(
  (acc, [name, slug]) => {
    acc[slug] = name as Community;
    return acc;
  },
  {} as Record<string, Community>,
);

export type FeedSource = {
  name: string;
  url: string;
  defaultCategory: string;
};

export const FEED_SOURCES: FeedSource[] = [
  {
    name: 'Punch - Lagos',
    url: 'https://punchng.com/topic/lagos/feed/',
    defaultCategory: 'Politics',
  },
  {
    name: 'Vanguard - News',
    url: 'https://www.vanguardngr.com/feed/',
    defaultCategory: 'Politics',
  },
  {
    name: 'The Guardian - News',
    url: 'https://guardian.ng/feed/',
    defaultCategory: 'Politics',
  },
  {
    name: 'Premium Times',
    url: 'https://www.premiumtimesng.com/feed',
    defaultCategory: 'Politics',
  },
  {
    name: 'Daily Trust',
    url: 'https://dailytrust.com/feed/',
    defaultCategory: 'Politics',
  },
  {
    name: 'Channels TV - News',
    url: 'https://www.channelstv.com/feed/',
    defaultCategory: 'Politics',
  },
  {
    name: 'Nigerian Tribune',
    url: 'https://tribuneonlineng.com/feed/',
    defaultCategory: 'Politics',
  },
  {
    name: 'The Nation',
    url: 'https://thenationonlineng.net/feed/',
    defaultCategory: 'Politics',
  },
  {
    name: 'Sahara Reporters',
    url: 'https://saharareporters.com/feed/rss.xml',
    defaultCategory: 'Politics',
  },
  {
    name: 'Punch - Sports',
    url: 'https://punchng.com/topic/sports/feed/',
    defaultCategory: 'Sports',
  },
  {
    name: 'Vanguard - Sports',
    url: 'https://www.vanguardngr.com/sports/feed/',
    defaultCategory: 'Sports',
  },
  {
    name: 'The Guardian - Business',
    url: 'https://guardian.ng/business-services/feed/',
    defaultCategory: 'Business',
  },
];

export const COMMUNITY_KEYWORDS: Record<Community, string[]> = {
  'Igbe Laara': ['igbe laara', 'igbe-laara', 'igbelaara', 'igbe laa'],
  Igbogbo: ['igbogbo', 'igbogbo baiyeku', 'igbogbo-baiyeku'],
  Igboke: ['igboke', 'igbo-ke', 'igbo ke'],
  Ginti: ['ginti', 'ginti ijede', 'ginti-ijede'],
  Ijede: ['ijede', 'ijede road', 'ijede community', 'ijede junction'],
  Oreyo: ['oreyo', 'oreyo town', 'oreyo community'],
  Ebute: ['ebute', 'ebute ijede', 'ebute-ijede', 'ebute igbogbo'],
  Elepe: ['elepe', 'elepe ijede', 'elepe-ijede', 'elepe community'],
};

export const IKORODU_KEYWORDS = [
  'ikorodu',
  'ikorodu road',
  'ikorodu town',
  'ikorodu division',
  'ayangburen',
  'ikorodu local government',
  'ikorodu central',
  'imota',
  'agbowa',
  'bayeku',
  'ltf',
  'ikorodu-epc',
  'ikorodu-epe',
];

export function detectCommunity(text: string): Community | null {
  const lower = text.toLowerCase();
  for (const community of COMMUNITIES) {
    const keywords = COMMUNITY_KEYWORDS[community];
    if (keywords.some((kw) => lower.includes(kw))) {
      return community;
    }
  }
  return null;
}

export function isIkoroduRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return IKORODU_KEYWORDS.some((kw) => lower.includes(kw));
}

export function categorizeArticle(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  if (
    text.match(/\b(sport|football|soccer|premier league|npfl|super eagle|basketball|athletics|boxing|wrestling|tournament|coach|match|goal|striker|midfielder|defender|goalkeeper)\b/)
  ) {
    return 'Sports';
  }
  if (
    text.match(/\b(business|economy|market|trade|naira|dollar|stock|exchange|oil|gas|bank|finance|investment|gdp|inflation|rice mill|factory|manufactur)\b/)
  ) {
    return 'Business';
  }
  if (
    text.match(/\b(health|hospital|doctor|nurse|cholera|malaria|clinic|maternal|patient|disease|outbreak|vaccin|medical|epidemic)\b/)
  ) {
    return 'Health';
  }
  if (
    text.match(/\b(school|student|waec|neco|jamb|university|education|teacher|classroom|pupil|college|academic|graduat|scholarship|curriculum)\b/)
  ) {
    return 'Education';
  }
  if (
    text.match(/\b(culture|festival|tradition|ob|king|palace|drum|dance|heritage|masquerade|coronation|chieftaincy|cultural|nollywood|film|music|art)\b/)
  ) {
    return 'Culture';
  }
  if (
    text.match(/\b(community|resident|erosion|road|water|electricity|drainage|flood|waste|environment|neighbourhood|development|infrastructure|project)\b/)
  ) {
    return 'Community';
  }
  return 'Politics';
}
