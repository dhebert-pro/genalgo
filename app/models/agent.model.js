const mongoose = require('mongoose');

const AgentSchema = mongoose.Schema({
    'name': String,
    'neurons': [
        [
            {
                'bias': Number,
                'weights': [Number]
            }
        ]
    ],
    'generation': Number
});

module.exports = mongoose.model('Agent', AgentSchema, 'agent');