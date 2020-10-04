const Generation = require('../models/generation.model');
const GenerationService = require('../services/generation.service')

exports.create = (req, res) => {
    GenerationService.create(req.body).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Erreur lors de la création de la génération."
        });
        console.log(err);
    });
};

exports.findAll = (req, res) => {
    Generation.find()
    .then(generations => {
        res.send(generations);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Erreur lors de la récupération des générations."
        });
        console.log(err);
    });
};