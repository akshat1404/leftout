# 🛒 Abandoned Cart Service - API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Endpoints

### Users API

#### Register/Login User

**Endpoint:** `POST /api/users/register`

**Description:** Register a new user or login if user exists

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "+1234567890"  // optional
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "phone": "+1234567890",
    "createdAt": "2024-01-11T10:00:00.000Z"
  }
}
```

---

#### Login User

**Endpoint:** `POST /api/users/login`

**Description:** Login with existing email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "createdAt": "2024-01-11T10:00:00.000Z"
  }
}
```

---

#### Get Current User

**Endpoint:** `GET /api/users/me`

**Authentication:** Required ✅

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "phone": "+1234567890",
  "createdAt": "2024-01-11T10:00:00.000Z"
}
```

---

### Products API

#### Get All Products

**Endpoint:** `GET /api/products`

**Description:** Get list of all available products

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "name": "Laptop",
    "price": 999,
    "description": "High-performance laptop",
    "image": "https://via.placeholder.com/300x200?text=Laptop",
    "category": "Electronics",
    "stock": 10
  },
  {
    "id": "2",
    "name": "Wireless Mouse",
    "price": 29,
    "description": "Comfortable wireless mouse",
    "image": "https://via.placeholder.com/300x200?text=Mouse",
    "category": "Accessories",
    "stock": 50
  }
]
```

---

#### Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Laptop",
  "price": 999,
  "description": "High-performance laptop",
  "image": "https://via.placeholder.com/300x200?text=Laptop",
  "category": "Electronics",
  "stock": 10
}
```

---

### Carts API

#### Create Cart

**Endpoint:** `POST /api/carts`

**Authentication:** Required ✅

**Request Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "productName": "Laptop",
      "price": 999,
      "quantity": 1,
      "image": "https://via.placeholder.com/300x200?text=Laptop"
    },
    {
      "productId": "2",
      "productName": "Wireless Mouse",
      "price": 29,
      "quantity": 2,
      "image": "https://via.placeholder.com/300x200?text=Mouse"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "userId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "productId": "1",
      "productName": "Laptop",
      "price": 999,
      "quantity": 1,
      "image": "https://via.placeholder.com/300x200?text=Laptop"
    }
  ],
  "totalPrice": 1057,
  "status": "active",
  "createdAt": "2024-01-11T10:00:00.000Z",
  "cartLink": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### Get User's Carts

**Endpoint:** `GET /api/carts`

**Authentication:** Required ✅

**Response (200 OK):**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "507f1f77bcf86cd799439011",
    "items": [...],
    "totalPrice": 1057,
    "status": "active",
    "createdAt": "2024-01-11T10:00:00.000Z",
    "lastUpdated": "2024-01-11T10:05:00.000Z",
    "notificationSent": false,
    "cartLink": "550e8400-e29b-41d4-a716-446655440000"
  }
]
```

---

#### Get Cart by ID

**Endpoint:** `GET /api/carts/:cartId`

**Response (200 OK):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "userId": "507f1f77bcf86cd799439011",
  "items": [...],
  "totalPrice": 1057,
  "status": "active",
  "createdAt": "2024-01-11T10:00:00.000Z",
  "lastUpdated": "2024-01-11T10:05:00.000Z",
  "notificationSent": true,
  "notificationSentAt": "2024-01-11T10:05:30.000Z",
  "cartLink": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### Get Cart by Link (Recovery)

**Endpoint:** `GET /api/carts/link/:cartLink`

**Description:** Get cart by unique recovery link (used in email)

**Response (200 OK):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "userId": "507f1f77bcf86cd799439011",
  "items": [...],
  "totalPrice": 1057,
  "status": "active",
  "createdAt": "2024-01-11T10:00:00.000Z",
  "cartLink": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### Update Cart

**Endpoint:** `PUT /api/carts/:cartId`

**Authentication:** Required ✅

**Request Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "productName": "Laptop",
      "price": 999,
      "quantity": 2,
      "image": "https://via.placeholder.com/300x200?text=Laptop"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "userId": "507f1f77bcf86cd799439011",
  "items": [...],
  "totalPrice": 1998,
  "status": "active",
  "createdAt": "2024-01-11T10:00:00.000Z",
  "lastUpdated": "2024-01-11T10:10:00.000Z"
}
```

---

#### Complete Cart (Purchase)

**Endpoint:** `PUT /api/carts/:cartId/complete`

**Authentication:** Required ✅

**Description:** Mark cart as purchased/completed

**Response (200 OK):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "userId": "507f1f77bcf86cd799439011",
  "items": [...],
  "totalPrice": 1057,
  "status": "completed",
  "createdAt": "2024-01-11T10:00:00.000Z",
  "lastUpdated": "2024-01-11T10:15:00.000Z"
}
```

---

#### Delete Cart

**Endpoint:** `DELETE /api/carts/:cartId`

**Authentication:** Required ✅

**Response (200 OK):**
```json
{
  "message": "Cart deleted"
}
```

---

### Notifications API

#### Get Notification History

**Endpoint:** `GET /api/notifications/history`

**Authentication:** Required ✅

**Description:** Get user's notification history (last 50)

**Response (200 OK):**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "cartId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "user@example.com",
    "status": "sent",
    "sentAt": "2024-01-11T10:05:30.000Z"
  }
]
```

---

#### Get Overall Statistics

**Endpoint:** `GET /api/notifications/stats/overall`

**Description:** Get total emails sent and delivery statistics

**Response (200 OK):**
```json
{
  "totalSent": 42,
  "totalFailed": 2,
  "successRate": "95.45%"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate entry |
| 500 | Server Error - Internal error |

---

## Example Workflows

### Workflow 1: Complete Purchase Flow

1. **Register User**
   ```bash
   POST /api/users/register
   Body: { "email": "user@example.com" }
   ```

2. **Get Products**
   ```bash
   GET /api/products
   ```

3. **Create Cart**
   ```bash
   POST /api/carts
   Headers: Authorization: Bearer YOUR_TOKEN
   Body: { "items": [...] }
   ```

4. **Complete Purchase**
   ```bash
   PUT /api/carts/:cartId/complete
   Headers: Authorization: Bearer YOUR_TOKEN
   ```

### Workflow 2: Abandoned Cart Recovery

1. **User creates cart** (same as above)

2. **Wait 5+ minutes** (cron job detects abandonment)

3. **Email sent** with recovery link

4. **User clicks recovery link**
   ```bash
   GET /api/carts/link/:cartLink
   ```

5. **User completes purchase** from recovery page
   ```bash
   PUT /api/carts/:cartId/complete
   ```

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+1234567890"
  }'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Create Cart
```bash
curl -X POST http://localhost:3000/api/carts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "productId": "1",
        "productName": "Laptop",
        "price": 999,
        "quantity": 1,
        "image": "https://via.placeholder.com/300x200?text=Laptop"
      }
    ]
  }'
```

### Get User Carts
```bash
curl http://localhost:3000/api/carts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Rate Limiting

Currently, there is **no rate limiting** implemented. For production, consider adding:
- Express rate limit middleware
- IP-based limiting
- User-based limiting
- API key limits

---

## API Versioning

Current version: **v1** (URL: `/api/...`)

Future versions might use `/api/v2/...`

---

**For more information, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**
