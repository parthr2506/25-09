import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    const login = async (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        await fetchCartItems();
        if (user?.role === "SELLER") {
            navigate("/admin", { replace: true });
        } else {
            navigate("/home", { replace: true });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setCartItems([]);
        navigate("/login", { replace: true });
    };
    const fetchCartItems = async () => {
        try {
            const res = await api.get('/cart');
            setCartItems(res.data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setCartItems([]);
        }
    };

    const updateCart = async () => {
        await fetchCartItems();
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (!token || !user) {
                setIsAuthenticated(false);
                setUser(null);
                setCartItems([]);
                setIsLoading(false);
                return;
            }

            try {
                const userObject = JSON.parse(user);
                setIsAuthenticated(true);
                setUser(userObject);
                await fetchCartItems();
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
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
