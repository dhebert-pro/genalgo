const Agent = require('../models/agent.model');

// Create and Save a new generation
exports.create = agentParam => {

    // Create a generation
    const agent = new Agent(agentParam);

    // Save generation in the database
    return agent.save()
    .then(data => {
        return data;
    }).catch(err => {
        throw err.message || "Un problème est survenu lors de la création de la génération.";
    });
};