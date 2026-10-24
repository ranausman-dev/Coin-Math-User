import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const token = localStorage.getItem('authToken');
    
    return (
        <Route
            {...rest}
            render={(props) => 
                token ? (
                    <Component {...props} />
                ) : (
                    <Navigate to="/signin" />
                )
            }
        />
    );
};

export default ProtectedRoute;
