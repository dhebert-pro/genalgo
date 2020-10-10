const Agent = require('../models/agent.model');

exports.create = agentParam => {

    const agent = new Agent(agentParam);

    return agent.save();
};

exports.findGenerationWinner = generation => {
    return Agent.find({ generation }).sort({'winning': -1}).limit(1);
}

exports.findByGeneration = generation => {
    return Agent.find({ generation }).lean();
}

exports.findById = agentId => {
    return Agent.findById(agentId);
}