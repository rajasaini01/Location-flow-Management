import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyMapComponent = () => {
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 });
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [saveMessage, setSaveMessage] = useState(null);
    const searchInputRef = useRef(null);
    const token = Cookies.get('token');
    const { userId } = useAuth();
    const navigate = useNavigate();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: '',
        libraries: ['places'],
    });

    const authHeader = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    };

    const onMapLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);

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
            return formattedAddress;
        } catch {
            setError('Failed to fetch address. Please try again.');
            return null;
        }
    };

    const handleSearch = async (autocomplete) => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const { lat, lng } = place.geometry.location;
            const newLocation = { lat: lat(), lng: lng() };
            setLocation(newLocation);
            setMarker(newLocation);
            map.panTo(newLocation);

            // Fetch address from coordinates
            const formattedAddress = await fetchAddress(newLocation);

            // Add to recent searches
            if (formattedAddress) {
                setRecentSearches((prevSearches) => {
                    const updatedSearches = [
                        { lat: newLocation.lat, lng: newLocation.lng, formattedAddress },
                        ...prevSearches,
                    ];
                    return updatedSearches.slice(0, 5); // Limit to 5 most recent searches
                });
            }
        }
    };

    useEffect(() => {
        if (searchInputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current);
            autocomplete.setFields(['geometry']);
            autocomplete.addListener('place_changed', () => handleSearch(autocomplete));
        }
    }, [map]);

    const handleRecentSearchClick = async (search) => {
        setLocation({ lat: search.lat, lng: search.lng });
        setMarker({ lat: search.lat, lng: search.lng });
        map.panTo({ lat: search.lat, lng: search.lng });

        // Fetch address from coordinates
        const formattedAddress = await fetchAddress({ lat: search.lat, lng: search.lng });
        setAddress(formattedAddress);
    };

    const handleConfirmAddress = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/addresses',
                { userId, addressName: address, addressType: 'Home' },
                authHeader
            );
            console.log(response);
            setSaveMessage('Address saved successfully!');
            setTimeout(() => setSaveMessage(null), 3000);
            navigate('/profile');
        } catch {
            setError('Failed to save address. Please try again.');
        }
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                Search for a Location
            </h1>
            <p className="text-gray-600 mb-4 text-center">
                Use the search box below to find a location. The map will automatically update!
            </p>
            <div className="w-full max-w-lg mb-6">
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Enter a location"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            <div className="w-full max-w-lg mb-6">
                <h2 className="text-lg font-semibold text-gray-700">Recent Searches</h2>
                <ul className="mt-2">
                    {recentSearches.map((search, index) => (
                        <li
                            key={index}
                            className="cursor-pointer text-blue-500 hover:underline"
                            onClick={() => handleRecentSearchClick(search)}
                        >
                            {`${search.formattedAddress} (Lat: ${search.lat.toFixed(4)}, Lng: ${search.lng.toFixed(4)})`}
                        </li>
                    ))}
                </ul>
            </div>
            {address && (
                <div className="w-full max-w-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">Address:</h3>
                    <p className="mt-2 text-gray-600">{address}</p>
                    <button
                        onClick={handleConfirmAddress}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Confirm Address
                    </button>
                </div>
            )}
            {saveMessage && (
                <div className="w-full max-w-lg mb-6">
                    <p className="text-green-500">{saveMessage}</p>
                </div>
            )}
            {error && (
                <div className="w-full max-w-lg mb-6">
                    <p className="text-red-500">{error}</p>
                </div>
            )}
            <div className="w-full h-[500px] max-w-4xl rounded-lg shadow-lg overflow-hidden">
                <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={location}
                    zoom={12}
                    onLoad={onMapLoad}
                >
                    {marker && <Marker position={marker} />}
                </GoogleMap>
            </div>
            <div>

            </div>
        </div>
    );
};

export default MyMapComponent;
