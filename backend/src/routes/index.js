const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../middleware/auth');
const productService = require('../services/productService');
const statisticsService = require('../services/statisticsService');
const schedulerService = require('../services/schedulerService');
const wildberriesService = require('../services/wildberries');
const { logger } = require('../config/logger');

// Маршрут для получения информации о товаре
router.get('/products/:articleNumber', validateApiKey, async (req, res) => {
    try {
        const { articleNumber } = req.params;
        const apiKey = req.headers['x-api-key'];
        
        // Сначала проверяем, есть ли товар в базе данных
        let product = await productService.getProduct(articleNumber);
        
        // Если товара нет в базе или данные устарели, получаем их из API
        if (!product) {
            logger.info(`Product ${articleNumber} not found in database, fetching from API`);
            const productInfo = await wildberriesService.getProductInfo(apiKey, articleNumber);
            product = await productService.saveProduct(productInfo);
        }
        
        res.json(product);
    } catch (error) {
        logger.error(`Product info error: ${error.message}`, { stack: error.stack });
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Маршрут для получения статистики по товару
router.get('/statistics/:articleNumber', validateApiKey, async (req, res) => {
    try {
        const { articleNumber } = req.params;
        const { dateFrom, dateTo } = req.query;
        const apiKey = req.headers['x-api-key'];
        
        // Получаем статистику из API
        const statistics = await wildberriesService.getDetailedStatistics(apiKey, {
            nmId: articleNumber,
            dateFrom: dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dateTo: dateTo || new Date().toISOString().split('T')[0]
        });
        
        // Сохраняем статистику в базу данных
        await statisticsService.saveStatistics(articleNumber, statistics);
        
        res.json(statistics);
    } catch (error) {
        logger.error(`Statistics error: ${error.message}`, { stack: error.stack });
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Маршрут для добавления задачи автоматического обновления
router.post('/scheduler/:articleNumber', validateApiKey, async (req, res) => {
    try {
        const { articleNumber } = req.params;
        const { schedule } = req.body;
        const apiKey = req.headers['x-api-key'];
        
        // Проверяем, существует ли товар
        try {
            await wildberriesService.getProductInfo(apiKey, articleNumber);
        } catch (error) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        
        // Добавляем задачу в планировщик
        const result = schedulerService.addTask(articleNumber, apiKey, schedule);
        
        if (result) {
            res.json({ message: `Задача для артикула ${articleNumber} успешно добавлена`, schedule: schedule || '0 * * * *' });
        } else {
            res.status(500).json({ error: 'Ошибка при добавлении задачи' });
        }
    } catch (error) {
        logger.error(`Scheduler error: ${error.message}`, { stack: error.stack });
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Маршрут для удаления задачи автоматического обновления
router.delete('/scheduler/:articleNumber', validateApiKey, async (req, res) => {
    try {
        const { articleNumber } = req.params;
        
        // Удаляем задачу из планировщика
        const result = schedulerService.removeTask(articleNumber);
        
        if (result) {
            res.json({ message: `Задача для артикула ${articleNumber} успешно удалена` });
        } else {
            res.status(404).json({ error: 'Задача не найдена' });
        }
    } catch (error) {
        logger.error(`Scheduler error: ${error.message}`, { stack: error.stack });
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Маршрут для получения списка активных задач
router.get('/scheduler', validateApiKey, async (req, res) => {
    try {
        const tasks = schedulerService.getTasks();
        res.json(tasks);
    } catch (error) {
        logger.error(`Scheduler error: ${error.message}`, { stack: error.stack });
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Проверка статуса сервера
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

module.exports = router;
