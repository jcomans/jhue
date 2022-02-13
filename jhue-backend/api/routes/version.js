const axios = require('axios').default

module.exports = function (router) {

    router.get('/version', (req, res) => {
        axios.get('/config')
            .then((response) => {

                res.status(200).json(
                    {
                        jhue_backend: process.env.npm_package_version,
                        hue_api: response.data.apiversion,
                        hue_sw: response.data.swversion
                    })
            })
            .catch((error) => {
                res.status(500).json({ error: 'Failed to query hue', msg: error.stack })
            })

    })
}
