import { useAuth } from './useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const isAdmin = user?.role === "SELLER";

    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default AdminRoute;
