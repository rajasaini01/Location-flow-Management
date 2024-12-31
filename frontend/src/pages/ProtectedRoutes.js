import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoutes = () => {
    const { userId } = useAuth();
    console.log(userId);
    return userId ? <Outlet /> : <Navigate to='/auth/login' />;
}

export default ProtectedRoutes
