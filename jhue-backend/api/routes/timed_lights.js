const TimedLight = require('../../models/timed_light');

module.exports = function async (router) {
    router.post('/timed_lights/create', (req, res) => {
        console.log('Creating timed_light');
        console.log(req.query)

        const tl = new TimedLight();
        tl.name = req.query.name;
        tl.short_id = req.query.short_id;
        tl.unique_id = req.query.unique_id;
        tl.active = req.query.active;
        tl.interval = req.query.interval;

        tl.save()
        .then(()=>{
            res.status(200).json(tl);
        })
        .catch(()=>{
            res.status(400).json({result: false});
        })

        
    });

    router.get('/timed_lights', async (req,res) =>{
        const data = await TimedLight.find({});
        res.status(200).json(data);
    });
}