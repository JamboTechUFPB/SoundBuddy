import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';  

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});