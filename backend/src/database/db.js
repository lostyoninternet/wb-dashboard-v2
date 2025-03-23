const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { logger } = require('../config/logger');

const dbPath = path.resolve(__dirname, '../../data/wb-dashboard.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        logger.error('Error connecting to SQLite database:', err);
        process.exit(1);
    }
    logger.info('Connected to SQLite database');
});

// Промисифицируем методы базы данных
const dbAsync = {
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    logger.error('Database run error:', err);
                    reject(err);
                    return;
                }
                resolve({ id: this.lastID });
            });
        });
    },

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, result) => {
                if (err) {
                    logger.error('Database get error:', err);
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    },

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    logger.error('Database all error:', err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }
};

module.exports = {
    db,
    dbAsync
};
