const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

router.get('/', async (req, res) => {
    const genres = await Genre
        .find()
        .sort({ name: 1 });
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).send("No genre found");
        res.send(genre);
    } catch (err) {
        res.send(err);
    }
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send(error.details[0].message);

    let genre = new Genre({
        'name': req.body.name
    });

    genre = await genre.save();
    res.send(genre);

});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        }
    }, { new: true });
    if (!genre) return res.status(404).send("No genre found");

    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send("No genre found");

    res.send(genre);
});

function validate(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}

module.exports = router;