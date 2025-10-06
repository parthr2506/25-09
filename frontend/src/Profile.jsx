import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const Profile = () => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h2 className="profile-h2">User Profile</h2>
                <div className="profile-details">
                    <div className="profile-inner-container">
                        <p className="profile-title">Email Address</p>
                        <p className="profile-email">{user.email}</p>
                    </div>
                    <div className="profile-inner-container">
                        <p className="profile-title">User Role</p>
                        <p className="profile-p">{user.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
