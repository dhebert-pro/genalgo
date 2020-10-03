const GameService = require('../services/game.service');

exports.generate = (req, res) => {
    GameService.generate(req.body).then(data => {
        res.status(201).send(data);   
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Erreur lors de la génération.'
        });
        console.log(err);
    });
};