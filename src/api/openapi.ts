export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Product Backend Service API',
    version: '1.0.0',
    description: 'Product domain microservice for managing products, categories, stock, and pricing.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development'
    }
  ],
  tags: [
    { name: 'System', description: 'Service status endpoints' },
    { name: 'Products', description: 'Product management endpoints' }
  ],
  paths: {
    '/': {
      get: {
        tags: ['System'],
        summary: 'Get service information',
        responses: {
          '200': {
            description: 'Service metadata',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    service: { type: 'string', example: 'product-backend-service' },
                    status: { type: 'string', example: 'ok' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Liveness probe',
        responses: {
          '200': { description: 'Service is alive' }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        parameters: [
          {
            name: 'channel_id',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Optional channel ID to fetch channel-specific prices'
          }
        ],
        responses: {
          '200': { description: 'List of products' }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  category_id: { type: 'integer' },
                  stock_quantity: { type: 'integer' },
                  images: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Product created' }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': { description: 'Product details' },
          '404': { description: 'Product not found' }
        }
      }
    },
    '/api/products/reduce-stock': {
      post: {
        tags: ['Products'],
        summary: 'Reduce product stock',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['product_id', 'quantity'],
                properties: {
                  product_id: { type: 'integer' },
                  quantity: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Stock reduced' },
          '400': { description: 'Insufficient stock or invalid input' }
        }
      }
    },
    '/api/products/{id}/stock': {
      get: {
        tags: ['Products'],
        summary: 'Get product stock level',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': { description: 'Stock level' }
        }
      }
    }
  }
} as const;
