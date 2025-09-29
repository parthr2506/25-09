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
        stock: ''
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

            if (err.response?.status !== 401 && err.response?.status !== 403) {
                setError('network error');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'SELLER') {
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
                stock: Number(newProductForm.stock),
                images: [],
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
    const updateProduct = async (id, newStock) => {
        if (newStock < 0) return;
        try {
            await api.put(`/products/${id}/stock`, { stock: newStock })
            setProducts(products.map(p => (p.id == id ? { ...p, stock: newStock } : p)))
        } catch (error) {
            console.log("cannot update stock");
            alert("stock update failed")

        }

    }
    if (authLoading || loading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!isAuthenticated || user?.role !== 'SELLER') {
        return <div>You are not authorized to view this page.</div>;
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <section>
                <h3>Create Product</h3>
                <label htmlFor="name">Product Name:</label>
                <br />
                <input
                    name="name"
                    id="name"
                    placeholder="enter product name"
                    value={newProductForm.name}
                    onChange={handleProductFormChange}
                />
                <br /><br />
                <label htmlFor="price">Price:</label>
                <br />
                <input
                    name="price"
                    id="price"
                    placeholder="enter price"
                    value={newProductForm.price}
                    onChange={handleProductFormChange}
                />
                <br /><br />
                <label htmlFor="description">Description:</label>
                <br />
                <input
                    name="description"
                    id="description"
                    placeholder="enter product description"
                    value={newProductForm.description}
                    onChange={handleProductFormChange}
                />
                <br /><br />
                <label htmlFor="stock">Stock:</label>
                <br />
                <input
                    name="stock"
                    id="stock"
                    placeholder="enter quantity"
                    value={newProductForm.stock}
                    onChange={handleProductFormChange}
                />
                <br /><br />
                <button className="btn" onClick={addProduct}>Add</button>
            </section>
            <section>
                <h3>Products</h3>
                {products.map(product => (
                    <div key={product.id} style={{ border: '1px solid #ddd', padding: 8, margin: 8 }}>
                        <div>{product.name}</div>
                        <div> Rs:{product.price}</div>
                        <div>Qty:{product.stock}</div>
                        <button style={{ margin: "10px" }} onClick={() => updateProduct(product.id, product.stock - 1)}>-</button>
                        <button style={{ margin: "10px" }} onClick={() => updateProduct(product.id, product.stock + 1)}>+</button>
                        <button style={{ margin: "10px" }} onClick={() => deleteProduct(product.id)}>Delete</button>
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
