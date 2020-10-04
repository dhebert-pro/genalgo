const mongoose = require('mongoose');

const GenerationSchema = mongoose.Schema({
    'generation': Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Generation', GenerationSchema, 'generation');