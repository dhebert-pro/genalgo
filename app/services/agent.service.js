const Agent = require('../models/agent.model');

// Create and Save a new generation
exports.create = agentParam => {

    const agent = new Agent(agentParam);

    return agent.save()
    .then(err => {
        return err;
    });
};

exports.findGenerationWinner = generation => {
    return Agent.find({ generation }).sort({'winning': -1}).limit(1);
}