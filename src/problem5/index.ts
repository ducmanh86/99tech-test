import 'dotenv/config';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import { v7 as uuidv7 } from 'uuid';
import { pinoHttp } from 'pino-http';
import compression from 'compression';
import { MongoError } from 'mongodb';

import { isDev } from './configs/utils';
import { AppDataSource } from './configs/database';
import userRoutes from './modules/users/users.controller';
import errorMiddleware, { ErrorResponse, HttpError, NotFoundError } from './middlewares/error.middleware';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
// HTTP request logging
app.use(
  pinoHttp({
    base: null,
    quietReqLogger: true,
    serializers: {
      // res: () => undefined, // Completely hides the response from logs
    },
    genReqId: () => uuidv7(),
    customProps: (req, res) => {
      const { statusCode } = res;
      const { ip, method, originalUrl: url } = req;
      const userAgent = req.get('user-agent');
      // custom properties for auto http logging
      return {
        ip,
        url,
        method,
        userAgent,
        statusCode,
        context: 'HTTP',
      };
    },
    transport: isDev() // use pretty print in development
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'SYS:standard',
            singleLine: false,
            levelFirst: true,
          },
        }
      : undefined,
  }),
);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// API Routes
const apiRouter = express.Router();
apiRouter.use('/users', userRoutes);

// Apply the prefix to all routes defined in apiRouter
app.use('/api/v1', apiRouter);

// 404 handler
app.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Global error handling middleware
app.use(errorMiddleware);

async function initializeApp() {
  try {
    // Initialize TypeORM
    await AppDataSource.initialize();
    console.log('Database connection established successfully');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    if (error instanceof MongoError) {
      console.error('MongoDB connection error:', error.message);
    } else {
      console.error('Failed to initialize application:', error);
    }
    process.exit(1);
  }
}

initializeApp().catch(console.error);
