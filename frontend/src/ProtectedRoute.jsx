import { Navigate, Outlet } from "react-router-dom";
import React from 'react';
import { useAuth } from "./useAuth";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading....</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
export default ProtectedRoute;
