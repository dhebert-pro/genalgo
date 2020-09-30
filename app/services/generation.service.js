const Generation = require('../models/generation.model');

// Create and Save a new generation
exports.create = generationParam => {

    // Create a generation
    const generation = new Generation(generationParam);

    // Save generation in the database
    return generation.save()
    .then(data => {
        return data;
    });
};