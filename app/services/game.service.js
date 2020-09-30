const Generation = require('../models/generation.model');
const AgentService = require('./agent.service');
const GenerationService = require('./generation.service');
const randomInt = require('random-int');

const launchGames = () => {
    AgentService.findByGeneration(1);
    return {"winning": randomInt(100), "losing": randomInt(100)};
}

exports.generate = () => {
    return Generation.estimatedDocumentCount().then(
        count => {
            if (count === 0) {
                let promises = [];
                for(let i=0; i<64; i++) {
                    promises = [...promises,
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
                        })
                    ];
                }
                return Promise.all(promises).then(() => {
                    const { winning, losing } = launchGames(); 
                    GenerationService.create({
                        generation: 1,
                        winning,
                        losing
                    });
                    return {count: 1};
                });
            }
        }
    );
};