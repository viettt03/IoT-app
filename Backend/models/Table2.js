const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const table2Schema = mongoose.Schema({
    device: {
        type: Number,
        required: true,
    },
    control: {
        type: Number,
        required: true,
    },
    action: {
        type: Number,
        required: true,
    },
    timestamp: { type: Date, default: Date.now }
});
table2Schema.plugin(AutoIncrement, { inc_field: 'order2' });
module.exports = mongoose.model('Table2', table2Schema)