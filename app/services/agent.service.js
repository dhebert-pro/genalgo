const Agent = require('../models/agent.model');

// Create and Save a new generation
exports.create = agentParam => {

    // Create a generation
    const agent = new Agent(agentParam);

    // Save generation in the database
    return agent.save()
    .then(err => {
        return err;
    });
};

exports.findByGeneration = generation => {

    return Agent.find({ generation });
    
}