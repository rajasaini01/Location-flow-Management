const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);

        const existingUser = await User.findOne({ emailId: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log(existingUser);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            emailId: email,
            name: name,
            password: hashedPassword,
        });
        console.log(newUser);

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const existingUser = await User.findOne({ emailId: email });
        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.emailId },
            process.env.JWT_SECRET || 'defaultSecret',
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            existingUser,
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};