import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
// Conexão com o MongoDB
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
db.once('open', () => {
  console.log('MongoDB connection opened');
});

export default db;