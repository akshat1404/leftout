# 🎬 Complete Project Walkthrough

## What You're Building

An **Abandoned Cart Notification Service** that:
1. Lets users browse products & add items to cart
2. Monitors when users leave without purchasing
3. Automatically sends them reminder emails after 5 minutes
4. Includes a link in the email to recover their cart
5. Tracks all notifications & cart recovery

---

## 📱 User Journey

```
START
  ↓
  └─→ [User lands on frontend]
      ├─ See product listing
      ├─ Register/Login with email
      ├─ Add items to cart
      └─→ [Goes to checkout]
         ├ Reviews items
         ├ Clicks "Proceed to Checkout"
         └─→ [Cart created & saved in DB]
            ├ User closes browser/tab
            │  (or just doesn't come back)
            │
            │ ⏳ 5 MINUTES PASS...
            │
            ├─→ [Backend Cron Job runs]
            │  ├ Checks for abandoned carts
            │  ├ Finds this cart (5+ min inactive)
            │  └─→ [Send Email]
            │     ├ Beautiful HTML template
            │     ├ Cart items listed
            │     ├ Total price shown
            │     └─ ONE-CLICK recovery link
            │
            └─→ [User checks email]
               ├ Opens email
               ├ Sees items & total
               ├ Clicks "Recover My Cart"
               └─→ [Lands on recovery page]
                  ├ All items are there!
                  ├ Cart value displayed
                  └─ Click "Complete Purchase"
                     └─→ SALE COMPLETED! 🎉

END
```

---

## 🛠️ Technical Architecture

### Frontend (React)
```
App.tsx
├── Navigation (header with cart count)
├── Home Page
│   ├── Registration Form
│   ├── Product Grid
│   │   └── ProductCard (each product)
│   └── "View Cart" Button
├── Cart Page
│   ├── Cart Items List
│   │   └── CartItemComponent (edit quantity/remove)
│   ├── Total Price
│   └── "Proceed to Checkout" Button
└── Recovery Page (from email link)
    ├── Display Cart Items
    └── "Complete Purchase" Button
```

**State Management:**
- Cart items stored in `useCart` custom hook
- Persisted to localStorage
- Token stored in localStorage

**API Calls via Axios:**
- Register user → Backend
- Get products → Backend
- Create cart → Backend
- Update cart → Backend
- Get cart by link → Backend

### Backend (Node.js + Express)
```
server.ts (Main entry point)
├── Middleware
│   ├── CORS (allow frontend requests)
│   ├── JSON parser
│   ├── Auth middleware (JWT)
│   └── Error handler
├── Routes
│   ├── /api/users
│   │   ├── POST /register (create user & token)
│   │   ├── POST /login (return token)
│   │   └── GET /me (get current user)
│   ├── /api/products
│   │   ├── GET / (list all products)
│   │   └── GET /:id (get one product)
│   ├── /api/carts
│   │   ├── POST / (create cart)
│   │   ├── GET / (user's carts)
│   │   ├── GET /:id (get specific cart)
│   │   ├── GET /link/:link (for recovery)
│   │   ├── PUT /:id (update items)
│   │   ├── PUT /:id/complete (mark purchased)
│   │   └── DELETE /:id (remove cart)
│   └── /api/notifications
│       ├── GET /history (user's notifications)
│       └── GET /stats/overall (admin stats)
├── Models (Mongoose)
│   ├── User (email, phone, dates)
│   ├── Cart (userId, items, prices, status)
│   └── Notification (log of emails sent)
├── Services
│   ├── emailService.ts (Resend integration)
│   │   └─ Sends beautiful HTML emails
│   └── cronService.ts (Node-cron)
│       └─ Runs every minute checking for abandoned carts
└── Database
    └── MongoDB Atlas connection
```

### Data Flow Diagram

```
┌──────────────┐
│   Frontend   │ (React + TypeScript)
│   (Browser)  │
└──────┬───────┘
       │ HTTP Requests (Axios)
       │ JSON payloads
       │
┌──────▼───────────────┐
│   Backend Server     │ (Node.js + Express)
│   (API)              │ Port: 3000
├──────┬───────────────┤
│      │ Models        │
│      │ Routes        │
│      │ Services      │
│      │ Middleware    │
└──────┬───────────────┘
       │ Database Queries (Mongoose)
       │ MongoDB Protocol
       │
┌──────▼──────────────┐    ┌──────────────┐
│  MongoDB Atlas      │◄──►│   Resend     │
│  (Database)         │    │ (Email API)  │
│  - Users            │    └──────────────┘
│  - Carts            │
│  - Notifications    │
└─────────────────────┘

┌──────────────────────┐
│   Node-Cron          │ (Runs in backend)
│   Every 1 minute     │ Checks for abandoned
│   ────────────────── │ carts & sends emails
└──────────────────────┘
```

---

## 🔄 Key Processes

### 1️⃣ Registration Process
```
User enters email → Frontend validation → POST /api/users/register
                                              ↓
                                     Check if user exists
                                              ↓
                                     If not, create user in MongoDB
                                              ↓
                                     Generate JWT token
                                              ↓
                                     Return token to frontend
                                              ↓
                                     Frontend stores token in localStorage
```

