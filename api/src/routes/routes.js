// src/routes/routes.js

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const gatewaysRoutes = require('./gateways.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const addressRoutes = require('./address.routes');
const favoritesRoutes = require('./favorites.routes');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const productImagesRoutes = require('./productImages.routes');
const uploadRoute = require('./uploadRoute');
const categoriesRoutes = require('./categories.routes');
const locationRoutes = require('./location.routes');

router.use('/auth', authRoutes);
router.use('/gateways', gatewaysRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/address', addressRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/profile', userRoutes);
router.use('/admin', adminRoutes);
router.use('/product-images', productImagesRoutes);
router.use('/upload', uploadRoute);
router.use('/categories', categoriesRoutes);
router.use('/location', locationRoutes);

// Ruta de test global opcional:
router.get('/test', (req, res) => res.json({ message: 'Ruta de test global funcionando' }));

module.exports = router;
