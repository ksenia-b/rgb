const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');

require('dotenv').config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error) => console.error('Connection error:', error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
