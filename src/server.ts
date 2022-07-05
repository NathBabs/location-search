import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { connectDatabase } from './database/connection';
import logger from './utils/logger';
//import { start } from './services/extract-transform-load';

/* const readable = createReadStream(
  path.join(process.cwd(), 'cities_canada-usa.tsv')
); */

const port = process.env.PORT || 1337;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      logger.info(`App is running on port ${port}`);
      // do not uncomment this line, if the operation has been run once
      //start(readable);
    });
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
