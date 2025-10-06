import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { Table, Space, Input, Button, Popconfirm, message, Tag } from "antd"
import { PlusOutlined, DeleteOutlined, MinusOutlined } from "@ant-design/icons"
import { useDebounce } from './useDebounce';

const AdminProducts = () => {
    const { Search } = Input;
    const { isAuthenticated, user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const debouncedSearchTerm = useDebounce(searchInput, 300);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const filtered = originalProducts.filter(product =>
                product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
            setProducts(filtered);
        } else {
            setProducts(originalProducts);
        }
    }, [debouncedSearchTerm, originalProducts]);
    const fetchProducts = async () => {
        try {
            const productsRes = await api.get('/products')
            setProducts(productsRes.data);
            setOriginalProducts(productsRes.data);
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
        // if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            await api.delete(`/products/${id}`);
            // alert('Product deleted!');
            setProducts(products.filter((p) => p.id !== id));
            messageApi.success("Product Deleted Successfully");
        } catch (err) {
            console.error('Failed to delete product:', err);
            // alert('Failed to delete product');
            messageApi.error("Cannot delete product error occured ");

        }
    }
    // };
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
    const columns = [
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            sorter: (a, b) => a.price - b.price,
            render: (price) => `Rs:${price.toFixed(2)}`
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            sorter: (a, b) => a.stock - b.stock,
            render: (stock) => (
                <Tag color={stock > 0 ? "green" : "red"}>
                    {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
                </ Tag >
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<PlusOutlined />} onClick={() => updateProduct(record.id, record.stock + 1)}></Button>
                    <Button icon={<MinusOutlined />} onClick={() => updateProduct(record.id, record.stock - 1)}></Button>
                    <Popconfirm
                        title="Delete the Product"
                        description="Are you sure you want to delete the product"
                        onConfirm={() => deleteProduct(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            )

        }

    ]
    return (
        <div className='admin-products-page'>
            {contextHolder}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <Search
                    placeholder="Search Here..."
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/admin/products/add")}>
                    Add New Product
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={products}
                // loading={loading}
                rowKey="id"
                bordered
                className="admin-products-table"
            />

        </div>
    )
}

export default AdminProducts
