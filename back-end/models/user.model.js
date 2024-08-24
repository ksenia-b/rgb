const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }] // Reference to File model

});

const User = mongoose.model('User', UserSchema);
module.exports = User;
