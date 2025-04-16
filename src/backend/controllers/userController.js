import userModel from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../middlewares/authMiddleware.js";
// auth stuff
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const userController = {

  async createUser(req, res){
    try {
      const name = req.body.name;
      const email = req.body.email || null;
      const password = req.body.password || null;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
      if (password && password.length < 6) {
        return res.status(400).json({ message: 'Password must have at least 6 characters' });
      }
      // check if user already exists by email
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      let user;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      user = new userModel({ name, email, password: hashedPassword });
      await user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      res.status(201).json({ user: user.toJSON(), accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async loginUser(req, res) {
    try{
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await userModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const accessToken = generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      user.lastLogin = new Date();
      await user.save();

      const userResponse = {
        ...user.toJSON(),
      }

      res.status(200).json({ user: userResponse, accessToken, refreshToken });
    } catch (error) {
      console.error("Erro no login: ", error);
      res.status(500).json({ message: error.message });
    }
  },

  async refreshToken(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token after "Bearer"
    if (!token) return res.sendStatus(401); // Unauthorized if no token is present

    const user = await userModel.findOne({ refreshToken: token });
    if (!user) return res.sendStatus(403); // Forbidden if token is not associated with a user

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userData) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid

        const accessToken = generateAccessToken(userData);
        const refreshToken = await generateRefreshToken(userData);
        res.json({ accessToken, refreshToken });
    });
  },

  async logoutUser(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Get the token after "Bearer"
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }  // Unauthorized if no token is present
  
      const user = await userModel.findOne({ refreshToken: token });
      if (!user) {
        return res.status(403).json({ message: 'Forbidden' });
      } // Forbidden if token is not associated with a user
  
      // Remove the refresh token
      user.refreshToken = null;
      await user.save();
      
      res.clearCookie('refreshToken'); // Clear the refresh token cookie

      res.sendStatus(204); // No content

    } catch (error) {
      console.error("Erro no logout: ", error);
      res.status(500).json({ message: error.message });
    }
  },

  async getUsers(req, res){
    try {
      const users = await userModel.find();
      if (!users.length || users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}