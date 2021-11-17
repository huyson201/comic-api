require('dotenv').config()
const redis = require('redis')
const redisStore = new redis.createClient(process.env.REDIS_URL)

redisStore.on("connect", function () {
    console.log('redis connected')
});


module.exports = redisStore