import React, { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import api from './api';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [newProductForm, setNewProductForm] = useState({
        name: '',
        price: '',
        description: '',
        stock: ''
    });

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
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Failed to add product. Please try again.');
        }
    };
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <div className='form-container'>

                <form>
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
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
