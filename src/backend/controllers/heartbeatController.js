import db from '../config/database.js';

export const heartbeatController = {
    async checkApiHealth(req, res) {
        try {
            return res.status(200).json({
                status: 'success',
                message: 'API is running',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error checking API health: ", error);
            return res.status(500).json({
                status: 'error',
                message: 'API health check failed',
                error: error.message
            });
        }
    },

    async checkDatabaseHealth(req, res) {
        try {
            const state = db.readyState;
            if (state !== 1) {
                throw new Error('Database not connected');
            }
            console.log("Database connection state: ", state);
            return res.status(200).json({
                status: 'success',
                message: 'Database connection is healthy',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error checking database health: ", error);
            return res.status(503).json({
                status: 'error',
                message: 'Database connection failed',
                error: error.message
            });
        }
    }
};