const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/error.middleware');

app.use(cors({
  origin: ['http://localhost:5173', 'https://referral-program2.netlify.app'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Referral Program API',
      version: '1.0.0',
      description: 'API documentation for referral program backend',
    },
    servers: [
      { url: 'http://localhost:3000/api' },
      { url: 'https://referral-program-6vlb.onrender.com/api' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { 
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
 apis: ['./src/routes/user.routes.js'],

};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;