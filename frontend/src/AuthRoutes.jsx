import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import SidebarLayout from './components/SidebarLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import AdminDashboard from './adminPages/AdminDashboard';
import AddUsers from './adminPages/AddUsers';
import AdminProducts from './adminPages/AdminProducts';
import Profile from './pages/Profile';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminUsers from './adminPages/AdminUsers';
import AddProducts from './adminPages/AddProducts';
import Watchlist from './pages/Watchlist';

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
                <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />

                <Route path="/admin" element={<AdminRoute />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/add" element={<AddProducts />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="users/add" element={<AddUsers />} />
                </Route>
            </Route>
            <Route path="*" element={<UnauthorizedPage />}></Route>
        </Routes>
    );
};

export default AuthRoutes;
