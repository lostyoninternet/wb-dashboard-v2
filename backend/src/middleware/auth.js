const { logger } = require('../config/logger');

/**
 * Middleware для проверки API ключа
 * @param {Object} req - Express request объект
 * @param {Object} res - Express response объект
 * @param {Function} next - Express next функция
 */
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
        logger.warn('API request without API key');
        return res.status(401).json({ error: 'API ключ обязателен' });
    }
    
    // Здесь можно добавить дополнительную валидацию API ключа
    // Например, проверка формата или наличия в белом списке
    
    req.apiKey = apiKey;
    next();
};

module.exports = {
    validateApiKey
};
