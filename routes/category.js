const express = require('express')
const categoryRoute = express.Router()

categoryRoute.get('/', (req, res) => {
    return res.json({ name: 'category' })
})

module.exports = categoryRoute