import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDatabase from './database/connection';
import logger from './utils/logger';

const port = process.env.PORT || 1337

app.listen(port, async () => {
    connectDatabase();
    logger.info(`App is running on port ${port}`);
})