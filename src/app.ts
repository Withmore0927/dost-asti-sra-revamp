import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

import { errorHandlerMiddleware } from './middlewares';

import apiRoutes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.ALLOWED_CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(cookieParser());

app.use('/api', apiRoutes);

app.use(errorHandlerMiddleware);

export default app;
