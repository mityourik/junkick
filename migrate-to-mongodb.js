import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Загружаем переменные окружения из .env файла
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DB_NAME || 'junkick';

function transformDocument(doc) {
  const transformed = { ...doc };

  if (transformed.id) {
    transformed.customId = transformed.id;
    delete transformed.id;
  }

  if (transformed.ownerId) {
    transformed.ownerId = String(transformed.ownerId);
  }

  if (transformed.teamMembers && Array.isArray(transformed.teamMembers)) {
    transformed.teamMembers = transformed.teamMembers.map(id => String(id));
  }

  if (transformed.userId) {
    transformed.userId = String(transformed.userId);
  }

  if (transformed.projectId) {
    transformed.projectId = String(transformed.projectId);
  }

  return transformed;
}

async function migrateToMongoDB() {
  let client;

  try {
    console.log('Чтение из db.json...');
    const dbPath = join(__dirname, 'db.json');
    const rawData = readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log('Подключение к MongoDB Atlas...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DATABASE_NAME);
    console.log(`Подключение к базе данных "${DATABASE_NAME}" успешно`);

    console.log('Очищаем существующие коллекции...');
    const collections = [
      'users',
      'projects',
      'roles',
      'technologies',
      'categories',
      'applications',
      'sessions',
    ];

    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).drop();
        console.log(`Коллекция "${collectionName}" очищена`);
      } catch (error) {
        if (error.code === 26) {
          console.log(`  Коллекция "${collectionName}" не существует, пропускаем`);
        } else {
          throw error;
        }
      }
    }

    console.log('Начинаем миграцию данных...');

    for (const [collectionName, documents] of Object.entries(data)) {
      if (!Array.isArray(documents)) {
        console.log(`Пропускаем "${collectionName}" - не массив`);
        continue;
      }

      if (documents.length === 0) {
        console.log(`Пропускаем "${collectionName}" - пустой массив`);
        continue;
      }

      console.log(`\nМигрируем коллекцию "${collectionName}" (${documents.length} документов)...`);

      const transformedDocuments = documents.map(transformDocument);

      const collection = db.collection(collectionName);
      const result = await collection.insertMany(transformedDocuments);

      console.log(`Успешно вставлено ${result.insertedCount} документов`);

      if (collectionName !== 'sessions') {
        await collection.createIndex({ customId: 1 }, { unique: true });
        console.log(`Создан индекс для customId в коллекции "${collectionName}"`);
      }
    }

    console.log('\nСоздаем дополнительные индексы...');

    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    console.log('Индексы для users созданы');

    await db.collection('projects').createIndex({ ownerId: 1 });
    await db.collection('projects').createIndex({ category: 1 });
    await db.collection('projects').createIndex({ status: 1 });
    await db.collection('projects').createIndex({ name: 'text', description: 'text' });
    console.log(' Индексы для projects созданы');

    await db.collection('applications').createIndex({ projectId: 1 });
    console.log(' Индексы для applications созданы');

    console.log('\nМиграция завершена успешно!');
    console.log('\nСтатистика:');

    for (const collectionName of collections) {
      const count = await db.collection(collectionName).countDocuments();
      if (count > 0) {
        console.log(`${collectionName}: ${count} документов`);
      }
    }
  } catch (error) {
    console.error('Ошибка при миграции:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\nСоединение с MongoDB закрыто');
    }
  }
}

if (!process.env.MONGODB_URI) {
  console.error('Переменная окружения MONGODB_URI не установлена');
  console.log('Создайте файл .env со строкой подключения к MongoDB Atlas:');
  console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/');
  console.log('DB_NAME=junkick');
  process.exit(1);
}

migrateToMongoDB().catch(console.error);
