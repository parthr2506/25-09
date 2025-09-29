import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const { cartItems, logout } = useAuth();

    const CartBadge = styled(Badge)`
      & .${badgeClasses.badge} {
        top: -12px;
        right: -6px;
      }
    `;

    return (
        <span className="navContainer">
            <span className='logo'>Stop & Shop</span>
            <div>
                <button onClick={logout}>Logout</button>
                <IconButton onClick={() => navigate("/cart")}>
                    <ShoppingCartIcon fontSize="small" />
                    <CartBadge badgeContent={cartItems.length} color="primary" overlap="circular" />
                </IconButton>
            </div>
        </span>
    );
};

export default Navbar;
