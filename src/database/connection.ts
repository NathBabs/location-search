import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import log from '../utils/logger';

const uri = process.env.DATABASE_URL as string;

//create function to connect to mongdb database
export default async function connectDatabase() {
    return mongoose.connect(uri).then(() => console.log('Database connected')).catch(err => {
        log.error(err)
        process.exit(1);
    })
};