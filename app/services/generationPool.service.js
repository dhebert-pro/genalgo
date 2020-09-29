const Generation = require('../models/generation.model');
const GenerationService = require('./generation.service');
const randomInt = require('random-int');

exports.generate = () => {
    return Generation.estimatedDocumentCount().then(
        count => {
            if (count === 0) {
                GenerationService.create({
                    "generation": count + 1, 
                    "winning": randomInt(100),
                    "losing": randomInt(100)
                });
            }
            return {count};
        }
    ).catch(err => {
        throw err.message || "Un problème est survenu lors de la génération.";
    });
};