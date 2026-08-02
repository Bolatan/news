import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, Db } from 'mongodb';
import RSSParser from 'rss-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import {
  FEED_SOURCES,
  detectCommunity,
  isIkoroduRelated,
  categorizeArticle,
  COMMUNITIES,
} from './feeds';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://bolatan_db_user:28A0Oh00Ib4c3qrU@cluster0.ub5jkhi.mongodb.net/?appName=Cluster0';

const DB_NAME = 'igbe_news';
const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

// Serve static uploaded files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/api/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

let client: MongoClient;
const rssParser = new RSSParser({
  timeout: 8000,
  headers: { 'User-Agent': 'IGBE-News-Aggregator/1.0' },
});

async function getDb() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    await seedUsersIfNeeded(db);
    return db;
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

        const existing = await collection.findOne({ slug });
        if (existing) {
          feedSkipped++;
          continue;
        }

        const itemCategories = Array.isArray(item.categories) ? item.categories : [];
        const extractedTags = [...new Set([
          category,
          ...(community ? [community] : []),
          ...itemCategories.map(c => typeof c === 'string' ? c : (c as { _?: string })?._ || '').filter(Boolean)
        ])].map(t => t.trim()).filter(t => t.length > 0 && t.length < 50);

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
          videoUrl: null,
          videoType: 'none',
          mediaToDisplay: 'image',
          tags: extractedTags,
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

// Upload Media Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const fileUrl = `/api/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Seed Initial Users
async function seedUsersIfNeeded(db: Db) {
  try {
    const usersColl = db.collection('users');
    const count = await usersColl.countDocuments();
    if (count === 0) {
      await usersColl.insertMany([
        {
          name: 'Super Admin',
          email: 'admin@igbenews.com',
          role: 'Admin',
          status: 'Active',
          createdAt: new Date(),
        },
        {
          name: 'Adebola Okunade',
          email: 'adebola@igbenews.com',
          role: 'Editor',
          status: 'Active',
          createdAt: new Date(),
        },
        {
          name: 'Funmilayo Adebayo',
          email: 'funmilayo@igbenews.com',
          role: 'Editor',
          status: 'Active',
          createdAt: new Date(),
        }
      ]);
    }
  } catch (err) {
    console.error('Failed to seed users on startup. Database might be offline.', err);
  }
}

// Configure Pinned / Hero News Settings
app.get('/api/settings', async (_req, res) => {
  try {
    const db = await getDb();
    const settingsColl = db.collection('settings');
    let settings = await settingsColl.findOne({ name: 'homepage' });
    if (!settings) {
      settings = {
        name: 'homepage',
        pinnedHeroArticleId: null, // can be ID or slug of any article (RSS, YouTube/Video, or Editorial)
        pinnedHeroType: 'none', // 'none' means fallback to default featured algorithm
        updatedAt: new Date(),
      };
      await settingsColl.insertOne(settings);
    }
    res.json(settings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const db = await getDb();
    const settingsColl = db.collection('settings');
    const { pinnedHeroArticleId, pinnedHeroType } = req.body;
    await settingsColl.updateOne(
      { name: 'homepage' },
      {
        $set: {
          pinnedHeroArticleId,
          pinnedHeroType,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Users CRUD Endpoints
app.get('/api/users', async (_req, res) => {
  try {
    const db = await getDb();
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const db = await getDb();
    const { name, email, role, status } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }
    const result = await db.collection('users').insertOne({
      name,
      email,
      role: role || 'Editor',
      status: status || 'Active',
      createdAt: new Date(),
    });
    res.json({ _id: result.insertedId, name, email, role, status });
  } catch {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, email, role, status, updatedAt: new Date() } }
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Unique tags retrieval endpoint
app.get('/api/tags', async (_req, res) => {
  try {
    const db = await getDb();
    const tags = await db
      .collection('articles')
      .aggregate([
        { $match: { tags: { $exists: true, $ne: null } } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
      ])
      .toArray();
    res.json(tags);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Articles CRUD & Extended endpoints
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
    if (tag) {
      filter.tags = { $regex: new RegExp(`^${String(tag).trim()}$`, 'i') };
    }

    const articles = await db
      .collection('articles')
      .find(filter)
      .sort({ publishedAt: -1 })
      .limit(Number(limit) || 100)
      .toArray();

    res.json(articles);
  } catch {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

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
      videoUrl,
      videoType,
      mediaToDisplay,
      tags,
    } = req.body;

    if (!title || !body || !category) {
      res.status(400).json({ error: 'Title, body and category are required' });
      return;
    }

    const slug = slugify(`${title}-${Date.now()}`);
    const inputTags = Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [];
    const finalTags = [...new Set([category, ...(community ? [community] : []), ...inputTags])];

    const newArticle = {
      title,
      slug,
      summary: summary || stripHtml(body).slice(0, 300),
      body,
      category,
      imageUrl: imageUrl || null,
      imageCredit: imageCredit || null,
      author: author || 'Admin',
      location: location || null,
      community: community || null,
      isFeatured: !!isFeatured,
      isBreaking: !!isBreaking,
      readTimeMinutes: Number(readTimeMinutes) || Math.max(2, Math.ceil(stripHtml(body).split(/\s+/).length / 200)),
      publishedAt: new Date(),
      isAggregated: false,
      videoUrl: videoUrl || null,
      videoType: videoType || 'none', // 'youtube' | 'upload' | 'none'
      mediaToDisplay: mediaToDisplay || 'image', // 'image' | 'video'
      tags: finalTags,
    };

    const result = await db.collection('articles').insertOne(newArticle);
    res.json({ _id: result.insertedId, ...newArticle });
  } catch {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
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
      videoUrl,
      videoType,
      mediaToDisplay,
      tags,
    } = req.body;

    const inputTags = Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [];
    const finalTags = [...new Set([category, ...(community ? [community] : []), ...inputTags])];

    const updateFields: Record<string, unknown> = {
      title,
      summary: summary || stripHtml(body).slice(0, 300),
      body,
      category,
      imageUrl,
      imageCredit,
      author,
      location,
      community,
      isFeatured: !!isFeatured,
      isBreaking: !!isBreaking,
      readTimeMinutes: Number(readTimeMinutes) || Math.max(2, Math.ceil(stripHtml(body).split(/\s+/).length / 200)),
      videoUrl,
      videoType,
      mediaToDisplay,
      tags: finalTags,
      updatedAt: new Date(),
    };

    const query = id.length === 24 ? { _id: new ObjectId(id) } : { slug: id };

    await db.collection('articles').updateOne(query, { $set: updateFields });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const query = id.length === 24 ? { _id: new ObjectId(id) } : { slug: id };
    await db.collection('articles').deleteOne(query);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete article' });
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
    const articles = req.body;

    if (!Array.isArray(articles)) {
      res.status(400).json({ error: 'Expected an array of articles' });
      return;
    }

    const result = await db.collection('articles').insertMany(articles);
    res.json({ inserted: result.insertedCount });
  } catch {
    res.status(500).json({ error: 'Seeding failed' });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, async () => {
    try {
      await getDb();
      console.log(`IGBE News API running on port ${PORT}`);
    } catch (err) {
      console.error(`Error during startup initialization:`, err);
      console.log(`IGBE News API running on port ${PORT} (DB offline/failed to connect)`);
    }
  });
}

export default app;
