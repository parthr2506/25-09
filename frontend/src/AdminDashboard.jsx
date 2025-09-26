import React, { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import api from './api';

const AdminDashboard = () => {
    const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newProductForm, setNewProductForm] = useState({
        name: '',
        price: '',
        description: '',
    });

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [userRes, productRes] = await Promise.all([
                api.get('/users'),
                api.get('/products'),
            ]);
            setUsers(userRes.data);
            setProducts(productRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            // The API interceptor will handle the 401 Unauthorized globally.
            // For other errors, we set an error message.
            if (err.response?.status !== 401 && err.response?.status !== 403) {
                setError('Failed to fetch dashboard data. Please check your network or try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'SELLER') {
                // Assuming admin role is 'SELLER' based on your backend
                navigate('/unauthorized-page', { replace: true });
            } else {
                fetchData();
            }
        }
    }, [isAuthenticated, authLoading, user, navigate]);

    const handleProductFormChange = (e) => {
        setNewProductForm({ ...newProductForm, [e.target.name]: e.target.value });
    };

    const addProduct = async () => {
        if (!newProductForm.name || !newProductForm.price || !newProductForm.description) {
            alert('Please provide all fields');
            return;
        }
        try {
            await api.post('/products', {
                name: newProductForm.name,
                description: newProductForm.description,
                price: Number(newProductForm.price),
                stock: 1, // Assuming a default value
                images: [], // Assuming an empty array for now
            });
            alert('Product added successfully!');
            setNewProductForm({ name: '', price: '', description: '' });
            fetchData();
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Failed to add product. Please try again.');
        }
    };

    const assignRole = async (userId, role) => {
        try {
            await api.post('/users/assign-role', { userId, role });
            alert(`User role changed to ${role}`);
            setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
        } catch (err) {
            console.error('Failed to assign role:', err);
            alert('Failed to assign role');
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                alert('User deleted!');
                setUsers(users.filter((u) => u.id !== id));
            } catch (err) {
                console.error('Failed to delete user:', err);
                alert('Failed to delete user');
            }
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                alert('Product deleted!');
                setProducts(products.filter((p) => p.id !== id));
            } catch (err) {
                console.error('Failed to delete product:', err);
                alert('Failed to delete product');
            }
        }
    };

    if (authLoading || loading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    // Authorization check to render only for authenticated 'SELLER' users
    if (!isAuthenticated || user?.role !== 'SELLER') {
        return <div>You are not authorized to view this page.</div>;
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <section>
                <h3>Create Product</h3>
                <input
                    name="name"
                    placeholder="enter product name"
                    value={newProductForm.name}
                    onChange={handleProductFormChange}
                />
                <input
                    name="price"
                    placeholder="enter price"
                    value={newProductForm.price}
                    onChange={handleProductFormChange}
                />
                <input
                    name="description"
                    placeholder="enter product description"
                    value={newProductForm.description}
                    onChange={handleProductFormChange}
                />
                <button onClick={addProduct}>Add</button>
            </section>
            <section>
                <h3>Products</h3>
                {products.map(product => (
                    <div key={product.id} style={{ border: '1px solid #ddd', padding: 8, margin: 8 }}>
                        <div>{product.name}---{product.price}</div>
                        <button onClick={() => deleteProduct(product.id)}>Delete</button>
                    </div>
                ))}
            </section>
            <section>
                <h3>Users</h3>
                {users.map(u => (
                    <div key={u.id} style={{ border: '1px solid #ddd', padding: 8, margin: 8 }}>
                        <div>{u.email}--{u.role}</div>
                        <button onClick={() => assignRole(u.id, u.role === 'USER' ? 'SELLER' : 'USER')}>Toggle Role</button>
                        <button onClick={() => deleteUser(u.id)}>Delete User</button>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default AdminDashboard;
