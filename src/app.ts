import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
//import routes from './routes';
import type { CustomTypeError } from './utils/CustomError';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));

//app.use('/', routes);

app.use(
  (err: CustomTypeError, req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(err.statusCode || 400).send({ success: false });
    }

    const { message = 'Something went wrong', statusCode = 500 } = err;

    return res.status(statusCode).send({ success: false, message: message });
  }
);

export default app;
