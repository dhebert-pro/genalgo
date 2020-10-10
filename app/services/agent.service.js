const Agent = require('../models/agent.model');

exports.create = agentParam => {

    const agent = new Agent(agentParam);

    return agent.save();
};

exports.findGenerationWinner = generation => {
    return Agent.find({ generation }).sort({'winning': -1}).limit(1);
}
exports.findById = agentId => {
    return Agent.findById(agentId);
}