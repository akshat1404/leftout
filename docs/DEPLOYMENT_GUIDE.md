# 🚀 Abandoned Cart Service - Deployment Guide

## Overview

This guide covers deploying the Abandoned Cart Service to production using free/freemium services.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Vercel (Frontend)                     │
│            https://yourapp.vercel.app                   │
└──────────────────────────┬────────────────────────────┘
                           │
                    HTTPS Requests
                           │
┌──────────────────────────▼────────────────────────────┐
│                  Render (Backend)                      │
│            https://yourapp.onrender.com                │
│         Node.js Express Server                         │
│      Port: 10000 (Render's standard port)             │
└──────────────────────────┬────────────────────────────┘
                           │
                    Database Queries
                           │
┌──────────────────────────▼────────────────────────────┐
│               MongoDB Atlas (Database)                 │
│         Cloud-hosted MongoDB (free tier)              │
└─────────────────────────────────────────────────────┘
```

---

## Deployment Steps

### 1️⃣ Deploy Frontend on Vercel

#### Prerequisites:
- Frontend code pushed to GitHub
- Vercel account (free tier)

#### Steps:

1. **Go to [Vercel](https://vercel.com)** and sign in with GitHub

2. **Click "New Project"**

3. **Import Repository**:
   - Select your `abandoned-cart-service` repository
   - Select `frontend` as root directory (if asked)

4. **Configure Environment Variables**:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - You'll get a URL like `https://yourapp.vercel.app`

6. **Update Backend CORS**:
   - Update `FRONTEND_URL` in backend `.env`

---

### 2️⃣ Deploy Backend on Render

#### Prerequisites:
- Backend code pushed to GitHub
- Render account (free tier)
- MongoDB URI ready

#### Steps:

1. **Go to [Render](https://render.com)** and sign in with GitHub

2. **Create New Service**:
   - Click "New +" → "Web Service"
   - Select your repository

3. **Configure Service**:
   - **Name**: `abandoned-cart-service-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `/` (leave empty)

4. **Add Environment Variables**:
   - Click "Environment"
   - Add all variables from `.env`:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/abandoned-cart
   RESEND_API_KEY=re_your_api_key
   PORT=10000
   NODE_ENV=production
   JWT_SECRET=your_production_secret
   FRONTEND_URL=https://yourapp.vercel.app
   EMAIL_FROM=noreply@cartreminder.com
   CART_ABANDON_TIME_MINUTES=5
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - You'll get a URL like `https://yourapp.onrender.com`

6. **Keep Alive** (Optional - prevents cold starts):
   - Upgrade to paid plan, OR
   - Set up a cron job to ping `/health` every 14 minutes:
   ```bash
   curl https://yourapp.onrender.com/health
   ```

---

### 3️⃣ MongoDB Atlas Setup (Already Done)

If not done yet:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user (username, password)
4. Whitelist Render IP:
   - Go to "Network Access" → "Add IP Address"
   - Add `0.0.0.0/0` (allows all IPs - less secure but necessary for Render)

---

### 4️⃣ Resend Setup (Already Done)

If not done yet:

1. Go to [Resend](https://resend.com)
2. Create account and verify email
3. Get API key from dashboard
4. Add to backend environment variables

---

## Environment Variables for Production

### Frontend (.env.production)
```env
VITE_API_URL=https://yourapp.onrender.com
```

### Backend (.env for Render)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/abandoned-cart
RESEND_API_KEY=re_xxxxxxxxxxxxx
PORT=10000
NODE_ENV=production
JWT_SECRET=very_long_random_secret_change_this_value_in_production
FRONTEND_URL=https://yourapp.vercel.app
EMAIL_FROM=noreply@cartreminder.com
CART_ABANDON_TIME_MINUTES=5
CRON_CHECK_INTERVAL=* * * * *
```

---

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Environment variables set correctly
- [ ] MongoDB Atlas whitelist updated
- [ ] CORS configured on backend
- [ ] Email service working
- [ ] Cron job running
- [ ] Database backups enabled
- [ ] SSL/HTTPS enabled (automatic on both)
- [ ] Health check endpoint responding

---

## Testing Production Deployment

1. **Test Frontend**:
   ```bash
   curl https://yourapp.vercel.app/health
   ```

2. **Test Backend**:
   ```bash
   curl https://yourapp.onrender.com/health
   ```

3. **Test API Connection**:
   - Open frontend in browser
   - Register user
   - Add items to cart
   - Check backend logs in Render dashboard

4. **Test Email Notifications**:
   - Create cart
   - Wait 5+ minutes
   - Check email for notification

---

## Monitoring & Logs

### View Backend Logs on Render:

1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Scroll to see real-time logs

### View Frontend Logs on Vercel:

1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments"
4. Click deployment → "Logs"

### Monitor MongoDB:

1. Go to MongoDB Atlas
2. Click "Monitoring" tab
3. View metrics and queries

---

## Cost Breakdown (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel Frontend | Unlimited deployments | $0 |
| Render Backend | 750 hours/month | $0 |
| MongoDB Atlas | 512MB storage | $0 |
| Resend Emails | 100 emails/day (3000/month) | $0 |
| **Total** | | **$0** |

**Note:** As your service grows:
- Render: $7/month minimum paid plan
- MongoDB: $57/month for M10 cluster
- Resend: Pay per email after free tier

---

## Common Production Issues

### Issue: Cold Start Delays (Render Free Tier)

**Solution**: 
- Upgrade to paid plan ($7/month)
- OR use a ping service to keep alive

### Issue: Emails Not Sending

**Checks**:
1. Verify RESEND_API_KEY is correct
2. Check Render logs for errors
3. Check Resend dashboard for failed emails
4. Verify email is from custom domain or Resend testing domain

### Issue: MongoDB Connection Errors

**Checks**:
1. Verify MONGODB_URI is correct
2. Check IP whitelist in MongoDB Atlas
3. Verify username and password

### Issue: CORS Errors

**Checks**:
1. Verify FRONTEND_URL matches exactly
2. Check backend is returning correct headers
3. Restart backend deployment

---

## Performance Optimization

### Frontend (Vercel):
- Already optimized (built with Vite)
- Uses CDN globally
- Automatic image optimization

### Backend (Render):
- Use paid plan for better performance
- Add caching headers
- Optimize database queries
- Consider Redis caching layer (future)

### Database (MongoDB):
- Create indexes (already done)
- Monitor slow queries
- Regular backups

---

## Security Best Practices

- [ ] Change JWT_SECRET in production
- [ ] Use strong database passwords
- [ ] Enable IP whitelist for MongoDB
- [ ] Keep API keys secure
- [ ] Don't commit `.env` files
- [ ] Use HTTPS everywhere (automatic)
- [ ] Implement rate limiting (future)
- [ ] Add input validation (already done)
- [ ] Use environment variables for secrets

---

## Scaling Strategy

### Current Limits:
- Render: 512 MB RAM (can handle ~1000 concurrent users)
- MongoDB: 512 MB storage (can handle ~10,000 carts)
- Vercel: Unlimited requests

### When to Upgrade:
1. Backend response time > 1 second
2. Database storage > 400 MB
3. Cron job falling behind

### Upgrade Path:
1. Render → Paid plan ($7/month+)
2. MongoDB → M10 cluster ($57/month)
3. Add Redis cache layer

---

## Continuous Deployment

Both Vercel and Render automatically deploy when you push to main branch.

### Setup:

1. **Vercel**: Automatically detects GitHub
2. **Render**: Automatically detects GitHub
3. Push to main → Auto-deploy → Live

---

## Rollback Strategy

### Frontend (Vercel):
1. Go to Deployments
2. Click previous deployment
3. Click "Promote to Production"

### Backend (Render):
1. Go to Deployments
2. Click previous deployment
3. Click "Deploy"

---

## Support & Troubleshooting

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Docs**: https://docs.mongodb.com/
- **Resend Docs**: https://resend.com/docs

---

## Next Steps

1. Set up monitoring and alerts
2. Implement analytics tracking
3. Add payment processing (Stripe)
4. Set up automated backups
5. Add SMS notifications (Twilio)
6. Create admin dashboard

---

**Your app is now live! 🎉**

**Frontend**: https://yourapp.vercel.app  
**Backend**: https://yourapp.onrender.com  
**Database**: MongoDB Atlas

Share with friends and family to test the abandoned cart notification system!
