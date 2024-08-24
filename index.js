const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const fileRoutes = require('./routes/file.routes');

require('dotenv').config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error) => console.error('Connection error:', error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/users', userRoutes);
app.use('/files', fileRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
