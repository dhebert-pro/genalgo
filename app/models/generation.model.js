const mongoose = require('mongoose');

const GenerationSchema = mongoose.Schema({
    'generation': Number,
    'winning': Number,
    'losing': Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Generation', GenerationSchema, 'generation');