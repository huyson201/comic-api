require('dotenv').config()
const redis = require('redis')
const redisStore = new redis.createClient(process.env.REDIS_URL)

redisStore.on("error", function (error) {
    console.error(error);
});


module.exports = redisStore