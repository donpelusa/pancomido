// src/docs/routes/swaggerConfig.js

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'La Pan Comido API',
      version: '1.0.0',
      description: 'API para el backend de La Pan Comido',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Se incluyen los archivos de rutas y los esquemas para que swagger-jsdoc los procese
  apis: ['./src/routes/*.js', './src/docs/routes/swaggerSchemas.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
