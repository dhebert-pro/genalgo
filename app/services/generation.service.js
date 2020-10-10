const Generation = require('../models/generation.model');
const AgentService = require('./agent.service');

const FILTER_WITH_WINNER = "withWinner";

// Create and Save a new generation
exports.create = generationParam => {

    const generation = new Generation(generationParam);

    return generation.save()
    .then(data => {
        return data;
    });
};

exports.findLatest = () => {
    return Generation.find().sort({'generation': -1}).limit(1);
};

exports.find = filter => {
    return Generation.find().lean()
    .then(generations => {
        let promises = [];
        if (filter === FILTER_WITH_WINNER) {
            promises = generations.map(generation => {
                return AgentService.findGenerationWinner(generation.generation).then(winners => {
                    return {...generation, 
                        'winner': winners[0]
                    };
                });
            });
        } else {
            return new Promise(resolve => resolve(generations));
        }
        return Promise.all(promises).then(generationFiltered => {
            return generationFiltered;
        });
    });
}