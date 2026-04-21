const User = require('../models/User');

async function register(req, res) {
    try {
        const data = req.body;
        const result = await User.create(data);
        res.status(201).send(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function login(req, res) {
    const data = req.body;
    try {
        const user = await User.getOneByEmail(data.email);
        if (!user) { throw new Error('No user with this email') }

        if (user) {
            res.status(200).json(user);
        } else {
            throw new Error('User could not be authenticated');
        }
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
} // <-- this was missing

async function updateProfile(req, res) {
    try {
        const email = req.params.email;
        const data = req.body;

        const updated = await User.update(email, data);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getProfile(req, res) {
    try {
        const user = await User.getOneByEmail(req.params.email);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

module.exports = { register, login, updateProfile, getProfile };