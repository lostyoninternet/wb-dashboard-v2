const { logger } = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Обработка различных типов ошибок
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Ошибка валидации',
            details: err.message
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Неверный формат данных',
            details: err.message
        });
    }

    // Ошибки API Wildberries
    if (err.response) {
        return res.status(err.response.status || 500).json({
            error: err.message,
            details: err.response.data
        });
    }

    // Общая ошибка сервера
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorHandler;
