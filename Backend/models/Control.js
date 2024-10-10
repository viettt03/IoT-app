const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const controlSchema = mongoose.Schema({
    deviceId: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    action: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    }
});
controlSchema.plugin(AutoIncrement, { inc_field: 'order2' });
module.exports = mongoose.model('Control', controlSchema)