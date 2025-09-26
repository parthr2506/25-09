import { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = async () => {
        try {
            const res = await api.get('/cart');
            setCartItems(res.data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setCartItems([]);
        }
    };

    const login = async (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
        await fetchCartItems();
        if (userData?.role === "SELLER") {
            navigate("/admin", { replace: true });
        } else {
            navigate("/home", { replace: true });
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setCartItems([]);
    };

    const updateCart = async () => {
        await fetchCartItems();
    };

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setCartItems([]);
                setIsLoading(false);
                return;
            }

            try {
                const res = await api.get('/auth');
                setIsAuthenticated(true);
                setUser(res.data.user);
                await fetchCartItems(); // Fetch cart only after successful auth
            } catch (error) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setCartItems([]);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => {
            if (isAuthenticated) {
                logout();
                navigate('/login', { replace: true });
            }
        };
        window.addEventListener('unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('unauthorized', handleUnauthorized);
        };
    }, [isAuthenticated, navigate, logout]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, cartItems, updateCart, user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