### 2️⃣ Cart Creation
```
User adds items → Items stored in React state (useCart hook)
                           ↓
                  Click "Proceed to Checkout"
                           ↓
                  POST /api/carts with items[]
                           ↓
                  Backend validates & creates Cart document
                           ↓
                  MongoDB saves with:
                  - userId reference
                  - items array
                  - totalPrice calculated
                  - createdAt timestamp
                  - lastUpdated timestamp
                  - cartLink (UUID for recovery)
                  - notificationSent: false
                           ↓
                  Return cart object to frontend
                           ↓
                  Frontend shows success message
```

### 3️⃣ Cron Job Monitoring (Automatic!)
```
Every 1 minute, the cron job runs:

1. Query MongoDB for abandoned carts:
   {
     status: { $ne: 'completed' },      // Not purchased
     lastUpdated: { $lt: 5_min_ago },   // Haven't been updated in 5+ min
     notificationSent: false             // Email not sent yet
   }

2. For each abandoned cart found:
   - Get user details from Users collection
   - Format beautiful email with items & prices
   - Send via Resend API
   - Update cart: notificationSent = true
   - Create Notification log entry
   - Log success/failure in console

3. Log results to console for debugging
```

### 4️⃣ Email Sending
```
Backend calls emailService.sendAbandonedCartEmail()
                           ↓
                  Create HTML email template:
                  ├─ Header with greeting
                  ├─ Items table (name, price, qty, subtotal)
                  ├─ Total price highlighted
                  ├─ Recovery link button
                  ├─ Backup text link
                  └─ Footer with branding
                           ↓
                  Call Resend API with HTML content
                           ↓
                  Resend sends email via SMTP
                           ↓
                  Email arrives in user's inbox (Resend is trusted sender)
                           ↓
                  User sees notification!
```

### 5️⃣ Cart Recovery
```
User clicks email link → Frontend loads:
                         GET /api/carts/link/:cartLink
                                    ↓
                         Backend finds cart by cartLink
                                    ↓
                         Returns cart with items
                                    ↓
                         Frontend displays recovery page
                         ├─ All items still there
                         ├─ Quantities preserved
                         ├─ Prices unchanged
                         └─ Total calculated
                                    ↓
                         User reviews & clicks "Complete Purchase"
                                    ↓
                         PUT /api/carts/:id/complete
                                    ↓
                         Backend updates status: 'completed'
                                    ↓
                         Frontend shows success!
```

---

## 📊 Database Documents Example

### User Document (MongoDB)
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "email": "user@example.com",
  "phone": "+1234567890",
  "createdAt": "2024-01-11T10:00:00.000Z",
  "lastLogin": "2024-01-11T10:05:00.000Z"
}
```

### Cart Document (MongoDB)
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k2"),
  "userId": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "items": [
    {
      "productId": "1",
      "productName": "Laptop",
      "price": 999,
      "quantity": 1,
      "image": "https://..."
    },
    {
      "productId": "2",
      "productName": "Mouse",
      "price": 29,
      "quantity": 2,
      "image": "https://..."
    }
  ],
  "totalPrice": 1057,
  "status": "active",
  "createdAt": "2024-01-11T10:00:00.000Z",
  "lastUpdated": "2024-01-11T10:03:00.000Z",
  "notificationSent": false,
  "cartLink": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Notification Document (MongoDB)
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k3"),
  "cartId": ObjectId("65a1b2c3d4e5f6g7h8i9j0k2"),
  "userId": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "email": "user@example.com",
  "status": "sent",
  "createdAt": "2024-01-11T10:08:30.000Z"
}
```

---

## 🌐 Frontend Pages

### Page 1: Home (Product Listing)
```
┌─────────────────────────────────────┐
│ Navigation: CartReminder Logo | Cart│
├─────────────────────────────────────┤
│                                     │
│  Welcome! Register to get alerts    │
│  [Email input] [Register button]    │
│                                     │
│  Our Products                       │
│  ─────────────────────────────────  │
│                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────┐
│  │ Product1 │ │ Product2 │ │ ...  │
│  │ $999     │ │ $29      │ │      │
│  │[Add Cart]│ │[Add Cart]│ │      │
│  └──────────┘ └──────────┘ └──────┘
│                                     │
│  [View Cart (3)] ← Sticky button   │
└─────────────────────────────────────┘
```

### Page 2: Shopping Cart
```
┌─────────────────────────────────────┐
│ Navigation: CartReminder | Cart     │
├─────────────────────────────────────┤
│                                     │
│  Shopping Cart                      │
│  ─────────────────────────────────  │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Item 1: Laptop               │   │
│  │ [−] 1 [+]   $999.00   Remove │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Item 2: Mouse (x2)           │   │
│  │ [−] 2 [+]   $58.00    Remove │   │
│  └──────────────────────────────┘   │
│                                     │
│  ─────────────────────────────────  │
│  Subtotal:           $1,057.00      │
│  ─────────────────────────────────  │
│  Total:              $1,057.00      │
│                                     │
│  [Continue Shopping] [Checkout]     │
│                                     │
│  💡 Close this tab - we'll remind   │
│     you in 5 minutes!               │
└─────────────────────────────────────┘
```

