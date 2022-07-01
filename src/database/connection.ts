import dotenv from 'dotenv';
dotenv.config();
import log from '../utils/logger';

const uri = process.env.MONGODB_URI as string;

import { MongoClient } from 'mongodb';

export default async function connectDatabase () { 
    const client = new MongoClient(uri);
    try {
        await client.connect();
        log.info('Connected to MongoDB');
        client.db("locations");
        // create index on name_ngrams, ascii_ngrams and name
        await client.db("locations").collection("location_data").createIndex({
            name_ngrams: "text",
            ascii_ngrams: "text",
            name_ngrams_prefix: "text",
            ascii_ngrams_prefix: "text",
            name: "text"
        }, {
            name: "ngram_index",
            weights: {
                name: 1,
                name_ngrams: 2,
                ascii_ngrams: 5,
                name_ngrams_prefix: 20,
                ascii_ngrams_prefix: 20
            }
        });
        return client;
    } catch (err) { 
        log.error(err);
        process.exit(1);
    } finally {
        await client.close();
    }
}
