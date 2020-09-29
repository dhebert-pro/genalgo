module.exports = (app) => {
    const generationPool = require('../controllers/generationPool.controller');

    // Create generations
    app.post('/generation-pool', generationPool.generate);

}