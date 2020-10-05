const Agent = require('../models/agent.model');
const AgentService = require('../services/agent.service')

exports.create = (req, res) => {
    AgentService.create(req.body).then(data => {
        res.status(201).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Erreur lors de la création de l'agent."
        });
        console.log(err);
    });
};

exports.findAll = (req, res) => {
    Agent.find()
    .then(agents => {
        res.send(agents);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Erreur lors de la récupération des agents."
        });
        console.log(err);
    });
};

exports.deleteAll = (req, res) => {
    Agent.deleteMany({})
    .then(() => {
        res.status(204).end();
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Erreur lors de la suppression des agents."
        });
        console.log(err);
    });
};