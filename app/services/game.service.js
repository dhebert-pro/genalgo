const Generation = require('../models/generation.model');
const AgentService = require('./agent.service');
const GenerationService = require('./generation.service');
const randomInt = require('random-int');

const getScore = agent => agent.winning * 3;

const hasAWinner = agents => {
    return getScore(agents[0]) > getScore(agents[1]);
};

const getInformationsFromBoard = board => ([
    board.nbSticks
]);

const getBoardFromInformations = informations => {
    if (informations && informations[0] !== false) {
        return {
            "nbSticks": informations[0]
        };
    } else {
        return false;
    }
}

const removeSticks = nbSticks => board => {
    if (board.nbSticks - nbSticks >= 0) {
        return {
            ...board,
            "nbSticks": board.nbSticks - nbSticks
        };
    } else {
        return false;
    }
}

const sigmoid = x => 1 / (1 + Math.exp(-x));

const getNeuronResult = (entryValues, neuron) => {
    if (entryValues.length !== neuron.weights.length) {
        throw `Taille d'entrée incorrecte (${entryValues.length} au lieu de ${neuron.weights.length})`;
    };
    const weightedNeuron = neuron.bias + entryValues.reduce(
        (result,element,index) => {
            return result + element * neuron.weights[index]
        },
        0
    );
    const result = sigmoid(weightedNeuron);

    return result;
};

const getResultFromInformation = (neuralNetwork, entryValues) => {
    const layers = neuralNetwork.neurons;
    let currentValues = entryValues;
    layers.forEach(neurons => {
        let result = [];
        neurons.forEach(neuron => {
            neuronResult = getNeuronResult(currentValues, neuron);
            result = [
                ...result,
                neuronResult
            ];
        });
        currentValues = result;
    });
    return currentValues;
};

const getPossibleMoves = board => {
    let possibleMoves = [removeSticks(1)];
    if (board.nbSticks > 1) {
        possibleMoves = [...possibleMoves, removeSticks(2)];
    };
    if (board.nbSticks > 2) {
        possibleMoves = [...possibleMoves, removeSticks(3)];
    };
    return possibleMoves;
}

const launchGame = (agent1, agent2) => {
    const agents = [agent1, agent2];
    let board = {
        "nbSticks": 20
    };
    let firstPlayer = randomInt(1);
    let playingAgent = agents[firstPlayer];
    let otherAgent = agents[1 - firstPlayer];

    while (board.nbSticks > 0) {
        let possibleMoves = getPossibleMoves(board);

        let bestScore = Number.NEGATIVE_INFINITY;
        let bestBoard;

        const possibleInformations = possibleMoves.map(move => {
            return getInformationsFromBoard(move(board));
        });

        possibleInformations.filter(x => !!x).forEach(possibleInformation => {
            const result = getResultFromInformation(playingAgent, possibleInformation)[0];
            if (result > bestScore) {
                bestScore = result;
                bestBoard = getBoardFromInformations(possibleInformation);
            }
        });

        board = bestBoard;

        firstPlayer = 1 - firstPlayer;
        playingAgent = agents[firstPlayer];
        otherAgent = agents[1 - firstPlayer];

    }
    
    playingAgent.winning = playingAgent.winning + 1;
    otherAgent.losing = otherAgent.losing + 1;

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
                ...agent.toObject(),
                "winning": 0,
                "losing": 0
        }));

        let nbIterations = 0;

        while (!hasAWinner(playingAgents) || nbIterations < 100) {
            playingAgents = launchGames(playingAgents).sort((agent1, agent2) => {
                return getScore(agent2) - getScore(agent1);
            });
            nbIterations++;
        }

        const winner = playingAgents[0];
        console.log('WINNER', JSON.stringify(winner));
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
                                    "bias": randomInt(20) - 10,
                                    "weights": [
                                        randomInt(20) - 10
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