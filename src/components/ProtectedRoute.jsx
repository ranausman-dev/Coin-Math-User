import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
    const userId = localStorage.getItem('userId');
    return userId ? children : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
