const MoveService = require('../services/move.service');

exports.find = (req, res) => {
    MoveService.find(req.query.agentId, req.query.params).then(data => {
        res.send(data);   
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Erreur lors de la génération'
        });
        console.log(err);
    });
};