import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import SidebarLayout from './SidebarLayout';
import Login from './Login';
import Register from './Register';
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

    return (
        <Routes>
            <Route path="/" element={
                isAuthenticated
                    ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />)
                    : <Navigate to="/login" replace />
            } />

            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<SidebarLayout />}>
                    <Route path="/home" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />

                    <Route path="/admin" element={
                        isAdmin
                            ? <AdminDashboard />
                            : <Navigate to="/unauthorized-page" replace />
                    } />
                </Route>
            </Route>

            {/* <Route path="/unauthorized-page" element={<Unauthorized />} /> */}
            {/* <Route path="*" element={<div>Page not found </div>} /> */}
        </Routes>
    );
};

export default AuthRoutes;
