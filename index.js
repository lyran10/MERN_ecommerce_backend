require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/review');
const wishlistRoutes = require('./routes/wishList');

const app = express();
const __dirnameResolved = path.resolve();

// Connect to MongoDB
console.log(process.env.MONGO_URI);
connectDB();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security & middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://mern-ecommerce-frontend-15px.onrender.com"
];
app.use(helmet());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Serve uploads with CORS headers
app.use(
  '/uploads',
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirnameResolved, 'uploads'))
);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Serve static files from frontend build
app.use(express.static(path.join(__dirnameResolved, 'client1/dist')));

// Catch-all route: serve index.html for non-API routes (client-side routing)
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirnameResolved, 'client1/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
