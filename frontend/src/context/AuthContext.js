import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        const cookieUserId = Cookies.get('userId');
        const cookieName = Cookies.get('name');
        const cookieAddress = Cookies.get('address');

        if (cookieUserId) setUserId(cookieUserId);
        if (cookieName) setName(cookieName);
        if (cookieAddress) setAddress(cookieAddress);
    }, []);

    const updateStateAndCookie = (key, value, updater) => {
        updater(value);
        Cookies.set(key, value);
    };

    return (
        <AuthContext.Provider
            value={{
                userId,
                setUserId: (id) => updateStateAndCookie('userId', id, setUserId),
                name,
                setName: (name) => updateStateAndCookie('name', name, setName),
                address,
                setAddress: (address) => updateStateAndCookie('address', address, setAddress),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
