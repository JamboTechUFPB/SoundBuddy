import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { userRoutesDefinitions } from './routes/userRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import { healthRoutesDefinitions } from './routes/healthRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // cache preflight por 24 horas
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.BACK_PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc({
  definition: userRoutesDefinitions,
  apis: ['./src/backend/routes/*.js'],
})));

app.use('/api', userRoutes);
app.use('/health', healthRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
});