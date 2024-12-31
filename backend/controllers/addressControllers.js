const User = require('../models/User');
const axios = require('axios');

// Save Address
exports.saveAddress = async (req, res) => {
    const { userId, addressId, addressName, addressType, isFavorite } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required',
        });
    }

    try {
        let user;

        // If `addressId` is provided, set it as the selected order address
        if (addressId) {
            user = await User.findByIdAndUpdate(
                userId,
                { orderAddress: addressId },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Address selected successfully',
                data: user.orderAddress,
            });
        }

        // Validate required fields for new address creation
        if (!addressName || !addressType) {
            return res.status(400).json({
                success: false,
                message: 'Address name and address type are required for new addresses',
            });
        }

        // Create a new address
        const newAddress = { addressName, addressType, isFavorite: isFavorite || false };

        user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        user.addresses.push(newAddress);

        // Save the user and get the newly added address
        const savedUser = await user.save();
        const addedAddress = savedUser.addresses[savedUser.addresses.length - 1];

        // Set the `orderAddress` to the ID of the newly added address
        user.orderAddress = addedAddress._id;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Address saved and set as order address successfully',
            data: addedAddress,
        });
    } catch (error) {
        console.error('Error saving address:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


// Get All Addresses
exports.getAddresses = async (req, res) => {
    try {
        const users = await User.find({}, 'addresses');
        const addresses = users.flatMap(user => user.addresses);

        res.status(200).json({
            success: true,
            data: addresses
        });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
    const { addressId, userId } = req.params;
    console.log(req.params);
    if (!userId || !addressId) {
        return res.status(400).json({
            success: false,
            message: 'User ID and address ID are required'
        });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User or address not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Reverse Geocode
exports.reverseGeocode = async (req, res) => {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({
            success: false,
            message: 'Latitude and longitude are required'
        });
    }

    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );

        if (response.data.status !== 'OK') {
            return res.status(400).json({
                success: false,
                message: 'Failed to fetch address'
            });
        }

        res.status(200).json({
            success: true,
            data: response.data.results
        });
    } catch (error) {
        console.error('Error during reverse geocoding:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.toggleFavorite = async (req, res) => {
    const { addressId } = req.params;
    const { userId } = req.body;
    console.log(addressId, userId);
    if (!addressId || !userId) {
        return res.status(400).json({ success: false, message: 'Address ID and user ID are required' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        console.log(user.addresses);
        const addressIndex = user.addresses.findIndex(address => address._id.toString() === addressId);

        if (addressIndex === -1) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        user.addresses[addressIndex].isFavorite = !user.addresses[addressIndex].isFavorite;

        await user.save();

        res.status(200).json({ success: true, message: 'Favorite status updated successfully' });
    } catch (err) {
        console.error('Error updating favorite status:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};