const express = require('express');
const {
    saveAddress,
    getAddresses,
    deleteAddress,
    reverseGeocode,
    toggleFavorite
} = require('../controllers/addressControllers');

const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/', saveAddress);
router.get('/', getAddresses);
router.delete('/delete/:addressId/:userId', deleteAddress);
router.post('/reverse-geocode', authMiddleware, reverseGeocode);
router.patch('/favorite/:addressId', toggleFavorite);

module.exports = router;
