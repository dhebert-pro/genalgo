module.exports = (app) => {
    const generations = require('../controllers/generation.controller');

    app.post('/generations', generations.create);
    app.get('/generations', generations.findAll);
    app.delete('/generations', generations.deleteAll);

}