const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.get("/:userId", async (req, res) => {
    try {
        // Extract page and limit from query parameters, defaulting to 1 and 3 if not provided
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        // Ensure page and limit are positive integers
        if (page < 1 || limit < 1) {
            return res.status(400).send('Invalid page or limit parameter');
        }

        // Fetch user and paginate files
        const user = await User.findById(req.params.userId).populate({
            path: 'files',
            options: {
                skip: (page - 1) * limit, // Calculate the number of documents to skip
                limit: limit // Limit the number of documents returned
            }
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Send the paginated files along with user data
        res.status(200).json(user);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
