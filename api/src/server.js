// api/src/server.js



const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/routes.js');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/routes/swaggerConfig.js');

const app = express();

const allowedOrigins = [
    'https://pancomido-donpelusas-projects.vercel.app',
    'https://pancomido-git-main-donpelusas-projects.vercel.app',
    'https://pancomido-seven.vercel.app'
];

// Middlewares
app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (por ejemplo, herramientas o requests desde curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS: Origen no autorizado'));
        }
    }
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Middleware de debug: muestra la URL y el método de cada petición
// app.use((req, res, next) => {
//     console.log(`Petición: ${req.method} ${req.originalUrl}`);
//     next();
// });

// Rutas de la API
app.use('/api', routes);

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
