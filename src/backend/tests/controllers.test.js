import { userController } from '../../controllers/userController.js';
import userModel from "../../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../../middlewares/authMiddleware.js";
// auth stuff
import bcrypt from 'bcrypt';
import httpMocks from 'node-mocks-http';
import dotenv from 'dotenv';

dotenv.config();

jest.mock("../../models/userModel.js");
jest.mock('bcrypt');
jest.mock("../../middlewares/authMiddleware.js");

//resetar os mocks antes de cada teste
describe('userController.createUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('deve criar usuário e retornar 201 com tokens', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          body: {
            name: 'João da Silva',
            email: 'joaodasilva@email.com',
            password: '123456',
            userType: 'musician',
            tags: ['tag1'],
          },
        });
        const res = httpMocks.createResponse();    