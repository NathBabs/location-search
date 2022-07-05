/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs/promises';
import * as path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes';
import { customError, CustomTypeError } from './utils/CustomError';
import rateLimit, { MemoryStore } from 'express-rate-limit';
import { ips } from '../ips';

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: false }));
app.set('trust proxy', true);

// if node env is not test, then use rate limit
if (process.env.NODE_ENV !== 'test') {
  //rate limit to limit the number of requests from a particular given IP
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again after some time',
    store: new MemoryStore(),
    skip: (req, res) => {
      if (ips.includes(req.ip)) {
        return true;
      }
      return false;
    },
  });
  app.use(limiter);
}

// retrurn today's date in YYYY-MM-DD format in base route
app.get('/', (req, res) => {
  res.send(
    `Welcome 👋 To Location search ${new Date().toISOString().split('T')[0]}`
  );
});

app.use('/', routes);
// return 404 if no other route matched
app.use((req, res, next) => {
  const err: CustomTypeError = customError({
    statusCode: 404,
    message: 'Not Found',
  });
  next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(err.statusCode || 400).send({ success: false });
  }

  const { message = 'Something went wrong', statusCode = 500 } = err;

  return res.status(statusCode).send({ success: false, message: message });
});

export default app;
