import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
// import CreatePost from './CreatePost';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
// import EditPost from './EditPost';
import { useAuth } from './useAuth';

const AuthRoutes = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Dashboard />} />
                {/* <Route path="/create-post" element={<CreatePost />} />
                <Route path="/edit-post/:id" element={<EditPost />} /> */}
            </Route>
            <Route
                path="*"
                element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
            />
        </Routes>
    );
};

export default AuthRoutes;
