const mongoose = require('mongoose');

const app = require('express')()

const cors = require('cors');
app.use(cors({origin:'*'}))

require('dotenv').config()

const axios = require('axios').default
axios.defaults.baseURL = `http://hue.local.comans.be/api/${process.env.HUE_API_KEY}`

mongoose.connect(`${process.env.MONGO_CONNECTION}`)
.then(()=>{console.log("Connected to database")})
.catch(()=>{console.log("Failed to connect to database")})

app.use('/api', require('./api'))

const port = 8000
app.listen(port, ()=>{
    console.log(`jhue-backend listening on port ${port}`)
})