### Page 3: Cart Recovery (from Email)
```
┌─────────────────────────────────────┐
│ Navigation: CartReminder | Cart     │
├─────────────────────────────────────┤
│                                     │
│  🎉 Welcome Back!                   │
│  Here are your items...             │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Items from your cart:        │   │
│  │                              │   │
│  │ Laptop (x1)      $999.00     │   │
│  │ Mouse (x2)       $58.00      │   │
│  │                              │   │
│  │ Total:          $1,057.00     │   │
│  └──────────────────────────────┘   │
│                                     │
│  [Continue Shopping] [Complete]    │
│                                     │
└─────────────────────────────────────┘
```

---

## 📧 Email Template

```
╔════════════════════════════════════════════════════════════╗
║                    🛒 Cart Reminder!                       ║
║                                                            ║
║  Hi there!                                                 ║
║                                                            ║
║  We noticed you left some great items in your shopping     ║
║  cart. Here's what you were interested in:                 ║
║                                                            ║
║  ┌───────────────────────────────────────────────────────┐ ║
║  │ Product            Price      Qty    Subtotal         │ ║
║  ├───────────────────────────────────────────────────────┤ ║
║  │ Laptop             $999.00    1      $999.00          │ ║
║  │ Wireless Mouse     $29.00     2      $58.00           │ ║
║  │ USB-C Cable        $15.00     1      $15.00           │ ║
║  └───────────────────────────────────────────────────────┘ ║
║                                                            ║
║  Total: $1,072.00                                          ║
║                                                            ║
║  Don't miss out! Click below to complete your purchase:   ║
║                                                            ║
║          ╔══════════════════════════════╗                ║
║          ║  🛒 Recover My Cart          ║                ║
║          ║ (Click to continue shopping) ║                ║
║          ╚══════════════════════════════╝                ║
║                                                            ║
║  Or copy this link if the button doesn't work:            ║
║  https://yourapp.vercel.app/recover/550e8400-e29b...     ║
║                                                            ║
║  Your cart will be saved for 30 days.                      ║
║                                                            ║
║              © CartReminder Service                        ║
╚════════════════════════════════════════════════════════════╝
```

---

## ⚙️ Cron Job Logic

```
┌──────────────────────────────────────────────────────────┐
│              Every 1 Minute...                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 1. Query MongoDB:                                        │
│    db.carts.find({                                       │
│      status: {$ne: 'completed'},                         │
│      lastUpdated: {$lt: 5 minutes ago},                 │
│      notificationSent: false                            │
│    })                                                    │
│                                                          │
│ 2. For each cart found:                                 │
│    ├─ Get user email                                    │
│    ├─ Build HTML email with items                       │
│    ├─ Send via Resend API                              │
│    ├─ Update: notificationSent = true                  │
│    ├─ Log to database                                   │
│    └─ Log to console                                    │
│                                                          │
│ 3. Console Output:                                      │
│    ├─ Start: "🔄 Checking for abandoned carts"          │
│    ├─ Result: "📊 Found X abandoned cart(s)"            │
│    ├─ Sending: "✅ Email sent to user@example.com"      │
│    └─ Success: "✅ Notification logged"                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
Step 1: User Registration
┌──────────────┐         ┌──────────────┐      ┌──────────────┐
│   Frontend   │ ────→   │   Backend    │ ──→  │   MongoDB    │
│ (email)      │ POST    │ /api/users/  │      │  Users coll. │
└──────────────┘         │ register     │      └──────────────┘
                         └──────────────┘
                              │
                              ↓
                         Generate JWT:
                         Header.Payload.Signature
                              │
                              ↓
                         └────────────────────┐
                                              ↓
Step 2: Store Token          ┌──────────────────────────┐
                             │  Frontend localStorage    │
                             │  {                        │
                             │    token: "eyJ..."       │
                             │    user: {...}           │
                             │  }                        │
                             └──────────────────────────┘

Step 3: Use Token in Requests
┌──────────────┐
│   Frontend   │
│ GET /carts   │
│ Headers: {   │
│   Authorization: Bearer eyJ...
│ }            │
└──────┬───────┘
       │
       ↓
┌──────────────────┐
│   Backend Auth   │
│   Middleware     │
├──────────────────┤
│ Verify JWT:      │
│ - Check signature│
│ - Check expiry   │
│ - Extract userId │
└────┬─────────────┘
     │
     ├─ Valid? → Continue to route handler
     └─ Invalid? → Return 401 Unauthorized
```

---

## 🎯 Summary

**The flow is:**

1. **User registers** with email → Gets JWT token
2. **User browses products** → Sees product list
3. **User adds items** → Items stored locally
4. **User checks out** → Cart created in MongoDB
5. **User leaves** → Closes browser
6. **Cron job runs** → Detects abandoned cart
7. **Email sent** → Beautiful HTML email
8. **User clicks link** → Cart recovered
9. **User completes purchase** → Status updated
10. **Analytics logged** → Notification recorded

---

**Now you understand the complete system! Ready to build? 🚀**
