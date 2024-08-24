const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    size: { type: String, required: true },
    format: { type: String, required: true },
    path: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const File = mongoose.model('File', FileSchema);
module.exports = File;
