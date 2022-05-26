const express = require('express')

const router = express.Router()

require('./routes/version')(router)
require('./routes/lights')(router)
require('./routes/timed_lights')(router)

module.exports = router
