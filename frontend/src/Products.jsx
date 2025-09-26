import React, { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import api from './api';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const Products = () => {
    const { isAuthenticated, logout, updateCart } = useAuth();
    const [products, setProducts] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                setProducts(res.data);

            } catch (error) {
                console.log("Products not found")

            }
        }
        fetchProducts();

    }, [])

    const addToCart = async (productId) => {
        if (!isAuthenticated) {
            navigate("/login")
            return
        }
        try {
            await api.post("/cart/add", { productId, qty: 1 })
            alert("added to cart")
            await updateCart()

        } catch (error) {
            console.log("Cannot add to cart")
            alert("cannot add try again")

        }
    }
    return (
        <>
            <h2>Products</h2>
            <div className='productsWrapper'>
                {products.map(p => (
                    <ProductCard className="card"
                        key={p.id}
                        p={p}
                        onAdd={addToCart}
                    />

                ))}

            </div>
        </>
    )
}

export default Products
