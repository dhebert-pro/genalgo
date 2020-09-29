module.exports = (app) => {
    const game = require('../controllers/game.controller');

    // Create generations
    app.post('/game', game.generate);

}