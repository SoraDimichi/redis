# Redis-Cached Proxy for DummyJSON Products API

A NestJS application that serves as a cached proxy for the DummyJSON Products API, using Redis for caching.

## Overview

This application proxies requests to the [DummyJSON Products API](https://dummyjson.com/docs/products) and caches the responses in Redis for improved performance. All GET requests are cached with a 5-minute TTL (Time To Live).

## Features

- Proxies all DummyJSON Products API endpoints
- Caches GET requests in Redis with 5-minute expiration
- Provides request validation using DTOs
- Handles errors gracefully
- Configurable via environment variables

## Prerequisites

- Node.js (v14 or later)
- Redis server

## Installation

### Standard Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd redis-cached-proxy
```

2. Install dependencies:

```bash
npm install
```

3. Make sure Redis is running on your system or configure the connection using environment variables.

4. Start the application:

```bash
npm run start
```

For development mode with hot-reload:

```bash
npm run start:dev
```

### Docker Installation

The application can be run using Docker and Docker Compose:

1. Clone the repository:

```bash
git clone <repository-url>
cd redis-cached-proxy
```

2. Build and start the containers:

```bash
docker-compose up -d
```

This will start both the application and Redis in containers. The application will be available at http://localhost:3000.

To stop the containers:

```bash
docker-compose down
```

To rebuild the application after making changes:

```bash
docker-compose up -d --build
```

## Environment Variables

The application can be configured using the following environment variables:

- `PORT`: The port on which the application will run (default: 3000)
- `REDIS_HOST`: Redis server hostname (default: localhost)
- `REDIS_PORT`: Redis server port (default: 6379)

## API Endpoints

The application exposes the following endpoints:

### Get all products

```
GET /products
```

Query parameters:
- `limit`: Number of items to return (default: 30)
- `skip`: Number of items to skip for pagination
- `select`: Comma-separated list of fields to include
- `sortBy`: Field to sort by
- `order`: Sort order ('asc' or 'desc')

### Get a single product

```
GET /products/:id
```

### Search products

```
GET /products/search
```

Query parameters:
- `q`: Search query (required)
- Other parameters as in "Get all products"

### Get all product categories

```
GET /products/categories
```

### Get products category list

```
GET /products/category-list
```

### Get products by category

```
GET /products/category/:category
```

Query parameters:
- Same as in "Get all products"

### Add a new product

```
POST /products/add
```

Body: Product data (title, description, price, etc.)

### Update a product

```
PUT /products/:id
```

Body: Product data to update

### Delete a product

```
DELETE /products/:id
```

## Caching Behavior

- All GET requests are cached in Redis with a 5-minute TTL
- Cache keys are generated based on the endpoint path and query parameters
- POST, PUT, and DELETE requests are not cached
- Each unique combination of endpoint and query parameters has its own cache entry

## Examples

### Get all products

```bash
curl http://localhost:3000/products
```

### Get a single product

```bash
curl http://localhost:3000/products/1
```

### Search products

```bash
curl http://localhost:3000/products/search?q=phone
```

### Get products with pagination and sorting

```bash
curl http://localhost:3000/products?limit=10&skip=10&sortBy=price&order=desc
```

### Add a new product

```bash
curl -X POST http://localhost:3000/products/add \
  -H "Content-Type: application/json" \
  -d '{"title":"New Product","description":"Description","price":100,"rating":4.5,"stock":10,"brand":"Brand","category":"Category","thumbnail":"thumbnail.jpg","images":["image1.jpg"]}'
```

## License

[MIT](LICENSE)
