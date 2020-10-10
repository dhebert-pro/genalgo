const GameService = require('../services/game.service');

exports.generate = (req, res) => {
    GameService.generate().then(() => {
        res.status(201).send();   
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Erreur lors de la génération'
        });
        console.log(err);
    });
};