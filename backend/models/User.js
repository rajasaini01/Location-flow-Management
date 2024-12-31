const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    addressName: {
        type: String,
        required: true,
        trim: true,
    },
    addressType: {
        type: String,
        enum: ['Home', 'Work', 'Other'],
        required: true,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
});

const userSchema = new mongoose.Schema(
    {
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        addresses: {
            type: [addressSchema],
            default: [],
        },
        orderAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address', // Reference to the address if it's stored in another collection.
            required: false, // Optional if not always required.
        },
        type: {
            type: String,
            enum: ['Admin', 'User'],
            default: 'User',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
