import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth';

const Profile = () => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) {

        return <Navigate to="/login" replace ></Navigate>
    }
    return (
        <div className='profie-container'>
            <h2>User Profile</h2>
            <div className='profile-details'>
                <p>{user.email}</p>
                <p>{user.role}</p>
            </div>
        </div>
    )
}

export default Profile
