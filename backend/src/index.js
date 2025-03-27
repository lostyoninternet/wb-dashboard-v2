require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { logger, setupLogger } = require('./config/logger');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { connectToDatabase, closeDatabase } = require('./database/db');
const { runMigrations } = require('./database/migrate');
const schedulerService = require('./services/schedulerService');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// Создаем директорию для базы данных если её нет
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Настройка логгера
setupLogger();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Слишком много запросов, попробуйте позже' }
});
app.use('/api/', limiter);

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Функция запуска сервера
const startServer = async () => {
    try {
        // Подключение к базе данных
        await connectToDatabase();
        
        // Запуск миграций
        await runMigrations();
        
        // Инициализация планировщика задач
        schedulerService.init();
        
        // Запуск сервера
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
        
        // Обработка завершения работы приложения
        process.on('SIGINT', async () => {
            logger.info('Shutting down server...');
            await closeDatabase();
            process.exit(0);
        });
        
        process.on('SIGTERM', async () => {
            logger.info('Shutting down server...');
            await closeDatabase();
            process.exit(0);
        });
    } catch (error) {
        logger.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

// Запуск сервера
startServer();
