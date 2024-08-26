const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.get("/:userId", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        if (page < 1 || limit < 1) {
            return res.status(400).send('Invalid page or limit parameter');
        }

        const user = await User.findById(req.params.userId).populate({
            path: 'files',
            options: {
                skip: (page - 1) * limit,
                limit: limit
            }
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
