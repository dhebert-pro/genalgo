const GenerationPoolService = require('../services/generationPool.service');

exports.generate = (req, res) => {
    GenerationPoolService.generate(req.body).then(data => {
        res.status(201).send(data);   
    }).catch(err => {
        throw err;
    });
};