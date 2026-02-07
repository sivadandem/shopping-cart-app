
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');


const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();

connectDB();


app.use(cors({
    origin: 'http://localhost:5173',  // Vite default port
    credentials: true
}));

app.use(express.json());


app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/carts', cartRoutes);
app.use('/orders', orderRoutes);


app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🛒 Shopping Cart API is running!',
        endpoints: {
            users: '/users',
            items: '/items',
            carts: '/carts',
            orders: '/orders'
        }
    });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});


app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
    🚀 Server is running!
    📡 Port: ${PORT}
    🌐 URL: http://localhost:${PORT}
    📝 Environment: ${process.env.NODE_ENV || 'development'}
    `);
});