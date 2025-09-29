import React from 'react';
import { useAuth } from './useAuth';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const role = localStorage.getItem("role");
    const { user } = useAuth();
    const isAdmin = user?.role === "SELLER";

    const menuItems = [
        { path: "/home", label: "Home" },
        { path: "/cart", label: "Cart" }
    ];

    const adminMenu = [
        { path: "/admin", label: "Dashboard" },
        // { path: "/admin/products", label: "Products" },
        // { path: "/admin/users", label: "Users" },
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
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {isOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                    {isAdmin && (
                        <>
                            <hr className="sidebar-divider" />
                            {isOpen && <h4 className="sidebar-title">Admin</h4>}
                            {adminMenu.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                >
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
