import express from 'express';
import { heartbeatController } from '../controllers/heartbeatController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});
router.get('/database', heartbeatController.checkDatabaseHealth);

export default router;

export const healthRoutesDefinitions = {
  "/health": {
    "get": {
      "tags": ["Health"],
      "summary": "Check API health",
      "description": "Check if the API is running",
      "responses": {
        "200": {
          "description": "API is running"
        }
      }
    }
  },
  "/health/database": {
    "get": {
      "tags": ["Health"],
      "summary": "Check database health",
      "description": "Check if the database connection is healthy",
      "responses": {
        "200": {
          "description": "Database connection is healthy"
        },
        "503": {
          "description": "Database connection failed"
        }
      }
    }
  }
};