const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const table1Schema = mongoose.Schema({
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
table1Schema.plugin(AutoIncrement, { inc_field: 'order' });
module.exports = mongoose.model('Table1', table1Schema)