const Generation = require('../models/generation.model');
const AgentService = require('./agent.service');
const GenerationService = require('./generation.service');
const randomInt = require('random-int');

const getScore = agent => agent.winning * 3;

const hasAWinner = agents => {
    return getScore(agents[0]) > getScore(agents[1]);
};

const launchGame = (agent1, agent2) => {
    if (randomInt(1) === 0) {
        agent1.winning = agent1.winning + 1;
        agent2.losing = agent2.losing + 1;
    } else {
        agent1.losing = agent1.losing + 1;
        agent2.winning = agent2.winning + 1;
    }
};

const launchGames = agents => {
    for (let indexAgent = 0; indexAgent < (agents.length - 1) / 2; indexAgent++) {
        const agent1 = agents[2 * indexAgent];
        const agent2 = agents[2 * indexAgent + 1];
        launchGame(agent1, agent2);
    }
    return agents;
};

const launch = () => {
    return AgentService.findByGeneration(1).then(agents => {
        let playingAgents = agents.map(agent => ({
            ...agents,
            "winning": 0,
            "losing": 0
        }))

        let nbIterations = 0;

        while (!hasAWinner(playingAgents) || nbIterations < 100) {
            playingAgents = launchGames(playingAgents).sort((agent1, agent2) => {
                return getScore(agent2) - getScore(agent1);
            });
            nbIterations++;
        }

        const winner = playingAgents[0];

        return {
            "winning": winner.winning,
            "losing": winner.losing
        };
    });
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
                    return launch().then(agent => {
                        GenerationService.create({
                            generation: 1,
                            "winning": agent.winning,
                            "losing": agent.losing
                        });
                        return { count: 1 };
                    }); 
                });
            } else {
                return { count: 0 }
            }
        }
    );
};