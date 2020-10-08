const mongoose = require('mongoose');

const MoveSchema = mongoose.Schema({
    'name': String,
    'params': Array
}, {
    timestamps: true
});

module.exports = mongoose.model('Move', MoveSchema, 'move');