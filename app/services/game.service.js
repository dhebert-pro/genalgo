const Generation = require('../models/generation.model');
const AgentService = require('./agent.service');
const GenerationService = require('./generation.service');
const randomInt = require('random-int');

exports.generate = () => {
    return Generation.estimatedDocumentCount().then(
        count => {
            if (count === 0) {
                for(let i=0; i<64; i++) {
                    AgentService.create({
                        "neurons": [
                        [
                            {
                                "bias": randomInt(20)-10,
                                "weights": [
                                    randomInt(20)-10
                                ]
                            }
                        ]
                        ],
                        "generation": 1
                    });
                }
                GenerationService.create({
                    generation: 1,
                    winning: randomInt(100),
                    losing: randomInt(100)
                });
            }
            return {count: 1};
        }
    ).catch(err => {
        throw err.message || "Un problème est survenu lors de la génération.";
    });
};