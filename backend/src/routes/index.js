const express = require('express');
const router = express.Router();
const wildberriesService = require('../services/wildberries');
const productService = require('../services/productService');
const statisticsService = require('../services/statisticsService');
const { logger } = require('../config/logger');

// Middleware для проверки API ключа
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ error: 'API ключ обязателен' });
    }
    req.apiKey = apiKey;
    next();
};

// Получение информации о товаре
router.get('/products/:articleNumber', validateApiKey, async (req, res) => {
    try {
        const { articleNumber } = req.params;
        
        // Сначала проверяем в базе
        let productInfo = await productService.getProduct(articleNumber);
        
        // Если нет в базе или данные устарели (более 1 часа), запрашиваем с API
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (!productInfo || new Date(productInfo.updated_at) < oneHourAgo) {
            const wbProductInfo = await wildberriesService.getProductInfo(req.apiKey, articleNumber);
            productInfo = await productService.saveProduct(wbProductInfo);
        }

        res.json(productInfo);
    } catch (error) {
        logger.error('Product info error:', error);
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Получение статистики
router.get('/statistics/:articleNumber', validateApiKey, async (req, res) => {
    try {
        const { articleNumber } = req.params;
        const { dateFrom, dateTo } = req.query;

        if (!dateFrom || !dateTo) {
            return res.status(400).json({ error: 'Параметры dateFrom и dateTo обязательны' });
        }

        // Получаем актуальные данные с API
        const statistics = await wildberriesService.getDetailedStatistics(req.apiKey, {
            nmId: articleNumber,
            dateFrom,
            dateTo
        });

        // Сохраняем статистику в базу
        for (const stat of statistics.details) {
            await statisticsService.saveStatistics(articleNumber, stat.date, stat);
        }

        // Возвращаем данные из базы
        const savedStats = await statisticsService.getStatistics(articleNumber, dateFrom, dateTo);
        res.json(savedStats);
    } catch (error) {
        logger.error('Statistics error:', error);
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Проверка статуса сервера
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

module.exports = router;
