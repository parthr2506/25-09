import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Users = () => {
    const { isAuthenticated, user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        try {
            const userRes = await api.get('/users')
            setUsers(userRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }

    }
    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated || user?.role !== 'SELLER') {
                navigate('/unauthorized-page', { replace: true });
            } else {
                fetchUsers();
            }
        }
    }, [isAuthenticated, isLoading, user, navigate]);

    const assignRole = async (userId, currentRole) => {
        const newRole = currentRole === 'USER' ? 'SELLER' : 'USER';
        try {
            await api.post('/users/assign-role', { userId, role: newRole });
            alert(`User role changed to ${newRole}`);
            setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
            if (user.id === userId) {
                logout();
            }
        } catch (err) {
            console.error('Failed to change role:', err);
            alert('Failed to change role');
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                alert('User deleted!');
                setUsers(users.filter((u) => u.id !== id));
            } catch (err) {
                console.error('Error while deleting user:', err);
                alert('Failed to delete user');
            }
        }
    };
    return (
        <div>
            <section>
                <h3>Users</h3>
                {users.map(u => (
                    <div key={u.id} style={{ border: '1px solid #ddd', padding: 8, margin: 8 }}>
                        <div>{u.email}</div>
                        <div>{u.role}</div>
                        <button style={{ margin: "10px" }} onClick={() => assignRole(u.id, u.role)}>Change Role</button>
                        <button style={{ margin: "10px" }} onClick={() => deleteUser(u.id)}>Delete User</button>
                    </div>
                ))}
            </section>

        </div>
    )
}

export default Users
