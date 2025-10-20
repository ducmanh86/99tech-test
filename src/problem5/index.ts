import 'dotenv/config';
import helmet from 'helmet';
import express from 'express';
import { v7 as uuidv7 } from 'uuid';
import { pinoHttp } from 'pino-http';
import compression from 'compression';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
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
    transport:
      (process.env.NODE_ENV?.toLowerCase() ?? 'development') === 'development' // use pretty print in development
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

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server on port 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
