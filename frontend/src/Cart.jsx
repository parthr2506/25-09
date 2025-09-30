import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './useAuth';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Cart = () => {
    const { isLoading, cartItems, updateCart } = useAuth();
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate();

    const remove = async (id) => {
        try {
            await api.post('/cart/delete', { id });
            setOpenAlert(true);
            updateCart()
        } catch (error) {
            console.error("Error while removing the Items:", error);
            alert("Error removing item. Please try again.");
        }
    };

    if (isLoading) {
        return <div>Loading cart...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div>
                <h2>Cart</h2>
                <p>Your cart is empty.</p>
                <Button startIcon={<ArrowBackSharpIcon />} onClick={() => navigate('/home')}>BACK</Button>
            </div>
        );
    }
    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <>
            <h2>Cart</h2>
            <div className='cartWrapper'>
                {cartItems.map(item => (
                    <div className="cartCard" key={item.id}>
                        <img src={item.product.images[0]} alt={item.product.name} />
                        <div className="itemDetails">
                            <h5>{item.product.name}</h5>
                            <p>Rs: {item.product.price}</p>
                            <p>Quantity: {item.quantity}</p>
                        </div>
                        <Button
                            className='remove-btn'
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => remove(item.id)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Snackbar open={openAlert} autoHideDuration={800} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <MuiAlert onClose={handleCloseAlert} elevation={6} variant="filled" severity='error'>
                        Product Removed From Cart
                    </MuiAlert>
                </Snackbar>
            </div>
            <div className="cartActions">
                <Button startIcon={<ArrowBackSharpIcon />} onClick={() => navigate('/home')}>BACK</Button>
            </div>
        </>
    );
};

export default Cart;
