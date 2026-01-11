# 🚀 Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Backend Setup (3 minutes)

```bash
cd backend
npm install
cp .env.example .env
```

**Edit `.env` with your credentials** (see [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)):
- `MONGODB_URI` from MongoDB Atlas
- `RESEND_API_KEY` from Resend

```bash
npm run dev
```

✅ Backend running on http://localhost:3000

### Step 2: Frontend Setup (2 minutes)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

✅ Frontend running on http://localhost:5173

---

## 🧪 Test It in 5 Minutes

1. **Go to http://localhost:5173**
2. **Register** with your email
3. **Add 2-3 items** to cart
4. **Click "Proceed to Checkout"**
5. **Close the browser/tab**
6. **Wait 5 minutes** ⏱️
7. **Check your email** for abandoned cart notification
8. **Click the link** in email to recover cart

---

## 📚 Full Documentation

- [Setup Guide](./docs/SETUP_GUIDE.md) - Detailed installation & configuration
- [API Documentation](./docs/API_DOCUMENTATION.md) - All endpoints explained
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Deploy to production for free
- [Main README](./README.md) - Project overview

---

## 🎯 Key Files

```
abandoned-cart-service/
├── frontend/                 # React + TypeScript e-commerce app
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API integration
│   │   └── hooks/           # Custom hooks
│   └── package.json         # Dependencies
│
├── backend/                  # Node.js + Express server
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Email & cron jobs
│   │   ├── middleware/      # Auth & errors
│   │   └── server.ts        # Main server file
│   └── package.json         # Dependencies
│
└── docs/                     # Documentation
    ├── SETUP_GUIDE.md       # Installation guide
    ├── API_DOCUMENTATION.md # API reference
    └── DEPLOYMENT_GUIDE.md  # Production deployment
```

---

## 🔧 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (fast build)
- Tailwind CSS (styling)

**Backend:**
- Node.js + Express
- MongoDB (Atlas free tier)
- Resend (email service)
- Node-Cron (job scheduling)

**Services (Free Tier):**
- MongoDB Atlas (512MB storage)
- Resend (100 emails/day)
- Vercel (frontend hosting)
- Render (backend hosting)

---

## 📊 What Gets Sent in Email

When a user abandons their cart:

```
Subject: 🛒 You left items in your cart! Complete your order now

Email Content:
- Items they added with prices
- Total cart value
- ONE-CLICK recovery link
- Beautiful HTML template
```

The email includes a unique recovery link that:
- Pre-fills their exact cart items
- Shows total price
- Allows them to complete purchase with one click

---

## ✨ Features

- ✅ Product browsing
- ✅ Shopping cart with localStorage backup
- ✅ Email notifications (Resend)
- ✅ Cron job monitoring (1 minute checks)
- ✅ Cart recovery via email link
- ✅ User authentication (JWT)
- ✅ MongoDB persistence
- ✅ Beautiful UI with Tailwind CSS
- ✅ TypeScript throughout

---

## 🚀 Next Steps

1. **Customize Email Template**: Edit `backend/src/services/emailService.ts`
2. **Add More Products**: Edit `backend/src/routes/products.ts`
3. **Change Abandon Time**: Edit `CART_ABANDON_TIME_MINUTES` in `.env`
4. **Deploy to Production**: Follow [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)
5. **Add Discount Codes**: Include in email template
6. **Setup Analytics**: Track recovery rates

---

## 🐛 Troubleshooting

### Backend not starting?
- Check MongoDB URI is correct
- Check Resend API key is valid
- Make sure port 3000 is free

### Emails not arriving?
- Check spam/promotions folder
- Verify email in Resend dashboard
- Check backend logs for errors

### CORS errors?
- Verify `FRONTEND_URL` in backend `.env`
- Restart backend server

See [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md#-common-issues--solutions) for more solutions.

---

## 📞 Support

1. Check the documentation first
2. Look at backend console logs
3. Check MongoDB Atlas dashboard
4. Check Resend email logs
5. Create an issue on GitHub

---

## 📝 License

MIT - Feel free to use for your portfolio

---

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Tutorial](https://docs.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Resend Email API](https://resend.com/docs)

---

**Happy coding! Build, learn, and deploy with confidence! 🚀**
