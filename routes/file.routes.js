const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const User = require('../models/user.model');
const File = require('../models/file.model');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
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
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const filePath = path.join(__dirname, '../', req.file.path);
        const dataBuffer = fs.readFileSync(filePath);

        const sizeInMB = dataBuffer.length / (1024 * 1024);
        const roundedSizeInMB = Math.round(sizeInMB * 100) / 100;

        const pdfData = await pdfParse(dataBuffer);
        const pages = pdfData.numpages;

        const newFile = new File({
            filename: req.file.originalname,
            size: `${roundedSizeInMB} MB`,
            format: 'pdf',
            pages: pages,
            userId: user._id,
            path: req.file.path
        });

        await newFile.save();
        user.files.push(newFile._id);
        await user.save();

        res.status(201).json(newFile);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
});

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size exceeds the 5MB limit.', code: 'LIMIT_FILE_SIZE' });
        }
    } else if (err) {
        return res.status(500).json({ message: 'Server Error: ' + err.message });
    }
    next();
});

module.exports = router;
