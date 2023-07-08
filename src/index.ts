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

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use(rateLimit({
  windowMs: RATE_LIMIT_PERIOD as number,
  max: RATE_LIMIT_REQUESTS as number,
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
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Add routes
app.use('/', priceRoutes); 

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
