import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading....</div>;
    }

    // if (!isAuthenticated) {
    //     return <Navigate to="/login" replace />;
    // }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
