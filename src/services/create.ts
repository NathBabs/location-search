
import type { MongoClient } from 'mongodb';
import log from '../utils/logger';

export async function insert(client: MongoClient, data: any[]) {
    const results = await client.db("locations").collection("location_data").insertOne(data);
    log.info(`Inserted ${results.insertedId} documents`);
}