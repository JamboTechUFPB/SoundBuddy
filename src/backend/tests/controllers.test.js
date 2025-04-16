import { userController } from '../../controllers/userController.js';
import userModel from "../../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../../middlewares/authMiddleware.js";
import bcrypt from 'bcrypt';
import httpMocks from 'node-mocks-http';
import dotenv from 'dotenv';

dotenv.config();

jest.mock("../../models/userModel.js");
jest.mock('bcrypt');
jest.mock("../../middlewares/authMiddleware.js");

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
        tags: ['drums'],
      },
    });
    const res = httpMocks.createResponse();    

    userModel.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedpass123');
    generateAccessToken.mockReturnValue('fakeAccessToken');
    generateRefreshToken.mockResolvedValue('fakeRefreshToken');

    const saveMock = jest.fn().mockResolvedValue();
    userModel.mockImplementation(() => ({
      save: saveMock,
      name: 'João da Silva',
      email: 'joaodasilva@email.com',
      password: 'hashedpass123',
      tags: ['drums'],
      userType: 'musician',
    }));

    await userController.createUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(data.accessToken).toBe('fakeAccessToken');
    expect(data.refreshToken).toBe('fakeRefreshToken');
    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'joaodasilva@email.com' });
    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
  });

  it('deve retornar 400 se o email estiver ausente', async () => {
    const req = httpMocks.createRequest({
      body: { password: '123456' },
    });
    const res = httpMocks.createResponse();

    await userController.createUser(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Email is required' });
  });

  it('deve retornar 400 se a senha for muito curta', async () => {
    const req = httpMocks.createRequest({
      body: { email: 'joaodasilva@email.com', password: '123' },
    });
    const res = httpMocks.createResponse();

    await userController.createUser(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Password must have at least 6 characters' });
  });

  it('deve retornar 400 se o usuário já existir', async () => {
    const req = httpMocks.createRequest({
      body: { email: 'joaodasilva@email.com', password: '123456' },
    });
    const res = httpMocks.createResponse();

    userModel.findOne.mockResolvedValue({ email: 'joaodasilva@email.com' });

    await userController.createUser(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'User already exists' });
  });

  it('deve retornar 400 se o email não conter @', async () => {
    const req = httpMocks.createRequest({
      body: { email: 'joaodasilvaemail.com', password: '123456' },
    });
    const res = httpMocks.createResponse();

    await userController.createUser(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Email is invalid' });
  });
});
