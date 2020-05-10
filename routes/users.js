const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {User, validateUser} = require('../models/user');

router.get("/", async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
});

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email});
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;