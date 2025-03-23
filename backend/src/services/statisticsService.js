const { dbAsync } = require('../database/db');
const { logger } = require('../config/logger');

class StatisticsService {
    async getStatistics(nmId, dateFrom, dateTo) {
        try {
            const stats = await dbAsync.all(
                `SELECT 
                    date,
                    sales_quantity,
                    sales_revenue,
                    orders_quantity,
                    orders_canceled,
                    views_total,
                    views_unique,
                    stocks_quantity
                 FROM statistics 
                 WHERE nmId = ? AND date BETWEEN ? AND ?
                 ORDER BY date`,
                [nmId, dateFrom, dateTo]
            );

            // Получаем суммарную статистику
            const summary = await dbAsync.get(
                `SELECT 
                    SUM(sales_quantity) as totalSales,
                    SUM(sales_revenue) as totalRevenue,
                    SUM(orders_quantity) as ordersCount,
                    SUM(stocks_quantity) as currentStock
                 FROM statistics 
                 WHERE nmId = ? AND date BETWEEN ? AND ?`,
                [nmId, dateFrom, dateTo]
            );

            return {
                summary: {
                    totalSales: summary?.totalSales || 0,
                    totalRevenue: summary?.totalRevenue || 0,
                    ordersCount: summary?.ordersCount || 0
                },
                details: stats.map(stat => ({
                    date: stat.date,
                    sales: {
                        quantity: stat.sales_quantity,
                        revenue: stat.sales_revenue
                    },
                    orders: {
                        quantity: stat.orders_quantity,
                        canceled: stat.orders_canceled
                    },
                    views: {
                        total: stat.views_total,
                        unique: stat.views_unique
                    }
                })),
                stocks: {
                    current: summary?.currentStock || 0,
                    warehouses: [] // В SQLite не храним детальную информацию по складам
                }
            };
        } catch (error) {
            logger.error('Error getting statistics:', error);
            throw error;
        }
    }

    async saveStatistics(nmId, date, stats) {
        try {
            await dbAsync.run(
                `INSERT INTO statistics (
                    nmId,
                    date,
                    sales_quantity,
                    sales_revenue,
                    orders_quantity,
                    orders_canceled,
                    views_total,
                    views_unique,
                    stocks_quantity
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(nmId, date) DO UPDATE SET
                    sales_quantity = excluded.sales_quantity,
                    sales_revenue = excluded.sales_revenue,
                    orders_quantity = excluded.orders_quantity,
                    orders_canceled = excluded.orders_canceled,
                    views_total = excluded.views_total,
                    views_unique = excluded.views_unique,
                    stocks_quantity = excluded.stocks_quantity`,
                [
                    nmId,
                    date,
                    stats.sales?.quantity || 0,
                    stats.sales?.revenue || 0,
                    stats.orders?.quantity || 0,
                    stats.orders?.canceled || 0,
                    stats.views?.total || 0,
                    stats.views?.unique || 0,
                    stats.stocks?.quantity || 0
                ]
            );
        } catch (error) {
            logger.error('Error saving statistics:', error);
            throw error;
        }
    }
}

module.exports = new StatisticsService();
