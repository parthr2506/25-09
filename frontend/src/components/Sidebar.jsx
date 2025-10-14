import { useAuth } from '../useAuth';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faShoppingCart, faUsers, faCube, faGauge, faHeart } from '@fortawesome/free-solid-svg-icons';
import "./Sidebar.css"

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const { user } = useAuth();
    const isAdmin = user?.role === "SELLER";

    const menuItems = [
        { path: "/home", label: "Home", icon: faHome },
        { path: "/cart", label: "Cart", icon: faShoppingCart },
        { path: "/watchlist", label: "Watchlist", icon: faHeart }
    ];

    const adminMenuItems = [
        { path: "/admin", label: "Dashboard", icon: faGauge },
        { path: "/admin/users", label: "Manage Users", icon: faUsers },
        { path: "/admin/products", label: "Manage Products", icon: faCube },
    ];

    return (
        <div className="sidebar-wrapper">
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
                        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                    </button>
                    {isOpen && <h1 className="sidebar-logo">Menu</h1>}
                </div>
                <nav className="sidebar-nav">
                    {!isAdmin && menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <FontAwesomeIcon icon={item.icon} />
                            {isOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                    {isAdmin && (
                        <>
                            {/* <hr className="sidebar-divider" /> */}
                            {/* {isOpen && <h4 className="sidebar-title">Admin Menu</h4>} */}
                            {adminMenuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    <FontAwesomeIcon icon={item.icon} />
                                    {isOpen && <span>{item.label}</span>}
                                </Link>
                            ))}
                        </>
                    )}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
