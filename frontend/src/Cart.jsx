import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './useAuth';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { isAuthenticated, cartItems, updateCart } = useAuth();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/cart');
            setItems(response.data);
        } catch (error) {
            console.error("Cannot Fetch cart items:", error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCartItems();
        } else {
            setItems([]);
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const remove = async (id) => {
        const originalItems = items;
        try {
            setItems(items.filter(item => item.id !== id));
            await api.post('/cart/delete', { id });
            alert("Item Removed From Cart");
            updateCart()
        } catch (error) {
            console.error("Error Removing the Items:", error);
            alert("Error removing item. Please try again.");
            setItems(originalItems);
        }
    };

    if (isLoading) {
        return <div>Loading cart...</div>;
    }

    if (items.length === 0) {
        return (
            <div>
                <h2>Cart</h2>
                <p>Your cart is empty.</p>
                <Button startIcon={<ArrowBackSharpIcon />} onClick={() => navigate('/home')}>BACK</Button>
            </div>
        );
    }

    return (
        <>
            <h2>Cart</h2>
            <div className='cartWrapper'>
                {items.map(item => (
                    <div className="cartCard" key={item.id}>
                        <img src={item.product.images[0]} alt={item.product.name} />
                        <div className="itemDetails">
                            <h5>{item.product.name}</h5>
                            <p>Rs: {item.product.price}</p>
                            <p>Quantity: {item.quantity}</p>
                        </div>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => remove(item.id)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>
            <div className="cartActions">
                <Button startIcon={<ArrowBackSharpIcon />} onClick={() => navigate('/home')}>BACK</Button>
            </div>
        </>
    );
};

export default Cart;
