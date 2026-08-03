import { MongoClient } from 'mongodb';
import { mockArticles } from './mockData.js';

const MONGODB_URI =
  'mongodb+srv://bolatan_db_user:28A0Oh00Ib4c3qrU@cluster0.ub5jkhi.mongodb.net/?appName=Cluster0';

const DB_NAME = 'igbe_news';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const formattedArticles = mockArticles.map((art) => {
    const finalTags = [...new Set([
      art.category,
      ...(art.community ? [art.community] : []),
      ...(art.tags || [])
    ])];
    return {
      ...art,
      publishedAt: new Date(art.publishedAt),
      tags: finalTags,
    };
  });

  await db.collection('articles').drop().catch(() => {});
  const result = await db.collection('articles').insertMany(formattedArticles);
  await db.collection('articles').createIndex({ slug: 1 }, { unique: true });
  await db.collection('articles').createIndex({ category: 1 });
  await db.collection('articles').createIndex({ community: 1 });
  await db.collection('articles').createIndex({ tags: 1 });
  await db.collection('articles').createIndex({ publishedAt: -1 });

  console.log(`Inserted ${result.insertedCount} articles into ${DB_NAME}`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
