const utils = require('util')
const redisStore = require('../redis')

const redisSetAsync = utils.promisify(redisStore.setex).bind(redisStore)
const redisGetAsync = utils.promisify(redisStore.get).bind(redisStore)

module.exports = { redisGetAsync, redisSetAsync }