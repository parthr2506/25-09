import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

const PublicRoute = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return <div>Loading....</div>;
    }

    return !isAuthenticated ? <Outlet /> : <Navigate to="/home" replace />;
};

export default PublicRoute;
