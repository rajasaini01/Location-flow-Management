import React, { useState } from 'react';
import Map from '../components/Map';
import Modal from '../components/Modal';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
    const [showModal, setShowModal] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [location, setLocation] = useState({ lat: -34.397, lng: 150.644 });
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState(null);

    const { userId } = useAuth();
    const navigate = useNavigate();

    const token = Cookies.get('token');
    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const handleEnableLocation = () => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setLocation(coords);
                await fetchAddress(coords);
                setShowModal(false);
                setShowMap(true);
            },
            () => {
                setError('Failed to fetch location. Please enable location services.');
            }
        );
    };

    const handleMarkerDragEnd = async (event) => {
        const newLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setLocation(newLocation);
        await fetchAddress(newLocation);
    };

    const fetchAddress = async (coords) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/addresses/reverse-geocode',
                coords,
                authHeader
            );
            const formattedAddress =
                response.data?.data?.[0]?.formatted_address || 'Address not found';
            setAddress(formattedAddress);
        } catch {
            setError('Failed to fetch address. Please try again.');
        }
    };

    const handleConfirmAddress = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/addresses',
                { userId, addressName: address, addressType: 'Home' },
                authHeader
            );
            setSaveMessage('Address saved successfully!');
            setTimeout(() => setSaveMessage(null), 3000); // Clear message after 3 seconds
            navigate('/profile');
        } catch {
            setError('Failed to save address. Please try again.');
        }
    };

    const handleCloseMap = () => {
        setShowMap(false);
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Profile Link */}
            <div className="absolute top-4 right-4">
                <a href="/profile" className="text-blue-600 font-bold text-lg">
                    Profile
                </a>
            </div>

            <h1 className="text-center text-3xl font-semibold mt-8">Select Your Location</h1>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            {/* Save Message */}
            {saveMessage && <p className="text-green-500 text-center mt-4">{saveMessage}</p>}

            {/* Modal for Location Enable */}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                onEnableLocation={handleEnableLocation}
                onSearchManually={() => {
                    setShowModal(false);
                    setShowMap(true);
                }}
            />

            {/* Map and Address Section */}
            {showMap && (
                <div className="relative mt-8 p-4 bg-white shadow-lg rounded-lg mx-auto max-w-4xl">
                    <Map center={location} onMarkerDragEnd={handleMarkerDragEnd} />
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <p className="text-lg font-medium">
                            <strong>Selected Address:</strong> {address || 'Fetching address...'}
                        </p>
                        <div className="flex gap-4 mt-4">
                            <button
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                                onClick={handleConfirmAddress}
                            >
                                Confirm Address
                            </button>
                            <Link
                                to="/search"
                                className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 text-center"
                            >
                                Search Manually
                            </Link>
                            <button
                                className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
                                onClick={handleCloseMap}
                            >
                                Close Map
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
