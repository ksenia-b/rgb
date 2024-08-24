const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.get("/:userId", async (req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;

        const user = await User.findById(req.params.userId).populate({
            path: 'files',
            options: {
                skip: (page - 1) * limit,
                limit: parseInt(limit)
            }
        });
        console.log("----> founded user = ", user)

        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.status(200).send(user);

    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;