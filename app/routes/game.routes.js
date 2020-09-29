module.exports = (app) => {
    const game = require('../controllers/game.controller');

    // Create generations
    app.post('/generation-pool', game.generate);

}