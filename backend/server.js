require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully.');
        // Start server only after DB connection is successful
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });