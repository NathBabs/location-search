import dotenv from 'dotenv';
dotenv.config();
import log from '../utils/logger';

const uri = process.env.MONGODB_URI as string;
const databaseName = "locations";
const index_name = "ngram_index";

import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

function connectDatabase() {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(uri);
        client.connect(err => {
            if (err) {
                reject(err);
            } else {
                log.info('Connected to database');
                db = client.db(databaseName);
                const collection = db.collection("location_data");
                const index_exists = collection.indexExists(index_name);
                if (!index_exists) {
                    log.info('Creating index');
                    collection.createIndex({
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
                            name_ngrams_prefix: 40,
                            ascii_ngrams_prefix: 20
                        }
                    });
                }
                resolve(db);
            }
        });
    });
}

export {
    client,
    db,
    connectDatabase
}
