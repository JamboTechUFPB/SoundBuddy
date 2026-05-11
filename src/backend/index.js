import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { userRoutesDefinitions } from './routes/userRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import { healthRoutesDefinitions } from './routes/healthRoutes.js';

dotenv.config();

const app = express();

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // cache preflight por 24 horas
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/data/uploads', express.static('data/uploads'));

const port = process.env.BACK_PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc({
  definition: userRoutesDefinitions,
  apis: ['./src/backend/routes/*.js'],
})));

app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/health', healthRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
});