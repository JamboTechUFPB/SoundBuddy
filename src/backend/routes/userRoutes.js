import express from 'express';
import { userController } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { uploadProfileImage } from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.post('/users/create', uploadProfileImage.single('profileImage'), userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', authenticateToken, userController.logoutUser);
router.get('/refresh-token', authenticateToken, userController.refreshToken);
//router.get('/user', authenticateToken, userController.getUserInfo);
router.get('/user', authenticateToken, userController.getUserProfileBasicInfo);
router.get('/users/:name', userController.getUserPublicProfileInfo);
router.put('/users/update', authenticateToken, uploadProfileImage.single('profileImage'), userController.updateUserProfileBasicInfo);

export default router;


// openAPI definitions for swagger
export const userRoutesDefinitions = {
  openapi: '3.0.0',
  info: {
    title: 'User Routes API',
    version: '1.0.0',
    description: 'API para gerenciamento de usuários do SoundBuddy',
  },
  tags: [
    {
      name: 'User',
      description: 'Operações de gerenciamento de usuários',
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID único do usuário',
          },
          name: {
            type: 'string',
            description: 'Nome do usuário',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário',
          },
          role: {
            type: 'string',
            enum: ['musician', 'contractor', 'both'],
            description: 'Função do usuário no sistema',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação da conta',
          },
          lastLogin: {
            type: 'string',
            format: 'date-time',
            description: 'Data do último login',
          }
        },
      },
      LoginCredentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
          },
          password: {
            type: 'string',
            format: 'password',
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: {
            $ref: '#/components/schemas/User',
          },
          accessToken: {
            type: 'string',
          },
          refreshToken: {
            type: 'string',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/api/users/create': {
      post: {
        tags: ['User'],
        summary: 'Criar novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  name: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                  },
                  password: {
                    type: 'string',
                    minLength: 6,
                  },
                  role: {
                    type: 'string',
                    enum: ['musician', 'contractor', 'both'],
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/login': {
      post: {
        tags: ['User'],
        summary: 'Autenticar usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginCredentials',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },
          '401': {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/logout': {
      post: {
        tags: ['User'],
        summary: 'Realizar logout',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          '204': {
            description: 'Logout realizado com sucesso',
          },
          '401': {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/refresh-token': {
      get: {
        tags: ['User'],
        summary: 'Renovar token de acesso',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Token renovado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: {
                      type: 'string',
                    },
                    refreshToken: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/user': {
      get: {
        tags: ['User'],
        summary: 'Obter informações do usuário',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Informações do usuário obtidas com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '401': {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
};