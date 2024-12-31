import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AddressList() {
    const [addresses, setAddresses] = useState([]);
    const [error, setError] = useState(null);
    const { userId, name } = useAuth();
    const token = document.cookie.replace('token=', '');

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        }
    }, [userId]);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/addresses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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

    const handleDelete = async (addressId) => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/addresses/delete/${addressId}/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setAddresses((prevAddresses) => prevAddresses.filter((address) => address._id !== addressId));
            } else {
                setError('Failed to delete address. Please try again.');
            }
        } catch (err) {
            setError('Failed to delete address. Please try again.');
        }
    };

    const handleToggleFavorite = async (addressId) => {
        try {
            const response = await axios.patch(
                `http://localhost:5000/api/addresses/favorite/${addressId}`,
                { userId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                fetchAddresses();
            } else {
                setError('Failed to update favorite status. Please try again.');
            }
        } catch (err) {
            setError('Failed to update favorite status. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 class="text-4xl font-extrabold text-center text-gray-800 mt-6">
                Hello <span class="text-blue-500">{name}</span>
            </h1>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {addresses.length === 0 ? (
                <p className="text-center text-gray-500">No addresses available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                        >
                            <p className="text-lg font-bold">{address.addressName}</p>
                            <p className="text-gray-600">Type: {address.addressType}</p>
                            {address.isFavorite && (
                                <p className="text-red-500 font-semibold">❤️ Favorite</p>
                            )}
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => handleDelete(address._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleToggleFavorite(address._id)}
                                    className={`px-4 py-2 ${address.isFavorite
                                        ? 'bg-gray-300 text-gray-800'
                                        : 'bg-blue-500 text-white'
                                        } rounded-lg hover:bg-opacity-80 transition`}
                                >
                                    {address.isFavorite ? 'Remove from Favorite' : 'Add to Favorite'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AddressList;
