const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Example route to fetch user profile
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
