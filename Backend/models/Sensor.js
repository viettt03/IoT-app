const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const sensorSchema = mongoose.Schema({
    temp: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
    },
    light: {
        type: Number,
        required: true,
    },
    timestamp: { type: Date, default: Date.now }
});
sensorSchema.plugin(AutoIncrement, { inc_field: 'order' });
module.exports = mongoose.model('Sensor', sensorSchema)