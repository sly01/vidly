const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlenght: 5,
        maxlength: 50
    }
}));


function validateUser(user) {
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().min(5).max(50).required(),
        password: Joi.string().required()
    };
    return Joi.validate(user, schema);
}

exports.validateUser = validateUser;
exports.User = User;