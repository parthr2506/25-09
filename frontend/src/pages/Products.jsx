import { useEffect, useState } from 'react'
import { useAuth } from '../useAuth'
import api from '../api';
import { useDebounce } from '../useDebounce';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Products = () => {
    const { isAuthenticated, updateCart, isLoading, user } = useAuth();
    const [products, setProducts] = useState([])
    const [userWatchlist, setUserWatchlist] = useState([]);
    const [openWatchlistAlert, setOpenWatchlistAlert] = useState(false);

    const [isAdding, setIsAdding] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const location = useLocation()
    const navigate = useNavigate();

    const initialQuery = new URLSearchParams(location.search).get("query") || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    if (isLoading) {
        return <div>Loading products...</div>;
    }
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = debouncedSearchQuery
                    ? `/products?query=${encodeURIComponent(debouncedSearchQuery)}`
                    : '/products';
                const res = await api.get(url);
                setProducts(res.data);

            } catch (error) {
                console.log("Products not found")

            }
        }
        fetchProducts();

    }, [debouncedSearchQuery])

    useEffect(() => {
        const fetchUserWatchlist = async () => {
            if (!user?.id || isLoading) {
                setUserWatchlist([]);
                return;
            }
            try {
                const res = await api.get(`/watchlist/${user.id}`);
                setUserWatchlist(res.data.watchlist);
            } catch (error) {
                console.error("Error fetching user watchlist", error);
            }
        };
        fetchUserWatchlist();
    }, [user, isLoading]);
    useEffect(() => {
        const urlQuery = new URLSearchParams(location.search).get("query") || '';
        setSearchQuery(urlQuery);
    }, [location.search]);

    const addToCart = async (productId) => {
        if (!isAuthenticated) {
            navigate("/login")
            return
        }
        if (isAdding) {
            return;
        }
        setIsAdding(true)
        try {
            const res = await api.post("/cart/add", { productId, qty: 1 })
            const updatedProduct = res.data.updatedProduct
            setOpenAlert(true);

            setProducts(prevProducts =>
                prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
            )
            await updateCart()

        } catch (error) {
            console.log("Cannot add to cart")
            alert("cannot add try again")

        }
        finally {
            setTimeout(() => setIsAdding(false), 1000)
        }
    }

    const handleToggleWatchlist = async (productId, currentInWatchlist) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            if (currentInWatchlist) {
                await api.post("/watchlist/remove", {
                    userId: user.id,
                    productId
                });
                setUserWatchlist(prev => prev.filter(item => item.id !== productId));
            } else {
                await api.post("/watchlist/add", {
                    userId: user.id,
                    productId
                });
                const addedProduct = products.find(p => p.id === productId);
                setUserWatchlist(prev => [...prev, addedProduct]);

                setOpenWatchlistAlert(true);
            }
        } catch (error) {
            console.error("Error updating watchlist", error);
        }
    };
    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    const handleCloseWatchlistAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenWatchlistAlert(false);
    };

    return (
        <>
            <h2>Products</h2>
            <div className='productsWrapper'>
                {products.map(p => (
                    <ProductCard className="card"
                        key={p.id}
                        p={p}
                        onAdd={addToCart}
                        isAdding={isAdding}
                        inWatchlist={userWatchlist.some(item => item.id === p.id)}
                        onToggleWatchlist={handleToggleWatchlist}

                    />

                ))}
                <Snackbar open={openAlert} autoHideDuration={800} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <MuiAlert onClose={handleCloseAlert} elevation={6} variant="filled" >
                        Product Added To The Cart
                    </MuiAlert>
                </Snackbar>

                <Snackbar open={openWatchlistAlert} autoHideDuration={1000} onClose={handleCloseWatchlistAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <MuiAlert onClose={handleCloseWatchlistAlert} elevation={6} variant="standard"
                        sx={{
                            backgroundColor: 'purple',
                            color: 'white',
                        }} >
                        Product added to watchlist
                    </MuiAlert>
                </Snackbar>

            </div>
        </>
    )
}

export default Products
