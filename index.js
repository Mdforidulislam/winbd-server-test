import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression'; // Add compression
import helmet from 'helmet'; // Add helmet
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './src/db/connectDB.js';
import { router } from './src/routes/index.js';
import { globalErrorHandler } from './src/utils/globalErrorHandler.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(
  cors({
      origin: 'https://winbd-client-test-mr2d.vercel.app', 
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, 
  })
);


app.use(compression()); // Enable gzip compression
app.use(helmet()); // Use helmet for security headers
app.use(bodyParser.json());

// Set cache-control headers for static files
app.use(express.static('public', {
  maxAge: '1y', // Cache static files for 1 year
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

app.use(router);

// Health check route
app.get("/health", (req, res) => {
  res.send('admin system running');
});

// Error handling middleware
app.all('*', (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server`);
  error.status = 404;
  next(error);
});
app.use(globalErrorHandler);

// Connect to the database and start the server
const main = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Admin management system running on port ${port}`);
  });
};

main();
export default app;
