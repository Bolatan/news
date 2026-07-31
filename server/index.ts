import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import RSSParser from 'rss-parser';
import {
  FEED_SOURCES,
  detectCommunity,
  isIkoroduRelated,
  categorizeArticle,
  COMMUNITIES,
  type Community,
} from './feeds';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://bolatan_db_user:28A0Oh00Ib4c3qrU@cluster0.ub5jkhi.mongodb.net/?appName=Cluster0';

const DB_NAME = 'igbe_news';
const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

let client: MongoClient;
const rssParser = new RSSParser({
  timeout: 8000,
  headers: { 'User-Agent': 'IGBE-News-Aggregator/1.0' },
});

async function getDb() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 200);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function extractImage(item: { [key: string]: unknown }): string | null {
  const mediaContent = item['media:content'] as { $?: { url?: string } } | undefined;
  if (mediaContent?.$?.url) return mediaContent.$.url!;
  const mediaThumbnail = item['media:thumbnail'] as { $?: { url?: string } } | undefined;
  if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url!;
  const enclosure = item.enclosure as { url?: string } | undefined;
  if (enclosure?.url) return enclosure.url;
  const content = (item['content:encoded'] as string) || (item.content as string) || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];
  return null;
}

function generateTags(title: string, summary: string, category: string): string[] {
  const text = `${title} ${summary} ${category}`.toLowerCase();
  const tagsSet = new Set<string>();

  if (category) {
    tagsSet.add(category.toLowerCase());
  }

  const keywordMap: Record<string, string[]> = {
    'infrastructure': ['road', 'bridge', 'drainage', 'electric', 'power', 'water', 'pipe', 'transformer', 'construction', 'building'],
    'emergency': ['accident', 'crash', 'fire', 'explosion', 'outbreak', 'cholera', 'flood', 'collapse'],
    'education': ['school', 'student', 'teacher', 'waec', 'neco', 'jamb', 'university', 'college', 'coaching'],
    'healthcare': ['hospital', 'doctor', 'nurse', 'medical', 'clinic', 'vaccine', 'health', 'maternity'],
    'business': ['market', 'traders', 'economy', 'naira', 'finance', 'business', 'stall', 'shop', 'rice mill', 'factory'],
    'sports': ['football', 'fc', 'win', 'match', 'goal', 'stadium', 'athletics', 'sports'],
    'politics': ['politics', 'governor', 'government', 'sanwo-olu', 'reform', 'commissioner', 'law'],
    'culture': ['festival', 'traditional', 'king', 'palace', 'culture', 'dance', 'actress', 'nollywood', 'film']
  };

  for (const [tag, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(kw => text.includes(kw))) {
      tagsSet.add(tag);
    }
  }

  return Array.from(tagsSet);
}

async function refreshFeeds(): Promise<{ added: number; skipped: number; errors: number }> {
  const db = await getDb();
  const collection = db.collection('articles');
  let added = 0;
  let skipped = 0;
  let errors = 0;

  const feedPromises = FEED_SOURCES.map(async (source) => {
    try {
      const feed = await rssParser.parseURL(source.url);
      if (!feed?.items) return { added: 0, skipped: 0, errors: 0 };

      let feedAdded = 0;
      let feedSkipped = 0;

      for (const item of feed.items) {
        const title = stripHtml(item.title || '');
        if (!title) continue;

        const rawContent = item.contentSnippet || item.summary || item.content || '';
        const summary = stripHtml(rawContent).slice(0, 300);
        // Preserve HTML in fullContent
        const fullContent = item['content:encoded'] || item.content || rawContent || summary;

        const combinedText = `${title} ${summary}`;

        if (!isIkoroduRelated(combinedText)) {
          feedSkipped++;
          continue;
        }

        const community = detectCommunity(combinedText);
        const category = categorizeArticle(title, summary);
        const slug = slugify(`${title}-${item.isoDate || Date.now()}`);
        const pubDate = item.isoDate ? new Date(item.isoDate) : new Date();
        const imageUrl = extractImage(item);
        const tags = generateTags(title, rawContent, category);

        const existing = await collection.findOne({ slug });
        if (existing) {
          feedSkipped++;
          continue;
        }

        await collection.insertOne({
          title,
          slug,
          summary,
          body: fullContent,
          category,
          imageUrl,
          imageCredit: source.name,
          author: item.creator || source.name,
          location: community,
          community,
          isFeatured: false,
          isBreaking: title.match(/breaking|urgent|alert/i) !== null,
          readTimeMinutes: Math.max(2, Math.ceil(stripHtml(fullContent).split(/\s+/).length / 200)),
          publishedAt: pubDate,
          source: source.name,
          sourceUrl: item.link,
          isAggregated: true,
          tags,
        });
        feedAdded++;
      }

      return { added: feedAdded, skipped: feedSkipped, errors: 0 };
    } catch {
      return { added: 0, skipped: 0, errors: 1 };
    }
  });

  const results = await Promise.all(feedPromises);
  for (const r of results) {
    added += r.added;
    skipped += r.skipped;
    errors += r.errors;
  }

  return { added, skipped, errors };
}

