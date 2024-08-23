const express = require('express');
const router = express.Router();
// const User = require('../models/user.model');

router.get("/:userId", async (req, res) => {
    try {
        console.log("find user by id here", req.params.userId)
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;