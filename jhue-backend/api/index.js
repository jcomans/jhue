const express = require('express')

const router = express.Router()

require('./routes/version')(router)
require('./routes/lights')(router)

module.exports = router