app.get('/api/articles', async (req, res) => {
  try {
    const db = await getDb();
    const { category, community, featured, breaking, limit, source, tag } = req.query;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (community) filter.community = community;
    if (featured === 'true') filter.isFeatured = true;
    if (breaking === 'true') filter.isBreaking = true;
    if (source === 'aggregated') filter.isAggregated = true;
    if (source === 'editorial') filter.isAggregated = { $ne: true };
    if (tag) filter.tags = String(tag).toLowerCase();

    const articles = await db
      .collection('articles')
      .find(filter)
      .sort({ publishedAt: -1 })
      .limit(Number(limit) || 50)
      .toArray();

    res.json(articles);
  } catch {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.get('/api/tags', async (_req, res) => {
  try {
    const db = await getDb();
    const tags = await db.collection('articles').distinct('tags');
    const sortedTags = tags.filter((t: any) => typeof t === 'string' && t.trim() !== '').map((t: string) => t.toLowerCase());
    const uniqueTags = Array.from(new Set(sortedTags)).sort();
    res.json(uniqueTags);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

app.get('/api/articles/:slug', async (req, res) => {
  try {
    const db = await getDb();
    const article = await db
      .collection('articles')
      .findOne({ slug: req.params.slug });

    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    res.json(article);
  } catch {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

app.get('/api/articles/:slug/related', async (req, res) => {
  try {
    const db = await getDb();
    const article = await db
      .collection('articles')
      .findOne({ slug: req.params.slug });

    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const filter: Record<string, unknown> = { _id: { $ne: article._id } };
    if (article.community) {
      filter.$or = [
        { community: article.community },
        { category: article.category },
      ];
    } else {
      filter.category = article.category;
    }

    const related = await db
      .collection('articles')
      .find(filter)
      .sort({ publishedAt: -1 })
      .limit(4)
      .toArray();

    res.json(related);
  } catch {
    res.status(500).json({ error: 'Failed to fetch related articles' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const db = await getDb();
    const q = String(req.query.q || '').trim();

    if (!q) {
      res.json([]);
      return;
    }

    const articles = await db
      .collection('articles')
      .find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { summary: { $regex: q, $options: 'i' } },
          { body: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } },
          { location: { $regex: q, $options: 'i' } },
          { community: { $regex: q, $options: 'i' } },
          { tags: { $regex: q, $options: 'i' } },
        ],
      })
      .sort({ publishedAt: -1 })
      .limit(30)
      .toArray();

    res.json(articles);
  } catch {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/communities', (_req, res) => {
  res.json(COMMUNITIES);
});

app.post('/api/feeds/refresh', async (_req, res) => {
  try {
    const result = await refreshFeeds();
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Feed refresh failed' });
  }
});

app.get('/api/feeds/status', async (_req, res) => {
  try {
    const db = await getDb();
    const total = await db.collection('articles').countDocuments();
    const aggregated = await db.collection('articles').countDocuments({ isAggregated: true });
    const editorial = total - aggregated;
    const byCommunity: Record<string, number> = {};
    for (const c of COMMUNITIES) {
      byCommunity[c] = await db.collection('articles').countDocuments({ community: c });
    }
    res.json({ total, aggregated, editorial, byCommunity, sources: FEED_SOURCES.length });
  } catch {
    res.status(500).json({ error: 'Status failed' });
  }
});

app.post('/api/seed', async (req, res) => {
  try {
    const db = await getDb();
    const articlesData = req.body;

    if (!Array.isArray(articlesData)) {
      res.status(400).json({ error: 'Expected an array of articles' });
      return;
    }

    const preparedArticles = articlesData.map((article: any) => {
      const tags = Array.isArray(article.tags)
        ? article.tags
        : generateTags(article.title, article.summary || article.body, article.category);
      return {
        ...article,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
        created_at: article.created_at ? new Date(article.created_at) : new Date(),
        updated_at: article.updated_at ? new Date(article.updated_at) : new Date(),
        tags: tags.map((t: string) => t.toLowerCase().trim()).filter(Boolean),
      };
    });

    const result = await db.collection('articles').insertMany(preparedArticles);
    res.json({ inserted: result.insertedCount });
  } catch (err: any) {
    res.status(500).json({ error: 'Seeding failed: ' + err.message });
  }
});

// Admin endpoints for CRUD operations
app.post('/api/articles', async (req, res) => {
  try {
    const db = await getDb();
    const {
      title,
      summary,
      body,
      category,
      imageUrl,
      imageCredit,
      author,
      location,
      community,
      isFeatured,
      isBreaking,
      readTimeMinutes,
      tags,
    } = req.body;

    if (!title || !body || !category || !author) {
      res.status(400).json({ error: 'Title, body, category, and author are required' });
      return;
    }

    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Date.now()}`;

    const parsedTags = Array.isArray(tags)
      ? tags.map(t => t.trim().toLowerCase()).filter(Boolean)
      : generateTags(title, summary || body, category);

    const article = {
      title,
      slug,
      summary: summary || stripHtml(body).slice(0, 150),
      body,
      category,
      imageUrl: imageUrl || null,
      imageCredit: imageCredit || null,
      author,
      location: location || null,
      community: community || null,
      isFeatured: !!isFeatured,
      isBreaking: !!isBreaking,
      readTimeMinutes: Number(readTimeMinutes) || 3,
      publishedAt: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      tags: parsedTags,
      isAggregated: false,
    };

    const result = await db.collection('articles').insertOne(article);
    res.status(201).json({ ...article, _id: result.insertedId });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create article: ' + err.message });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  try {
    const db = await getDb();
    const idStr = req.params.id;
    let queryId: any;
    try {
      queryId = new ObjectId(idStr);
    } catch {
      queryId = idStr;
    }

    const {
      title,
      summary,
      body,
      category,
      imageUrl,
      imageCredit,
      author,
      location,
      community,
      isFeatured,
      isBreaking,
      readTimeMinutes,
      tags,
    } = req.body;

    const updateData: Record<string, any> = {};
    if (title !== undefined) {
      updateData.title = title;
      updateData.slug = `${slugify(title)}-${Date.now()}`;
    }
    if (summary !== undefined) updateData.summary = summary;
    if (body !== undefined) updateData.body = body;
    if (category !== undefined) updateData.category = category;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
    if (imageCredit !== undefined) updateData.imageCredit = imageCredit || null;
    if (author !== undefined) updateData.author = author;
    if (location !== undefined) updateData.location = location || null;
    if (community !== undefined) updateData.community = community || null;
    if (isFeatured !== undefined) updateData.isFeatured = !!isFeatured;
    if (isBreaking !== undefined) updateData.isBreaking = !!isBreaking;
    if (readTimeMinutes !== undefined) updateData.readTimeMinutes = Number(readTimeMinutes) || 3;
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags.map(t => t.trim().toLowerCase()).filter(Boolean) : [];
    }
    updateData.updated_at = new Date();

    const result = await db.collection('articles').updateOne(
      { $or: [{ _id: queryId }, { id: idStr }] },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update article: ' + err.message });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const db = await getDb();
    const idStr = req.params.id;
    let queryId: any;
    try {
      queryId = new ObjectId(idStr);
    } catch {
      queryId = idStr;
    }

    const result = await db.collection('articles').deleteOne({
      $or: [{ _id: queryId }, { id: idStr }]
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete article: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`IGBE News API running on port ${PORT}`);
});