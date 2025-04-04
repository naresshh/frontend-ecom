import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '../Context/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
    const { auth } = useAuth();
    return auth.isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
