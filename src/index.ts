import express from 'express';
import { rateLimit } from 'express-rate-limit';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import priceRoutes from './routes/priceRoutes';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { PORT, RATE_LIMIT_PERIOD, RATE_LIMIT_REQUESTS } from './constants';

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create Express application

// Middleware setup
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Log HTTP requests
app.use(rateLimit({
  windowMs: RATE_LIMIT_PERIOD as number, // Set rate limiting window duration
  max: RATE_LIMIT_REQUESTS as number, // Set maximum number of requests within the window
}));

// Swagger implementation
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Trader Joe - Price Feed API',
    version: '1.0.0',
    description: 'Price Fee API for Trader Joe v1, v2 & v2.1',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Serve Swagger UI at '/docs' endpoint

// Add routes
app.use('/', priceRoutes); // Mount price-related routes at root ('/') endpoint

// Start server
export const listener = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;