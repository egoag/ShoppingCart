var swaggerJSDoc = require('swagger-jsdoc')

var swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'VR Shopping Cart',
      version: '0.1.0'
    },
    tags: [{
      name: 'user'
    }, {
      name: 'product'
    }, {
      name: 'shopping cart'
    }],
    openapi: '3.0.1',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js']
})

module.exports = swaggerSpec
