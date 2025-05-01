import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middlewares/authMiddleware.js';

jest.mock('jsonwebtoken');

describe('authenticateToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer validToken',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('Deve chamar next() se o token for válido', () => {
    const decodedUser = { id: '123' };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decodedUser);
    });

    authenticateToken(req, res, next);

    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
  });

  test('Deve retornar 401 se não houver token', () => {
    req.headers.authorization = null;

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve retornar 403 se o token for inválido', () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new jwt.JsonWebTokenError('Invalid token'), null);
    });

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve retornar 403 se o token estiver expirado', () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new jwt.TokenExpiredError('Token expired', new Date()), null);
    });

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token expired' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve retornar 403 para outros erros desconhecidos', () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Some error'), null);
    });

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden ' });
    expect(next).not.toHaveBeenCalled();
  });
});
