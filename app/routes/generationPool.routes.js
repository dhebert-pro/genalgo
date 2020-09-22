module.exports = (app) => {
    const generationPool = require('../controllers/generationPool.controller.js');

    // Create generations
    app.post('/generation-pool', generationPool.generate);

}