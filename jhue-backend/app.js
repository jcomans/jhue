const app = require('express')()

const cors = require('cors');
app.use(cors({origin:'*'}))

require('dotenv').config()

const axios = require('axios').default
axios.defaults.baseURL = `http://hue.local.comans.be/api/${process.env.HUE_API_KEY}`

app.use('/api', require('./api'))

const port = 8000
app.listen(port, ()=>{
    console.log(`jhue-backend listening on port ${port}`)
})
