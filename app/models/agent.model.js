const mongoose = require('mongoose');

const AgentSchema = mongoose.Schema({
    "neurons": {
        "type": [
            [
                {
                    "bias": {
                        "type": "Number"
                    },
                    "weights": {
                        "type": [
                            "Number"
                        ]
                    }
                }
            ]
        ]
    },
    "generation": {
        "type": "Number"
    }
});

module.exports = mongoose.model('Agent', AgentSchema, 'agent');