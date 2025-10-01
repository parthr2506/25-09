require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cart', cartRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Listening on Port', PORT));