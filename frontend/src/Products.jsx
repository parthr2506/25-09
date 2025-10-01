import React, { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import api from './api';
import { useDebounce } from './useDebounce';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Products = () => {
    const { isAuthenticated, logout, updateCart } = useAuth();
    const [products, setProducts] = useState([])
    const [isAdding, setIsAdding] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const location = useLocation()
    const navigate = useNavigate();

    const initialQuery = new URLSearchParams(location.search).get("query") || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
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
    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
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
                    />

                ))}

                <Snackbar open={openAlert} autoHideDuration={800} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <MuiAlert onClose={handleCloseAlert} elevation={6} variant="filled" >
                        Product Added To The Cart
                    </MuiAlert>
                </Snackbar>

            </div>
        </>
    )
}

export default Products
