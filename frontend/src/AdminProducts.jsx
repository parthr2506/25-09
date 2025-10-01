import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import api from './api';

const AdminProducts = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        try {
            const productsRes = await api.get('/products')
            setProducts(productsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }

    }
    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated || user?.role !== 'SELLER') {
                navigate('/unauthorized-page', { replace: true });
            } else {
                fetchProducts();
            }
        }
    }, [isAuthenticated, isLoading, user, navigate]);

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                alert('Product deleted!');
                setProducts(products.filter((p) => p.id !== id));
            } catch (err) {
                console.error('Failed to delete product:', err);
                alert('Failed to delete product');
            }
        }
    };
    const updateProduct = async (id, newStock) => {
        if (newStock < 0) return;
        try {
            await api.put(`/products/${id}/stock`, { stock: newStock })
            setProducts(products.map(p => (p.id == id ? { ...p, stock: newStock } : p)))
        } catch (error) {
            console.log("cannot update stock");
            alert("stock update failed")

        }

    }
    return (
        <div>
            <section>
                <h3> Manage Products</h3>
                {products.map(product => (
                    <div className='admin-products-list' key={product.id}>
                        <div>{product.name}</div>
                        <div> Rs:{product.price}</div>
                        <div>Qty:{product.stock}</div>
                        <button className='admin-products-btn' onClick={() => updateProduct(product.id, product.stock - 1)}>-</button>
                        <button className='admin-products-btn' onClick={() => updateProduct(product.id, product.stock + 1)}>+</button>
                        <button className='admin-products-btn' onClick={() => deleteProduct(product.id)}>Delete</button>
                    </div>
                ))}
            </section>

        </div>
    )
}

export default AdminProducts
