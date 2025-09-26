import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';
import { useAuth } from './useAuth';
import Products from './Products';
import Cart from './Cart';
import AdminDashboard from './AdminDashboard';
import Unauthorized from './Unauthorized';

const AuthRoutes = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const isAdmin = user?.role === "SELLER";

    const handleInitialRedirect = () => {
        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        if (isAdmin) {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/home" replace />;
    };

    return (
        <Routes>
            <Route path="/" element={handleInitialRedirect()} />

            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
            </Route>

            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="/unauthorized-page" element={<Unauthorized />} />

            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
};

export default AuthRoutes;
