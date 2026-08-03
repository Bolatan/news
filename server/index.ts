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
import { mockArticles, mockUsers, mockSettings } from './mockData';

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
let uploadsDir = path.join(__dirname, 'uploads');

// In Vercel serverless environments, the local filesystem is read-only.
// We fall back to the writable /tmp/uploads directory to prevent startup/import failures.
if (process.env.VERCEL) {
  uploadsDir = path.join('/tmp', 'uploads');
}

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.error(`Failed to create uploads directory "${uploadsDir}". Falling back to /tmp/uploads...`, err);
  uploadsDir = path.join('/tmp', 'uploads');
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (fallbackErr) {
    console.error('Failed to create fallback uploads directory in /tmp/uploads:', fallbackErr);
  }
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

// Fallback in-memory databases state
let isInMemoryFallback = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let articlesInMemory: any[] = mockArticles.map((art, index) => {
  const finalTags = [...new Set([
    art.category,
    ...(art.community ? [art.community] : []),
    ...(art.tags || [])
  ])];
  return {
    _id: `mem-art-id-${index}`,
    ...art,
    publishedAt: new Date(art.publishedAt),
    tags: finalTags,
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let usersInMemory: any[] = mockUsers.map(u => ({ ...u }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let settingsInMemory: any = { ...mockSettings };

async function getDb(): Promise<Db | null> {
  if (isInMemoryFallback) {
    return null;
  }
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        connectTimeoutMS: 4000,
        socketTimeoutMS: 4000,
        serverSelectionTimeoutMS: 4000,
      });
      await client.connect();
      const db = client.db(DB_NAME);
      await seedUsersIfNeeded(db);
      return db;
    }
    return client.db(DB_NAME);
  } catch (err) {
    console.error('Failed to connect to MongoDB, falling back to in-memory database:', err);
    isInMemoryFallback = true;
    return null;
  }
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
  let db: Db | null = null;
  try {
    db = await getDb();
  } catch {
    isInMemoryFallback = true;
  }

  const collection = db && !isInMemoryFallback ? db.collection('articles') : null;
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

        if (collection) {
          try {
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
            continue;
          } catch (err) {
            console.error('MongoDB insert in refreshFeeds failed, switching to in-memory fallback:', err);
            isInMemoryFallback = true;
          }
        }

        // In-memory fallback insert
        const existingMem = articlesInMemory.find(a => a.slug === slug);
        if (existingMem) {
          feedSkipped++;
          continue;
        }

        const itemCategories = Array.isArray(item.categories) ? item.categories : [];
        const extractedTags = [...new Set([
          category,
          ...(community ? [community] : []),
          ...itemCategories.map(c => typeof c === 'string' ? c : (c as { _?: string })?._ || '').filter(Boolean)
        ])].map(t => t.trim()).filter(t => t.length > 0 && t.length < 50);

        articlesInMemory.push({
          _id: new ObjectId().toString(),
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
      await usersColl.insertMany(mockUsers.map(u => {
        const { _id, ...rest } = u;
        return {
          _id: new ObjectId(_id),
          ...rest,
        };
      }));
    }
  } catch (err) {
    console.error('Failed to seed users on startup. Database might be offline.', err);
  }
}

// Configure Pinned / Hero News Settings
app.get('/api/settings', async (_req, res) => {
  try {
    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
        const settingsColl = db.collection('settings');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let settings: any = await settingsColl.findOne({ name: 'homepage' });
        if (!settings) {
          const defaultSettings = {
            name: 'homepage',
            pinnedHeroArticleId: null, // can be ID or slug of any article (RSS, YouTube/Video, or Editorial)
            pinnedHeroType: 'none', // 'none' means fallback to default featured algorithm
            updatedAt: new Date(),
          };
          await settingsColl.insertOne(defaultSettings);
          settings = defaultSettings;
        }
        res.json(settings);
        return;
      } catch (err) {
        console.error('MongoDB settings fetch failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    res.json(settingsInMemory);
  } catch {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const { pinnedHeroArticleId, pinnedHeroType } = req.body;
    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
        const settingsColl = db.collection('settings');
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
        return;
      } catch (err) {
        console.error('MongoDB settings update failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    settingsInMemory = {
      ...settingsInMemory,
      pinnedHeroArticleId,
      pinnedHeroType,
      updatedAt: new Date(),
    };
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Users CRUD Endpoints
app.get('/api/users', async (_req, res) => {
  try {
    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
        const users = await db.collection('users').find({}).toArray();
        res.json(users);
        return;
      } catch (err) {
        console.error('MongoDB users fetch failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    res.json(usersInMemory);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }
    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
        const result = await db.collection('users').insertOne({
          name,
          email,
          role: role || 'Editor',
          status: status || 'Active',
          createdAt: new Date(),
        });
        res.json({ _id: result.insertedId, name, email, role, status });
        return;
      } catch (err) {
        console.error('MongoDB user creation failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    const newUser = {
      _id: new ObjectId().toString(),
      name,
      email,
      role: role || 'Editor',
      status: status || 'Active',
      createdAt: new Date(),
    };
    usersInMemory.push(newUser);
    res.json(newUser);
  } catch {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
        const query = id.length === 24 ? { _id: new ObjectId(id) } : { _id: id };
        await db.collection('users').updateOne(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          query as any,
          { $set: { name, email, role, status, updatedAt: new Date() } }
        );
        res.json({ success: true });
        return;
      } catch (err) {
        console.error('MongoDB user update failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    const idx = usersInMemory.findIndex(u => u._id === id);
    if (idx !== -1) {
      usersInMemory[idx] = {
        ...usersInMemory[idx],
        name,
        email,
        role,
        status,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updatedAt: new Date() as any,
      };
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
        const query = id.length === 24 ? { _id: new ObjectId(id) } : { _id: id };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await db.collection('users').deleteOne(query as any);
        res.json({ success: true });
        return;
      } catch (err) {
        console.error('MongoDB user deletion failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    usersInMemory = usersInMemory.filter(u => u._id !== id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Unique tags retrieval endpoint
app.get('/api/tags', async (_req, res) => {
  try {
    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
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
        return;
      } catch (err) {
        console.error('MongoDB tags query failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    const tagCounts: Record<string, number> = {};
    for (const art of articlesInMemory) {
      if (art.tags) {
        for (const t of art.tags) {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        }
      }
    }
    const tags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    res.json(tags);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Articles CRUD & Extended endpoints
app.get('/api/articles', async (req, res) => {
  try {
    const { category, community, featured, breaking, limit, source, tag } = req.query;
    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
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
        return;
      } catch (err) {
        console.error('MongoDB articles query failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    // In-memory fallback
    let filtered = [...articlesInMemory];
    if (category) filtered = filtered.filter(a => a.category === category);
    if (community) filtered = filtered.filter(a => a.community === community);
    if (featured === 'true') filtered = filtered.filter(a => a.isFeatured);
    if (breaking === 'true') filtered = filtered.filter(a => a.isBreaking);
    if (source === 'aggregated') filtered = filtered.filter(a => a.isAggregated);
    if (source === 'editorial') filtered = filtered.filter(a => !a.isAggregated);
    if (tag) {
      const cleanTag = String(tag).trim().toLowerCase();
      filtered = filtered.filter(a => a.tags?.some(t => t.toLowerCase() === cleanTag));
    }
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    if (limit) filtered = filtered.slice(0, Number(limit));
    res.json(filtered);
  } catch {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
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

    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
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
        return;
      } catch (err) {
        console.error('MongoDB article creation failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    // In-memory fallback
    const newArticle = {
      _id: new ObjectId().toString(),
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
      videoType: videoType || 'none',
      mediaToDisplay: mediaToDisplay || 'image',
      tags: finalTags,
    };
    articlesInMemory.unshift(newArticle);
    res.json(newArticle);
  } catch {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  try {
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

    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await db.collection('articles').updateOne(query as any, { $set: updateFields });
        res.json({ success: true });
        return;
      } catch (err) {
        console.error('MongoDB article update failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    // In-memory fallback
    const idx = articlesInMemory.findIndex(a => a._id === id || a.slug === id);
    if (idx !== -1) {
      articlesInMemory[idx] = {
        ...articlesInMemory[idx],
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updatedAt: new Date() as any,
      };
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
        const query = id.length === 24 ? { _id: new ObjectId(id) } : { slug: id };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await db.collection('articles').deleteOne(query as any);
        res.json({ success: true });
        return;
      } catch (err) {
        console.error('MongoDB article deletion failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    articlesInMemory = articlesInMemory.filter(a => a._id !== id && a.slug !== id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

app.get('/api/articles/:slug', async (req, res) => {
  try {
    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
        const article = await db
          .collection('articles')
          .findOne({ slug: req.params.slug });

        if (!article) {
          res.status(404).json({ error: 'Article not found' });
          return;
        }
        res.json(article);
        return;
      } catch (err) {
        console.error('MongoDB article fetch failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    const article = articlesInMemory.find(a => a.slug === req.params.slug);
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
    if (db && !isInMemoryFallback) {
      try {
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
        return;
      } catch (err) {
        console.error('MongoDB related articles fetch failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    // In-memory fallback
    const article = articlesInMemory.find(a => a.slug === req.params.slug);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    const filterCategory = article.category;
    const filterCommunity = article.community;
    let related = articlesInMemory.filter(a => a.slug !== req.params.slug);
    if (filterCommunity) {
      related = related.filter(a => a.community === filterCommunity || a.category === filterCategory);
    } else {
      related = related.filter(a => a.category === filterCategory);
    }
    related.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    res.json(related.slice(0, 4));
  } catch {
    res.status(500).json({ error: 'Failed to fetch related articles' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();

    if (!q) {
      res.json([]);
      return;
    }

    const db = await getDb();
    if (db && !isInMemoryFallback) {
      try {
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
        return;
      } catch (err) {
        console.error('MongoDB search query failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    // In-memory fallback
    const cleanQ = q.toLowerCase();
    const results = articlesInMemory.filter(a =>
      a.title.toLowerCase().includes(cleanQ) ||
      a.summary.toLowerCase().includes(cleanQ) ||
      a.body.toLowerCase().includes(cleanQ) ||
      a.author.toLowerCase().includes(cleanQ) ||
      (a.location && a.location.toLowerCase().includes(cleanQ)) ||
      (a.community && a.community.toLowerCase().includes(cleanQ))
    );
    results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    res.json(results.slice(0, 30));
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
    if (db && !isInMemoryFallback) {
      try {
        const total = await db.collection('articles').countDocuments();
        const aggregated = await db.collection('articles').countDocuments({ isAggregated: true });
        const editorial = total - aggregated;
        const byCommunity: Record<string, number> = {};
        for (const c of COMMUNITIES) {
          byCommunity[c] = await db.collection('articles').countDocuments({ community: c });
        }
        res.json({ total, aggregated, editorial, byCommunity, sources: FEED_SOURCES.length });
        return;
      } catch (err) {
        console.error('MongoDB status fetch failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    // In-memory fallback
    const total = articlesInMemory.length;
    const aggregated = articlesInMemory.filter(a => a.isAggregated).length;
    const editorial = total - aggregated;
    const byCommunity: Record<string, number> = {};
    for (const c of COMMUNITIES) {
      byCommunity[c] = articlesInMemory.filter(a => a.community === c).length;
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

    if (db && !isInMemoryFallback) {
      try {
        const result = await db.collection('articles').insertMany(articles);
        res.json({ inserted: result.insertedCount });
        return;
      } catch (err) {
        console.error('MongoDB seed endpoint failed, switching to in-memory fallback:', err);
        isInMemoryFallback = true;
      }
    }
    // In-memory fallback
    articlesInMemory = articles.map((a, index) => ({
      _id: `seed-id-${index}-${Date.now()}`,
      ...a,
    }));
    res.json({ inserted: articles.length });
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
