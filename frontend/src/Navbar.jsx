import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, cartItems, logout, user } = useAuth();

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
                {isAuthenticated ? (
                    <div><p style={{ color: "black" }}>Welcome  {user.email}
                        <button style={{ margin: "10px" }} onClick={logout}>Logout</button>
                        <IconButton onClick={() => navigate("/cart")}>
                            <ShoppingCartIcon fontSize="small" />
                            <CartBadge style={{ margin: "8px" }} badgeContent={cartItems.length} color="primary" overlap="circular" />
                        </IconButton>
                    </p>
                    </div>
                ) :
                    <div>
                        <button style={{ margin: "10px" }} onClick={() => navigate("/login")}>Login</button>
                        <button style={{ margin: "10px" }} onClick={() => navigate("/register")}>Register</button>
                    </div>
                }

            </div>
        </span>
    );
};

export default Navbar;
