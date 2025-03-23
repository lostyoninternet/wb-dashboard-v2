const axios = require('axios');
const { logger } = require('../config/logger');

class WildberriesService {
    constructor() {
        this.contentApi = axios.create({
            baseURL: process.env.WB_API_BASE_URL || 'https://suppliers-api.wb.ru'
        });
        
        this.statisticsApi = axios.create({
            baseURL: process.env.WB_STATISTICS_API_URL || 'https://statistics-api.wb.ru'
        });
    }

    async getProductInfo(apiKey, articleNumber) {
        try {
            logger.info(`Fetching product info for article: ${articleNumber}`);
            
            // Новый формат запроса для получения информации о товаре
            const response = await this.contentApi.get(`/content/v1/cards/filter?vendorCodes=${articleNumber}`, {
                headers: { 
                    'Authorization': apiKey,
                    'Content-Type': 'application/json'
                }
            });

            logger.info(`API response received for article: ${articleNumber}`);
            logger.info(`Response data: ${JSON.stringify(response.data)}`);
            
            if (!response.data.data || response.data.data.length === 0) {
                logger.error(`Product not found for article: ${articleNumber}`);
                throw new Error('Товар не найден');
            }

            const productData = response.data.data[0];
            logger.info(`Processing product data for article: ${articleNumber}`);
            
            // Адаптируем данные к нашей структуре
            return {
                nmId: parseInt(productData.nmID || articleNumber),
                name: productData.title || productData.name || 'Без названия',
                brand: productData.brand || 'Не указан',
                category: productData.subject || 'Не указана',
                price: productData.price || 0,
                discount: productData.discount || 0
            };
        } catch (error) {
            logger.error('Error fetching product info:', error.message);
            if (error.response) {
                logger.error(`API error status: ${error.response.status}`);
                logger.error(`API error data: ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(error.response?.data?.message || 'Ошибка получения информации о товаре');
        }
    }

    async getDetailedStatistics(apiKey, params) {
        try {
            const { nmId, dateFrom, dateTo } = params;
            logger.info(`Fetching statistics for article: ${nmId}, from: ${dateFrom}, to: ${dateTo}`);

            // Обновленные запросы к API статистики
            const [salesData, stocksData] = await Promise.all([
                // Получение данных о продажах
                this.statisticsApi.get('/api/v1/supplier/sales', {
                    params: { 
                        dateFrom,
                        dateTo
                    },
                    headers: { 
                        'Authorization': apiKey,
                        'Content-Type': 'application/json'
                    }
                }),
                // Получение данных о складских остатках
                this.statisticsApi.get('/api/v1/supplier/stocks', {
                    params: { 
                        dateFrom: dateFrom
                    },
                    headers: { 
                        'Authorization': apiKey,
                        'Content-Type': 'application/json'
                    }
                })
            ]);

            logger.info(`Statistics data received for article: ${nmId}`);
            logger.info(`Sales data: ${JSON.stringify(salesData.data)}`);
            logger.info(`Stocks data: ${JSON.stringify(stocksData.data)}`);

            // Фильтруем данные только для нужного артикула
            const filteredSalesData = salesData.data.filter(item => 
                item.nmId === parseInt(nmId) || item.nmID === parseInt(nmId)
            );
            
            const filteredStocksData = stocksData.data.filter(item => 
                item.nmId === parseInt(nmId) || item.nmID === parseInt(nmId)
            );

            // Группируем данные по датам
            const salesByDate = this.groupSalesByDate(filteredSalesData);

            const formattedData = {
                summary: this.calculateSummary(filteredSalesData),
                details: this.formatDetailData(salesByDate),
                stocks: this.formatStocksData(filteredStocksData)
            };

            return formattedData;
        } catch (error) {
            logger.error('Error fetching statistics:', error.message);
            if (error.response) {
                logger.error(`API error status: ${error.response.status}`);
                logger.error(`API error data: ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(error.response?.data?.message || 'Ошибка получения статистики');
        }
    }

    calculateSummary(salesData) {
        return {
            totalSales: salesData.reduce((sum, item) => sum + (item.quantity || 0), 0),
            totalRevenue: salesData.reduce((sum, item) => sum + (item.finishedPrice || item.price || 0), 0),
            ordersCount: salesData.length
        };
    }

    groupSalesByDate(salesData) {
        const salesByDate = {};
        
        salesData.forEach(item => {
            const date = item.date || item.lastChangeDate || new Date().toISOString().split('T')[0];
            
            if (!salesByDate[date]) {
                salesByDate[date] = {
                    sales: { quantity: 0, revenue: 0 },
                    orders: { quantity: 0, canceled: 0 },
                    views: { total: 0, unique: 0 }
                };
            }
            
            salesByDate[date].sales.quantity += item.quantity || 0;
            salesByDate[date].sales.revenue += item.finishedPrice || item.price || 0;
            salesByDate[date].orders.quantity += 1;
            salesByDate[date].orders.canceled += item.isCancel ? 1 : 0;
        });
        
        return salesByDate;
    }

    formatDetailData(salesByDate) {
        return Object.entries(salesByDate).map(([date, data]) => ({
            date,
            sales: data.sales,
            orders: data.orders,
            views: data.views
        }));
    }

    formatStocksData(stocksData) {
        const totalQuantity = stocksData.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        const warehouses = stocksData.map(item => ({
            warehouse: item.warehouseName || 'Склад',
            quantity: item.quantity || 0
        }));
        
        return {
            current: totalQuantity,
            warehouses
        };
    }
}

module.exports = new WildberriesService();
