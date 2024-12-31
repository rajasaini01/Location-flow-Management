import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AddressForm() {
    const [formData, setFormData] = useState({
        houseNumber: '',
        street: '',
        city: '',
        country: '',
        code: '',
        type: 'Home',
    });
    const [error, setError] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [saveMessage, setSaveMessage] = useState(null);
    const { userId } = useAuth();
    const navigate = useNavigate();

    const token = document.cookie.replace('token=', '');
    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        }
    }, [userId]);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/addresses', {
                ...authHeader,
                params: { userId },
            });

            if (response.data.success) {
                setAddresses(response.data.data);
            } else {
                setError('No addresses found.');
            }
        } catch (err) {
            setError('Failed to fetch addresses. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleConfirmAddress = async () => {
        let payload;

        if (selectedAddress) {
            payload = {
                userId,
                addressId: selectedAddress._id,
            };
        } else {
            const addressString = `${formData.houseNumber}, ${formData.street}, ${formData.city}, ${formData.country}, ${formData.code} (${formData.type})`;
            payload = {
                userId,
                addressName: addressString,
                addressType: formData.type,
            };
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/addresses',
                payload,
                authHeader
            );
            setSaveMessage('Address saved successfully!');
            setTimeout(() => setSaveMessage(null), 3000);
            navigate('/profile');
        } catch {
            setError('Failed to save address. Please try again.');
        }
    };

    const handleAddressSelection = (address) => {
        setSelectedAddress(address);
        if (address) {
            setFormData({
                houseNumber: '',
                street: '',
                city: '',
                country: '',
                code: '',
                type: 'Home',
            });
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {saveMessage && <p className="text-green-500 mb-4 text-center">{saveMessage}</p>}

            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
                Manage Your Address
            </h1>
            <p className="text-gray-600 text-center mb-8">
                Select an existing address or add a new one to proceed.
            </p>

            <div className="mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Saved Addresses
                </h2>
                {addresses.length > 0 ? (
                    <ul className="space-y-4">
                        {addresses.map((address, index) => (
                            <li
                                key={index}
                                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-300 rounded-lg ${selectedAddress === address ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div>
                                    <p className="text-gray-800 font-medium">
                                        {address.addressName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Type: {address.addressType}
                                    </p>
                                    {address.isFavorite && (
                                        <span className="text-sm text-green-500">Favorite</span>
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    id={`address-${index}`}
                                    name="savedAddress"
                                    className="form-radio text-blue-500 mt-2 sm:mt-0"
                                    checked={selectedAddress === address}
                                    onChange={() => handleAddressSelection(address)}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No saved addresses found.</p>
                )}
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Add a New Address</h2>
            <form
                className={`space-y-4 ${selectedAddress ? 'opacity-50 pointer-events-none' : ''
                    }`}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="houseNumber"
                        placeholder="House/Flat/Block No."
                        value={formData.houseNumber}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        name="street"
                        placeholder="Street/Area"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="code"
                        placeholder="Postal Code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                        <option value="Home">Home</option>
                        <option value="Office">Work</option>
                        <option value="Friends">Other</option>
                    </select>
                </div>
            </form>

            <button
                onClick={handleConfirmAddress}
                className={`w-full mt-6 p-3 text-white font-semibold rounded-lg transition ${selectedAddress || formData.houseNumber
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                disabled={!selectedAddress && !formData.houseNumber}
            >
                Confirm Address
            </button>
        </div>
    );
}

export default AddressForm;
