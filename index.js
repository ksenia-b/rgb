const userRoutes = require('./routes/user.routes');
const express = require('express');
const app = express();

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log("Server is running on port 3002");
});