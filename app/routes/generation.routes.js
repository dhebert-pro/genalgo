module.exports = (app) => {
    const generations = require('../controllers/generation.controller');

    // Create a new generation
    app.post('/generations', generations.create);

    // Retrieve all generations
    app.get('/generations', generations.findAll);

    // Retrieve a single generation with generationId
    app.get('/generations/:generationId', generations.findOne);

    // Update a generation with generationId
    app.put('/generations/:generationId', generations.update);

    // Delete a generation with generationId
    app.delete('/generations/:generationId', generations.delete);
}