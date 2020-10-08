const Move = require('../models/move.model');

exports.find = () => {
    return Move.find().lean();
}