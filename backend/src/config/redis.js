const Redis = require('redis');
const { logger } = require('./logger');

let redisClient;

const connectRedis = async () => {
    try {
        redisClient = Redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        });

        redisClient.on('error', (error) => {
            logger.error('Redis Client Error:', error);
        });

        await redisClient.connect();
        logger.info('Redis Client Connected');
    } catch (error) {
        logger.error('Error connecting to Redis:', error);
        process.exit(1);
    }
};

const getRedisClient = () => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
};

module.exports = {
    connectRedis,
    getRedisClient
};
