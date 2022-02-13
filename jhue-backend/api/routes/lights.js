const axios = require('axios').default

module.exports = function (router) {

    router.get('/lights', (req, res) => {
        axios.get('/lights')
            .then((response) => {
                const my_light_data = response.data

                let light_list = [];

                for (var k in my_light_data) {
                    const light = my_light_data[k]
                    light_list.push(
                        {
                            short_id: k,
                            unique_id: light.uniqueid,
                            name: light.name
                        })
                }

                res.status(200).json(light_list)
            })
            .catch((error) => {
                res.status(500).json({ error: 'Failed to query hue', msg: error.stack })
            })
    })
}
