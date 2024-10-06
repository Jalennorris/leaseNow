import NodeCache from 'node-cache';
import redis from 'redis';
// Initialize NodeCache and Redis client
const nodeCache = new NodeCache();
const redisClient = redis.createClient();
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
// Connect to Redis
redisClient.connect().catch(console.error);
const cacheUtils = {
    // Get cache from both NodeCache and Redis
    async get(key) {
        // Try getting from NodeCache
        const nodeCacheValue = nodeCache.get(key);
        if (nodeCacheValue) {
            console.log(`NodeCache hit for key: ${key}`);
            return nodeCacheValue;
        }
        // Try getting from Redis if not found in NodeCache
        const redisValue = await redisClient.get(key);
        if (redisValue) {
            console.log(`Redis hit for key: ${key}`);
            // Optionally, set value back in NodeCache for faster future retrieval
            nodeCache.set(key, JSON.parse(redisValue));
            return JSON.parse(redisValue);
        }
        console.log(`Cache miss for key: ${key}`);
        return null;
    },
    // Set cache in both NodeCache and Redis
    async set(key, value, ttl = 3600) {
        // Set in NodeCache
        nodeCache.set(key, value, ttl);
        console.log(`NodeCache set for key: ${key}`);
        // Set in Redis with TTL
        await redisClient.set(key, JSON.stringify(value), {
            EX: ttl // Set expiration in seconds
        });
        console.log(`Redis set for key: ${key}`);
    },
    // Delete cache from both NodeCache and Redis
    async del(key) {
        // Delete from NodeCache
        nodeCache.del(key);
        console.log(`NodeCache deleted for key: ${key}`);
        // Delete from Redis
        await redisClient.del(key);
        console.log(`Redis deleted for key: ${key}`);
    }
};
export default cacheUtils;
