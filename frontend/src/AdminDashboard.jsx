import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from './api';
import "./Dashboard.css";

const CustomYAxisTick = ({ y, payload }) => {
    const value = payload.value;
    const truncatedValue = value.split(' ').slice(0, 5).join(' ') + (value.split(' ').length > 5 ? '...' : '');

    return (
        <g transform={`translate(0, ${y})`}>
            <text x={0} y={0} dy={-4} textAnchor="start" fill="#666" fontSize={10}>
                {truncatedValue}
            </text>
        </g>
    );
};

const generateColor = (index, total) => {
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 70%, 50%)`;
};

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        totalValue: 0
    });

    useEffect(() => {
        api.get("/products").then((res) => {
            const data = res.data;
            setProducts(data);

            const totalProducts = data.length;
            const lowStock = data.filter((p) => p.stock < 5).length;
            const totalValue = data.reduce((sum, p) => sum + p.price * p.stock, 0);
            setStats({ totalProducts, lowStock, totalValue });
        });
    }, []);

    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title">Admin Dashboard</h1>

            <div className="stats-grid">
                <div className="card card-blue">
                    <h2>Total Products</h2>
                    <p>{stats.totalProducts}</p>
                </div>
                <div className="card card-red">
                    <h2>Low Stock Items</h2>
                    <p>{stats.lowStock}</p>
                </div>
                <div className="card card-purple">
                    <h2>Inventory Value</h2>
                    <p>₹{stats.totalValue.toLocaleString()}</p>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-box">
                    <h3>Stock per Product</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={products} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} tick={<CustomYAxisTick />} interval={0} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="stock" fill="#0088FE" name="Stock" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box">
                    <h3>Stock Distribution</h3>
                    <div className="pie-container">
                        <ResponsiveContainer width="99%" height="100%">
                            <PieChart>
                                <Pie data={products} dataKey="stock" nameKey="name" cx="50%" cy="50%" outerRadius={100}>

                                    {products.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={generateColor(index, products.length)} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="legend-grid">
                        {products.map((p, index) => (
                            <div key={p.name} className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: generateColor(index, products.length) }}></div>                                <span>{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;