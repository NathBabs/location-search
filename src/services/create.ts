import { db } from '../database/connection';
import log from '../utils/logger';

export async function insert(data: any[]) {
  const results = await db.collection('location_data').insertMany(data);
  log.info(`Inserted ${results.insertedCount} documents`);
}
