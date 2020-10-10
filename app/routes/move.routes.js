module.exports = (app) => {
    const move = require('../controllers/move.controller');

    // Create generations
    app.get('/moves', move.find);

}