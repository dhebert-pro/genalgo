const Move = require('../models/move.model');
const AgentService = require('./agent.service');
const GameService = require('./game.service');

exports.find = (agentId, params) => {
    if (agentId && params) {
        return Move.find().then(moves => {
            return AgentService.findById(agentId).then(agent => {
                const board = GameService.getBoardFromInformations(params.split(','));
                return GameService.getBestMove(moves, agent, board);
            });
        });
    } else {
        return Move.find().lean();
    }
}