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
import AddUsers from './AddUsers';
import AdminProducts from './AdminProducts';
import Profile from './Profile';
import UnauthorizedPage from './UnauthorizedPage';
import AdminUsers from './AdminUsers';

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
                    : <Navigate to="/home" replace />
            } />

            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<SidebarLayout />}>
                <Route path="/home" element={<Products />} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                <Route path="/admin" element={<AdminRoute />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="users/add" element={<AddUsers />} />
                </Route>
            </Route>
            <Route path="*" element={<UnauthorizedPage />}></Route>
        </Routes>
    );
};

export default AuthRoutes;
