module.exports = (app) => {
    const agents = require('../controllers/agent.controller');

    app.post('/agents', agents.create);
    app.get('/agents', agents.findAll);

}