import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'; // Import the new icon
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, cartItems, logout, user } = useAuth();
    const isAdmin = user?.role === "SELLER";

    const CartBadge = styled(Badge)`
      & .${badgeClasses.badge} {
        top: -12px;
        right: -6px;
      }
    `;

    return (
        <span className="navContainer">
            <span className='logo'>Stop & Shop</span>
            {/* <button className="nav-button" onClick={() => navigate("/admin/products")}>Products</button>
            <button className="nav-button" onClick={() => navigate("/admin/users")}>Users</button> */}
            <div>
                {isAuthenticated ? (
                    isAdmin ? (
                        <div className="nav-end-content">
                            <button className="nav-button" onClick={() => navigate("/admin/products")}>Products</button>
                            <button className="nav-button" onClick={() => navigate("/admin/users")}>Users</button>
                            <IconButton onClick={() => navigate("/admin")}>
                                <AddCircleOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={logout}>
                                <LogoutOutlinedIcon fontSize="small" />
                            </IconButton>
                        </div>
                    ) : (
                        <div className="nav-end-content">
                            <IconButton onClick={() => navigate("/profile")}>
                                <AccountCircleOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => navigate("/cart")}>
                                <ShoppingCartIcon fontSize="small" />
                                <CartBadge badgeContent={cartItems.length} color="primary" overlap="circular" />
                            </IconButton>
                            <IconButton onClick={logout}>
                                <LogoutOutlinedIcon fontSize="small" />
                            </IconButton>
                        </div>
                    )
                ) : (
                    <div className="nav-end-content">
                        <button className="nav-button" onClick={() => navigate("/login")}>Login</button>
                        <button className="nav-button" onClick={() => navigate("/register")}>Register</button>
                    </div>
                )}
            </div>
        </span>
    );
};

export default Navbar;
