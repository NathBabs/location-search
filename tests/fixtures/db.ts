import { MongoMemoryServer } from 'mongodb-memory-server';
import mongodb, { MongoClient } from 'mongodb';
import { data } from './data';
import log from '../../src/utils/logger';

const databaseName = 'locations';
const index_name = 'ngram_index';

let client: MongoClient;
let db: mongodb.Db;

export const dbConnection = async () => {
  try {
    const mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    const uri = mongoUri;
    client = await mongodb.MongoClient.connect(uri);
    db = client.db(databaseName);
    const collection = db.collection('location_data');
    const index_exists = collection.indexExists(index_name);
    if (!index_exists) {
      log.info('Creating index');
      collection.createIndex(
        {
          name_ngrams: 'text',
          ascii_ngrams: 'text',
          name_ngrams_prefix: 'text',
          ascii_ngrams_prefix: 'text',
          name: 'text',
        },
        {
          name: 'ngram_index',
          weights: {
            name: 1,
            name_ngrams: 2,
            ascii_ngrams: 5,
            name_ngrams_prefix: 40,
            ascii_ngrams_prefix: 20,
          },
        }
      );
    }

    return db;
  } catch (error) {
    log.error(error);
  }
};

export const disconnect = async (client: MongoClient) => {
  await client.close();
};

// insert data into the database
export const insert = async (db: any) => {
  const collection = db.collection('location_data');
  const results = await collection.insertMany(data);
  console.log(`Inserted ${results.insertedCount} documents`);
};

export { db, client };
