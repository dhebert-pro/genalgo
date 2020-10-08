const Generation = require('../models/generation.model');
const AgentService = require('./agent.service');
const MoveService = require('./move.service');
const GenerationService = require('./generation.service');
const randomInt = require('random-int');
const { v4: uuidv4 } = require('uuid');

const REMOVE_STICKS = 'REMOVE_STICKS';

const removeSticks = nbSticks => board => {
    if (board.nbSticks - nbSticks >= 0) {
        return {
            ...board,
            'nbSticks': board.nbSticks - nbSticks
        };
    } else {
        return false;
    }
}

const gameFunctions = {
    REMOVE_STICKS: removeSticks
}

const getScore = agent => agent.winning * 3;

const getInformationsFromBoard = board => ([
    board.nbSticks
]);

const getBoardFromInformations = informations => {
    if (informations && informations[0] !== false) {
        return {
            'nbSticks': informations[0]
        };
    } else {
        return false;
    }
}

const sigmoid = x => 1 / (1 + Math.exp(-x));

const getNeuronResult = (entryValues, neuron) => {
    if (entryValues.length !== neuron.weights.length) {
        throw new Error(`Taille d'entrée incorrecte (${entryValues.length} au lieu de ${neuron.weights.length})`);
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

const getPossibleMoves = (moves, board) => {
    return moves.filter(move => {
        const nbSticks = move.params[0];
        return (move.name === REMOVE_STICKS && board.nbSticks >= nbSticks);
    }).map(move => {
        return gameFunctions[move.name](move.params[0]);
    });
}

const playMove = (moves, agents, board, activePlayer) => {
    const playingAgent = agents[activePlayer];
    const possibleMoves = getPossibleMoves(moves, board);

    if (possibleMoves.length === 0) {
        throw new Error('Aucun coup n\'est possible');
    }

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

    if (bestBoard.nbSticks === 0) {
        return activePlayer;
    } else {
        return playMove(moves, agents, bestBoard, 1 - activePlayer);
    }
};

const launchGame = (moves, agent1, agent2) => {
    const agents = [agent1, agent2];
    const board = {
        'nbSticks': 20
    };
    const firstPlayer = randomInt(1);

    const activePlayer = playMove(moves, agents, board, firstPlayer);
    
    const playingAgent = agents[activePlayer];
    const otherAgent = agents[1 - activePlayer];
    playingAgent.losing = playingAgent.losing + 1;
    otherAgent.winning = otherAgent.winning + 1;

};

const launchGames = (moves, agents) => {
    randomAgents = agents.sort(() => Math.random() - 0.5);
    for (let indexAgent = 0; indexAgent < (randomAgents.length - 1) / 2; indexAgent++) {
        const agent1 = randomAgents[2 * indexAgent];
        const agent2 = randomAgents[2 * indexAgent + 1];
        launchGame(moves, agent1, agent2);
    }
};

const launchGameIteration = (moves, agents, iteration) => {
    launchGames(moves, agents);
    if (iteration < 100) {
        return launchGameIteration(moves, agents, iteration + 1);
    }
}

const launch = agents => {
    let playingAgents = agents.map(agent => ({
            ...agent,
            'winning': 0,
            'losing': 0
    }));

    return MoveService.find().then(moves => {
        launchGameIteration(moves, playingAgents, 1);
        
        playingAgents.forEach(agent => { AgentService.create(agent); });

        playingAgents = playingAgents.sort((agent1, agent2) => {
            return getScore(agent2) - getScore(agent1);
        });

        const winner = playingAgents[0];
        return {
            'winning': winner.winning,
            'losing': winner.losing
        };
    });
};

const createRandomAgents = () => {
    let agents = [];
    for(let i=0; i<64; i++) {
        const name = uuidv4();
        agents = [...agents,
            {
                name,
                'neurons': [
                [
                    {
                        'bias': randomInt(20) - 10,
                        'weights': [
                            randomInt(20) - 10
                        ]
                    }
                ]
                ],
                'generation': 1
            }
        ];
    }
    return agents;
};

exports.generate = () => {
    return Generation.estimatedDocumentCount().then(
        count => {
            if (count === 0) {
                const agents = createRandomAgents();
                return launch(agents).then(winner => {
                    return GenerationService.create({
                        generation: 1,
                        'winner': winner.winner
                    }).then(() => {
                        return { count: 1 };
                    });
                });
            } else {
                return { count: 0 }
            }
        }
    ).catch(err => { throw err; });
};