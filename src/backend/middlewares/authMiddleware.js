// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
};

export const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  user.refreshToken = refreshToken;
  await user.save();
  return refreshToken;
};

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ message: 'Token expired' });
      }
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      return res.status(403).json({ message: 'Forbidden ' });
    }
    req.user = user;
    next();
  });
};