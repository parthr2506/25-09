import { useState } from 'react';
import api from '../api';
import { useAuth } from '../useAuth';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PayPalButton from './PayPalButton';

const Cart = () => {
    const { isLoading, cartItems, updateCart, user } = useAuth();
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate();

    const remove = async (id) => {
        try {
            await api.post('/cart/delete', { id });
            setOpenAlert(true);
            updateCart()
        } catch (error) {
            console.error("Error while removing the items:", error);
            alert("Error removing item try again");
        }
    };

    if (isLoading) {
        return <div>Loading cart...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div>
                <h2>Cart</h2>
                <p>Your cart is empty</p>
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
            <h3>Total Rs:{cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)}</h3>
            <div className='cartWrapper'>

                {cartItems.map(item => (
                    <div className="cartCard" key={item.id}>
                        <img src={item.product.images[0]} alt={item.product.name} />

                        <div className="itemDetails">
                            <h5>{item.product.name}</h5>
                            <p><strong>Rs: </strong>{item.product.price}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
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

            <PayPalButton
                clientId={import.meta.env.VITE_PAYPAL_CLIENT_ID}
                currency="USD"
                cartItems={cartItems}
                userId={user.id}
                onPaymentSuccess={updateCart}
            />
        </>
    );
};

export default Cart;