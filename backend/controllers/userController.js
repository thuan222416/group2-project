// controllers/userController.js
const User = require('../models/User');

// GET all users from MongoDB
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE one or more users in MongoDB
const createUser = async (req, res) => {
    try {
        const input = req.body;
        const result = Array.isArray(input) ? await User.insertMany(input) : await User.create(input);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE a user from MongoDB
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    deleteUser
};