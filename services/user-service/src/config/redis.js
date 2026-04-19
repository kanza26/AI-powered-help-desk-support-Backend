const redis = require('redis');

// ✅ New way (redis v4+)
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
  }
});
redisClient.on('connect', () => {
  console.log('✅ User-service connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

redisClient.connect();

module.exports = redisClient;