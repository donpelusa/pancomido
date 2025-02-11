// src/server.js
const uploadRoute = require('./routes/uploadRoute.js');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/routes.js');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/routes/swaggerConfig.js');


const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de debug: muestra la URL y el método de cada petición
app.use((req, res, next) => {
    console.log(`DEBUG: Received ${req.method} request for ${req.originalUrl}`);
    next();
});

// Rutas de la API
app.use(routes);

// Endpoint para la documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware 404 para rutas no definidas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor.' });
});

// // Fragmento para debug
// app.use((req, res, next) => {
//     console.log(`Petición recibida: ${req.method} ${req.originalUrl}`);
//     next();
// });

module.exports = app;
