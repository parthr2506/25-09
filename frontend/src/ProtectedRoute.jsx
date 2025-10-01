import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading....</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
