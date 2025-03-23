const { dbAsync } = require('./db');
const { logger } = require('../config/logger');

async function migrate() {
    try {
        // Создаем таблицу products
        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS products (
                nmId INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                brand TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                discount INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Создаем таблицу statistics
        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS statistics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nmId INTEGER NOT NULL,
                date DATE NOT NULL,
                sales_quantity INTEGER DEFAULT 0,
                sales_revenue REAL DEFAULT 0,
                orders_quantity INTEGER DEFAULT 0,
                orders_canceled INTEGER DEFAULT 0,
                views_total INTEGER DEFAULT 0,
                views_unique INTEGER DEFAULT 0,
                stocks_quantity INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (nmId) REFERENCES products(nmId),
                UNIQUE(nmId, date)
            )
        `);

        // Создаем индексы
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_statistics_nmid_date ON statistics(nmId, date)');
        await dbAsync.run('CREATE INDEX IF NOT EXISTS idx_products_updated ON products(updated_at)');

        logger.info('Database migration completed successfully');
    } catch (error) {
        logger.error('Database migration failed:', error);
        process.exit(1);
    }
}

// Запускаем миграцию если скрипт запущен напрямую
if (require.main === module) {
    migrate();
}

module.exports = migrate;
