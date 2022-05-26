const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const timed_lightSchema = new Schema({
    short_id : {
        type: String,
        require: true
    },
    unique_id : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    interval : {
        type: Number,
        required: true,
        default: 5
    },
    active : {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('timed_lights', timed_lightSchema);