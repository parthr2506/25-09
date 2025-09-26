import React from 'react'
import { useAuth } from './useAuth'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const isAdmin = user?.role === "SELLER"; // Assuming 'SELLER' is the admin role

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;
