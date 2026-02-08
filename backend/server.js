// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// Import routes
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Connect to Database
connectDB();

// Middleware - CORS for production
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://your-site-name.netlify.app"  // Replace with your actual Netlify URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// Routes
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);

// Root route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🛒 Shopping Cart API is running!",
        endpoints: {
            users: "/users",
            items: "/items",
            carts: "/carts",
            orders: "/orders"
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.stack);
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});