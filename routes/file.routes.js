const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse'); // Use pdf-parse for server-side PDF processing
const User = require('../models/user.model');
const File = require('../models/file.model');

const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-abc`); // ${file.originalname}
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // 5 MB size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDFs are allowed.'));
        }
    }
});

router.post('/upload/:userId', upload.single('file'), async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const filePath = req.body.file;
        const dataBuffer = fs.readFileSync(filePath);
        const sizeInMB = sizeInBytes / (1024 * 1024);
        const roundedSizeInMB = Math.round(sizeInMB * 100) / 100;

        const pdfData = await pdfParse(dataBuffer);

        const pages = pdfData.numpages;

        const newFile = new File({
            filename: req.body.file,
            size: roundedSizeInMB,
            format: 'pdf',
            pages: pages,
            userId: user._id,
            path: req.body.file
        });

        await newFile.save();
        user.files.push(newFile._id);
        await user.save();

        res.status(201).json(newFile);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error: ' + error.message);
    }
});

module.exports = router;
