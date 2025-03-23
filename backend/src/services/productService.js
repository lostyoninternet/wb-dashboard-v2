const { dbAsync } = require('../database/db');
const { logger } = require('../config/logger');

class ProductService {
    async getProduct(nmId) {
        try {
            return await dbAsync.get(
                'SELECT * FROM products WHERE nmId = ?',
                [nmId]
            );
        } catch (error) {
            logger.error('Error getting product:', error);
            throw error;
        }
    }

    async saveProduct(product) {
        try {
            const { nmId, name, brand, category, price, discount } = product;
            
            await dbAsync.run(
                `INSERT INTO products (nmId, name, brand, category, price, discount, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                 ON CONFLICT(nmId) DO UPDATE SET
                 name = excluded.name,
                 brand = excluded.brand,
                 category = excluded.category,
                 price = excluded.price,
                 discount = excluded.discount,
                 updated_at = CURRENT_TIMESTAMP`,
                [nmId, name, brand, category, price, discount]
            );

            return await this.getProduct(nmId);
        } catch (error) {
            logger.error('Error saving product:', error);
            throw error;
        }
    }
}

module.exports = new ProductService();
