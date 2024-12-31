import React from 'react';
import { Link } from 'react-router-dom';

function Modal({ show, onClose, onEnableLocation, onSearchManually }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Permission Required</h2>
                <p className="text-gray-600 mb-6">
                    Please enable your location to proceed or search manually.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={onEnableLocation}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        Enable Location
                    </button>
                    <button
                        onClick={onSearchManually}
                        className="w-full py-2 px-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                    >
                        Search Manually
                    </button>
                    <Link
                        to="/address-form"
                        className="block w-full text-center py-2 px-4 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200 transition"
                    >
                        Enter Address Manually
                    </Link>
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 px-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default Modal;
