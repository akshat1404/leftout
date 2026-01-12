# 🛒 Abandoned Cart Notification Service

A complete E-commerce abandoned cart recovery system that sends email notifications to users who leave items in their cart without purchasing.

## 📋 Overview

This service monitors shopping carts and automatically sends email reminders after a user has been inactive for 5 minutes. Users can click the link in the email to return to their cart and complete the purchase.

**Perfect for:**
- Portfolio projects
- Learning full-stack development
- Understanding production-ready systems
- Building e-commerce features

---

## � Live Demo

**Check out the live demo:** https://eloquent-bonbon-9fe0da.netlify.app/

---

## �🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   Frontend (React + TypeScript)         │
│   - E-commerce product catalog          │
│   - Shopping cart UI                    │
│   - User registration                   │
└──────────────┬──────────────────────────┘
               │
        API Endpoints
               │
┌──────────────▼──────────────────────────┐
│   Backend (Express + Node.js)           │
│   - Cart management APIs                │
│   - User management                     │
│   - Cron job for monitoring             │
│   - Email service integration           │
└──────────────┬──────────────────────────┘
               │
     ┌─────────┴──────────┐
     │                    │
 ┌───▼────┐        ┌─────▼──────┐
 │MongoDB  │        │Email Service│
 │Atlas    │        │(Resend)    │
 └─────────┘        └────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- MongoDB Atlas account (free)
- Resend account (free tier)

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/abandoned-cart-service
cd abandoned-cart-service
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Add your backend URL to .env.local
npm run dev
```

#### 3. Backend Setup
```bash
cd ../backend
npm install
cp .env.example .env
# Add MongoDB URI and Resend API key
npm run dev
```

#### 4. Access Application
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (fast development)
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **node-cron** - Job scheduling
- **Resend** - Email service
- **Mongoose** - Database ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication

### Deployment
- **Frontend**: Vercel (free)
- **Backend**: Render/Railway (free)
- **Database**: MongoDB Atlas (free tier)

---

## 📦 Project Structure

```
abandoned-cart-service/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   └── Navigation.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── Register.tsx
│   │   │   └── RecoverCart.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── hooks/
│   │   │   └── useCart.ts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Cart.ts
│   │   │   └── Notification.ts
│   │   ├── routes/
│   │   │   ├── carts.ts
│   │   │   ├── users.ts
│   │   │   └── notifications.ts
│   │   ├── services/
│   │   │   ├── emailService.ts
│   │   │   ├── cartService.ts
│   │   │   └── cronService.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── config/
│   │   │   └── database.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── SETUP_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   └── DEPLOYMENT_GUIDE.md
│
└── README.md
```

---

## 📡 API Endpoints

### User Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Cart Endpoints
- `POST /api/carts` - Create/update cart
- `GET /api/carts/:cartId` - Get cart details
- `GET /api/users/:userId/carts` - Get user's carts
- `DELETE /api/carts/:cartId` - Delete cart
- `PUT /api/carts/:cartId/complete` - Mark cart as completed

### Notification Endpoints
- `GET /api/notifications/history` - Get notification history

---

## 🔧 Configuration

### Environment Variables (Backend)

Create `.env` file:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/abandoned-cart

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Server
PORT=3000
NODE_ENV=development

# JWT (for authentication)
JWT_SECRET=your_jwt_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cron Configuration
CART_ABANDON_TIME_MINUTES=5
CRON_CHECK_INTERVAL=1  # Check every 1 minute
```

### Environment Variables (Frontend)

Create `.env.local` file:
```env
VITE_API_URL=http://localhost:3000
```

---

## 🎯 How It Works

1. **User Browsing**: User adds products to cart
2. **Cart Storage**: Cart saved to MongoDB with timestamp
3. **User Leaves**: User closes browser or becomes inactive
4. **Monitoring**: Backend cron job runs every minute
5. **Detection**: Identifies carts inactive for 5+ minutes
6. **Notification**: Sends email via Resend with:
   - Items in cart
   - Total price
   - Unique recovery link
7. **Recovery**: User clicks link → returns to pre-filled cart
8. **Completion**: User can complete purchase

---

## 🧪 Testing the Flow

### Manual Testing
1. Add items to cart
2. Close the browser/tab
3. Wait 5 minutes
4. Check email for notification
5. Click link in email to recover cart

### Automated Testing
```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

---

## 📊 Monitoring & Analytics

Track:
- Total carts created
- Abandoned carts count
- Notification sent/delivered
- Recovery rate (carts recovered via email)
- Conversion rate (abandoned → completed)

---

## 🚀 Deployment

### Deploy Frontend on Vercel

```bash
cd frontend
npm run build
# Follow Vercel deployment steps
```

### Deploy Backend on Render

```bash
# Create render.yaml in backend root
# Push to GitHub
# Connect repository to Render
# Set environment variables
```

### MongoDB Atlas Setup
1. Create free cluster at atlas.mongodb.com
2. Get connection string
3. Add to `.env` file

---

## 💡 Future Enhancements

- [ ] SMS notifications (Twilio)
- [ ] WhatsApp notifications (Twilio)
- [ ] Push notifications (Firebase)
- [ ] Multiple reminders (1, 3, 7 days)
- [ ] Discount codes in emails
- [ ] Analytics dashboard
- [ ] Admin panel for managing campaigns
- [ ] A/B testing different email templates
- [ ] Integration with Shopify/WooCommerce

---

## 📚 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Tutorial](https://docs.mongodb.com/)
- [Node Cron](https://github.com/kelektiv/node-cron)
- [Resend Email](https://resend.com/docs)

---

## 🤝 Contributing

Feel free to fork and contribute improvements!

---

## 📝 License

MIT License - feel free to use this for your portfolio

---

## 👤 Author

Created as a portfolio project for demonstrating full-stack development skills.

---

## 📧 Support

For issues and questions, create an issue on GitHub.

---

**Happy coding! 🚀**
