const Generation = require('../models/generation.model.js');

// Create and Save a new generation
exports.create = (req, res) => {

    // Create a generation
    const generation = new Generation({
        generation: req.body.generation,
        winning: req.body.winning,
        losing: req.body.losing
    });

    // Save generation in the database
    generation.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the generation."
        });
    });
};

// Retrieve and return all generations from the database.
exports.findAll = (req, res) => {
    Generation.find()
    .then(generations => {
        res.send(generations);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving generations."
        });
    });
};

// Find a single generation with a generationId
exports.findOne = (req, res) => {
    Generation.findById(req.params.generationId)
    .then(generation => {
        if(!generation) {
            return res.status(404).send({
                message: "Generation not found with id " + req.params.generationId
            });            
        }
        res.send(generation);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Generation not found with id " + req.params.generationId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving generation with id " + req.params.generationId
        });
    });
};

// Update a generation identified by the generationId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Generation content can not be empty"
        });
    }

    // Find generation and update it with the request body
    Generation.findByIdAndUpdate(req.params.generationId, {
        generation: req.body.generation,
        winning: req.body.winning,
        losing: req.body.losing
    }, {new: true})
    .then(generation => {
        if(!generation) {
            return res.status(404).send({
                message: "Generation not found with id " + req.params.generationId
            });
        }
        res.send(generation);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Generation not found with id " + req.params.generationId
            });                
        }
        return res.status(500).send({
            message: "Error updating generation with id " + req.params.generationId
        });
    });
};

// Delete a generation with the specified generationId in the request
exports.delete = (req, res) => {
    Generation.findByIdAndRemove(req.params.generationId)
    .then(generation => {
        if(!generation) {
            return res.status(404).send({
                message: "Generation not found with id " + req.params.generationId
            });
        }
        res.send({message: "Generation deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Generation not found with id " + req.params.generationId
            });                
        }
        return res.status(500).send({
            message: "Could not delete generation with id " + req.params.generationId
        });
    });
};