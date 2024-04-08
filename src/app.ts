import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

import { errorHandlerMiddleware } from './middlewares';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: JSON.parse(process.env.ALLOWED_CORS_ORIGIN as string),
    credentials: true,
  }),
);
app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(cookieParser());

app.use(errorHandlerMiddleware);

export default app;
