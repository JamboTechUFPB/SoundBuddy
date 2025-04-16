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
      
      const userType = req.body.userType || null;
      const tags = req.body.tags || [];

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
      
      user = new userModel({ name, email, password: hashedPassword, tags, userType });
      await user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      res.status(201).json({ user, accessToken, refreshToken });
    } catch (error) {
      console.error("Error creating user: ", error);
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
    try {
      // Busca token primeiro no header, depois nos cookies
      const tokenFromHeader = req.headers['authorization']?.split(' ')[1];
      const tokenFromCookie = req.cookies?.refreshToken;
      const refreshToken = tokenFromHeader || tokenFromCookie;

      if (!refreshToken) {
          return res.status(401).json({
              message: 'Refresh token não fornecido'
          });
      }

      // Verifica validade do token
      const userData = await new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
      });

      // Busca usuário com o token
      const user = await userModel.findOne({ refreshToken });
      if (!user) {
          return res.status(403).json({
              message: 'Token não associado a nenhum usuário'
          });
      }

      if (userData.id !== user._id.toString()) {
          return res.status(403).json({
              message: 'Token não associado a este usuário'
          });
      }

      // Gera novos tokens
      const accessToken = generateAccessToken(user);
      const newRefreshToken = await generateRefreshToken(user);
      
      user.refreshToken = newRefreshToken;
      await user.save();

      return res.json({
          accessToken,
          refreshToken: newRefreshToken
      });

    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
          return res.status(401).json({
              message: 'Refresh token expirado'
          });
      }

      if (error instanceof jwt.JsonWebTokenError) {
          return res.status(403).json({
              message: 'Refresh token inválido'
          });
      }

      return res.status(500).json({
          message: 'Erro interno do servidor'
      });
    }
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
  },
  async getUserInfo(req, res){
    try {
      // get logged user info
      const userId = req.user.id? req.user.id : req.user._id;
      const user = await userModel.find( { _id: userId } );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
}