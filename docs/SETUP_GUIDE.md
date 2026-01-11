# 🛒 Abandoned Cart Service - Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Git account
- MongoDB Atlas account (free)
- Resend account (free)

---

## Step-by-Step Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/abandoned-cart-service
cd abandoned-cart-service
```

### 2️⃣ MongoDB Atlas Setup

#### Create Free MongoDB Cluster:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project
4. Click "Create" to build a database
5. Choose "M0 Free" tier
6. Select your region
7. Under "Authentication", create a database user:
   - Username: `admin`
   - Password: Generate a strong password and save it
8. Click "Choose a connection method"
9. Select "Drivers"
10. Copy the connection string (replace `<password>` with your password)

**Connection String Format:**
```
mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/abandoned-cart?retryWrites=true&w=majority
```

### 3️⃣ Resend Email Setup

1. Go to [Resend](https://resend.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the API key (starts with `re_`)

**Note:** Resend free tier gives you 100 emails/day. Perfect for testing!

### 4️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env` file with your credentials:**

```env
# MongoDB
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/abandoned-cart?retryWrites=true&w=majority

# Resend Email API
RESEND_API_KEY=re_your_api_key_here

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this

# URLs
FRONTEND_URL=http://localhost:5173

# Email
EMAIL_FROM=noreply@cartreminder.com

# Cron Settings
CART_ABANDON_TIME_MINUTES=5
CRON_CHECK_INTERVAL=* * * * *  # Every 1 minute
```

**Start backend:**

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🛒 Abandoned Cart Service - Backend
✅ Server running on port 3000
✅ Abandoned cart cron job initialized
```

### 5️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
```

**Edit `.env.local`:**

```env
VITE_API_URL=http://localhost:3000
```

**Start frontend:**

```bash
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

---

## 🧪 Testing the Flow

### Manual Testing (5 Minute Demo)

1. **Open Frontend**: Go to `http://localhost:5173`

2. **Register User**:
   - Click "Register / Login"
   - Enter your email address
   - Click "Register"

3. **Add Items to Cart**:
   - Click on any product
   - Click "Add to Cart"
   - Add 2-3 items

4. **Create Cart**:
   - Click "View Cart" button
   - Review items
   - Click "Proceed to Checkout"
   - You'll see: "Cart created! You will receive an email reminder..."

5. **Leave the App**:
   - Close the browser tab
   - Wait for 5 minutes

6. **Check Your Email**:
   - You should receive an email titled: "🛒 You left items in your cart! Complete your order now"
   - Click the "Recover My Cart" link in the email

7. **Verify Cart Recovery**:
   - You'll be redirected to the cart recovery page
   - All your items will be there with the total price
   - Click "Complete Purchase" to finish

---

## 🔍 Monitoring & Debugging

### Backend Console Logs

Watch the backend logs for:

```
🔄 Checking for abandoned carts (2024-01-11T10:00:00.000Z)
📊 Found 1 abandoned cart(s)
✅ Email sent to user@example.com
✅ Notification sent for cart [cartId] to user@example.com
```

### MongoDB Check

Connect to MongoDB to verify data:

1. Open MongoDB Atlas dashboard
2. Go to your cluster
3. Click "Browse Collections"
4. Check `users`, `carts`, and `notifications` collections

### API Testing with cURL

#### Test Backend Health:
```bash
curl http://localhost:3000/health
```

#### Register User:
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

#### Get Products:
```bash
curl http://localhost:3000/api/products
```

---

## 📊 Key Features to Test

- ✅ User registration
- ✅ Product browsing
- ✅ Cart creation and updates
- ✅ Email notifications
- ✅ Cart recovery via email link
- ✅ Cart completion
- ✅ Cron job monitoring

---

## 🚀 Next Steps

1. **Customize Email Template**: Edit [emailService.ts](../backend/src/services/emailService.ts)
2. **Add More Products**: Edit mock products in [products.ts](../backend/src/routes/products.ts)
3. **Modify Abandon Time**: Change `CART_ABANDON_TIME_MINUTES` in `.env`
4. **Add Discount Code**: Modify email template to include promotional codes
5. **Setup Database Backups**: Configure automated backups in MongoDB Atlas

---

## ⚠️ Common Issues & Solutions

### "MONGODB_URI is not defined"
- Make sure `.env` file is created and has the correct connection string
- Restart backend: `npm run dev`

### "Resend API key is not valid"
- Check that API key starts with `re_`
- Make sure you copied the complete key
- Restart backend

### "Emails not arriving"
- Check spam/promotions folder
- Verify email address is correct
- Check backend logs for errors
- Check Resend dashboard for failed emails

### "CORS error"
- Make sure `FRONTEND_URL` matches your frontend URL
- Check that backend is running on port 3000

---

## 📝 Environment Variables Checklist

- [ ] MONGODB_URI (from MongoDB Atlas)
- [ ] RESEND_API_KEY (from Resend)
- [ ] JWT_SECRET (any random string)
- [ ] FRONTEND_URL (http://localhost:5173)
- [ ] EMAIL_FROM (any email address)

---

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [Resend Email](https://resend.com/docs)
- [Node-Cron](https://github.com/kelektiv/node-cron)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🆘 Need Help?

1. Check the backend console for errors
2. Check MongoDB Atlas logs
3. Check Resend email delivery logs
4. Create an issue on GitHub
5. Check the [API Documentation](./API_DOCUMENTATION.md)

---

**Happy coding! 🚀**
