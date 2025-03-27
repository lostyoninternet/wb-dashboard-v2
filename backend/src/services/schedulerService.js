const cron = require('node-cron');
const { logger } = require('../config/logger');
const productService = require('./productService');
const statisticsService = require('./statisticsService');
const wildberriesService = require('./wildberries');

class SchedulerService {
    constructor() {
        this.tasks = {};
        this.apiKeys = new Map(); // Хранение API ключей для каждого артикула
    }

    /**
     * Запускает планировщик задач
     */
    init() {
        logger.info('Initializing scheduler service');
        
        // Очистка устаревших задач каждый день в полночь
        cron.schedule('0 0 * * *', () => {
            this.cleanupTasks();
        });
    }

    /**
     * Добавляет задачу на автоматическое обновление статистики
     * @param {string} articleNumber - Артикул товара
     * @param {string} apiKey - API ключ Wildberries
     * @param {string} schedule - Расписание в формате cron (по умолчанию каждый час)
     * @returns {boolean} - Результат добавления задачи
     */
    addTask(articleNumber, apiKey, schedule = '0 * * * *') {
        try {
            if (this.tasks[articleNumber]) {
                this.tasks[articleNumber].stop();
                logger.info(`Stopping existing task for article ${articleNumber}`);
            }

            logger.info(`Adding scheduled task for article ${articleNumber} with schedule: ${schedule}`);
            
            this.apiKeys.set(articleNumber, apiKey);
            
            this.tasks[articleNumber] = cron.schedule(schedule, async () => {
                try {
                    logger.info(`Running scheduled update for article ${articleNumber}`);
                    
                    // Получаем текущую дату и дату 30 дней назад
                    const dateTo = new Date().toISOString().split('T')[0];
                    const dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    
                    // Обновляем информацию о товаре
                    const productInfo = await wildberriesService.getProductInfo(apiKey, articleNumber);
                    await productService.saveProduct(productInfo);
                    
                    // Обновляем статистику
                    const statistics = await wildberriesService.getDetailedStatistics(apiKey, {
                        nmId: articleNumber,
                        dateFrom,
                        dateTo
                    });
                    await statisticsService.saveStatistics(articleNumber, statistics);
                    
                    logger.info(`Successfully updated data for article ${articleNumber}`);
                } catch (error) {
                    logger.error(`Error updating data for article ${articleNumber}: ${error.message}`);
                }
            });
            
            return true;
        } catch (error) {
            logger.error(`Error adding task for article ${articleNumber}: ${error.message}`);
            return false;
        }
    }

    /**
     * Удаляет задачу по артикулу
     * @param {string} articleNumber - Артикул товара
     * @returns {boolean} - Результат удаления задачи
     */
    removeTask(articleNumber) {
        try {
            if (this.tasks[articleNumber]) {
                this.tasks[articleNumber].stop();
                delete this.tasks[articleNumber];
                this.apiKeys.delete(articleNumber);
                logger.info(`Removed scheduled task for article ${articleNumber}`);
                return true;
            }
            return false;
        } catch (error) {
            logger.error(`Error removing task for article ${articleNumber}: ${error.message}`);
            return false;
        }
    }

    /**
     * Получает список всех активных задач
     * @returns {Array} - Список активных задач
     */
    getTasks() {
        return Object.keys(this.tasks).map(articleNumber => ({
            articleNumber,
            active: true
        }));
    }

    /**
     * Очищает устаревшие задачи
     */
    cleanupTasks() {
        logger.info('Cleaning up old tasks');
        
        // Здесь можно добавить логику для определения устаревших задач
        // Например, удалять задачи для товаров, которые не обновлялись более 7 дней
    }
}

module.exports = new SchedulerService();
