import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingCart,
    faUserCircle,
    faSignOutAlt,
    faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState(
        new URLSearchParams(location.search).get("query") || ''
    );
    const { isAuthenticated, cartItems, logout, user } = useAuth();
    const isAdmin = user?.role === "SELLER";

    const CartBadge = styled(Badge)`
      & .${badgeClasses.badge} {
        top: -12px;
        right: -6px;
      }
    `;

    const handleChange = (e) => {
        const newSearchQuery = e.target.value;
        setSearchInput(newSearchQuery);
        if (newSearchQuery.trim()) {
            navigate(`/home?query=${encodeURIComponent(newSearchQuery)}`);
        } else {
            navigate('/home');
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/home?query=${encodeURIComponent(searchInput)}`);
        }
        else {
            navigate("/home")
        }
    }
    return (
        <span className="navContainer">
            <span className='logo'>Stop & Shop</span>
            <div className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-input"
                        value={searchInput}
                        onChange={handleChange}
                    />
                </form>
            </div>
            <div>
                {isAuthenticated ? (
                    isAdmin ? (
                        <div className="nav-end-content">
                            <button className="nav-button" onClick={() => navigate("/admin/products")}>Products</button>
                            <button className="nav-button" onClick={() => navigate("/admin/users")}>Users</button>
                            <IconButton onClick={() => navigate("/admin")}>
                                <FontAwesomeIcon icon={faPlusCircle} />
                            </IconButton>
                            <IconButton onClick={logout}>
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </IconButton>
                        </div>
                    ) : (
                        <div className="nav-end-content">
                            <IconButton onClick={() => navigate("/profile")}>
                                <FontAwesomeIcon icon={faUserCircle} />
                            </IconButton>
                            <IconButton onClick={() => navigate("/cart")}>
                                <FontAwesomeIcon icon={faShoppingCart} />
                                <CartBadge badgeContent={cartItems.length} color="primary" overlap="circular" />
                            </IconButton>
                            <IconButton onClick={logout}>
                                <FontAwesomeIcon icon={faSignOutAlt} />
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
