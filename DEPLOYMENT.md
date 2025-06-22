# 🚀 AI Content Generator - Deployment Guide

## Recommended Deployment Strategy

**For freelancers and small projects, use native deployment (no Docker):**
- **Database**: Railway (Managed PostgreSQL)
- **Backend**: Railway native Python deployment
- **Frontend**: Railway or Render.com native Node.js deployment
- **Domain & SSL**: Custom domain with Let's Encrypt

## 🎯 Choose Your Deployment Method

### **Method 1: Native Deployment (Recommended for Freelancers)**
- No Docker needed
- Platform handles runtime
- Faster deployment
- Less complexity
- **Platforms**: Railway, Render.com, Fly.io

### **Method 2: Docker Compose (For Advanced Users)**
- Uses `docker-compose.yaml`
- More control over environment
- More complex setup
- **Platforms**: VPS, Render.com, DigitalOcean

## 📋 Prerequisites

1. **Railway Account**: [railway.app](https://railway.app) (Free tier available)
2. **Deployment Platform**: Railway (recommended) or Render.com
3. **Domain Name** (Optional but recommended)

## 🗄️ Step 1: Railway Database Setup

### 1.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Copy the connection details

### 1.2 Configure Environment Variables
Create `.env` file in the root directory:

```bash
# Railway Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name
DATABASE_PUBLIC_URL=postgresql://username:password@host:port/database_name

# Security
SECRET_KEY=your_super_secret_key_here_make_it_long_and_random
JWT_SECRET_KEY=your_jwt_secret_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration
ENVIRONMENT=production
DEBUG=false
```

## ☁️ Step 2: Deploy with Native Services

### Option A: Railway Native Deployment (Recommended)

#### 2.1 Deploy Backend
```bash
cd backend-AI
railway up
```

**What Railway does automatically:**
- Detects Python project
- Installs dependencies from `requirements.txt`
- Runs `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### 2.2 Deploy Frontend
```bash
cd frontend-AI
railway up
```

**What Railway does automatically:**
- Detects Node.js project
- Installs dependencies from `package.json`
- Runs `npm start`

#### 2.3 Set Environment Variables
In Railway dashboard for each service:
```bash
DATABASE_URL=your_railway_database_url
DATABASE_PUBLIC_URL=your_railway_database_url
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
OPENAI_API_KEY=your_openai_key
ENVIRONMENT=production
DEBUG=false
```

### Option B: Render.com Native Deployment

#### 2.1 Deploy Backend
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Select `backend-AI` directory
5. Set build command: `pip install -r requirements.txt`
6. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### 2.2 Deploy Frontend
1. Create new Web Service
2. Connect GitHub repository
3. Select `frontend-AI` directory
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`

### Option C: Fly.io Native Deployment

#### 2.1 Deploy Backend
```bash
cd backend-AI
fly launch
fly secrets set DATABASE_URL="your-railway-url"
fly deploy
```

#### 2.2 Deploy Frontend
```bash
cd frontend-AI
fly launch
fly deploy
```

## 🌐 Step 3: Domain & SSL Setup

### 3.1 Point Domain to Service
1. Get your service URL from Railway/Render/Fly.io
2. Update DNS to point to the service URL
3. Wait for propagation (5-30 minutes)

### 3.2 SSL (Automatic)
- Railway: Automatic HTTPS
- Render.com: Automatic HTTPS
- Fly.io: Automatic HTTPS

## 🔧 Step 4: Service Communication

### 4.1 Update Frontend API URL
Set in frontend environment variables:
```bash
# Railway
NEXT_PUBLIC_API_URL=https://your-backend-app.railway.app

# Render.com
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com

# Fly.io
NEXT_PUBLIC_API_URL=https://ai-content-backend.fly.dev
```

## 📊 Step 5: Monitoring & Maintenance

### 5.1 Logs
```bash
# Railway
railway logs

# Render.com
# View in dashboard

# Fly.io
fly logs
```

### 5.2 Updates
```bash
# Push to GitHub
git push origin main

# Railway auto-deploys
# Render.com auto-deploys
# Fly.io: fly deploy
```

## 🎯 Platform-Specific Instructions

### Railway (Recommended)
1. Deploy backend: `cd backend-AI && railway up`
2. Deploy frontend: `cd frontend-AI && railway up`
3. Set environment variables in dashboard
4. Railway handles everything else

### Render.com
1. Create Web Service for backend
2. Create Web Service for frontend
3. Set environment variables
4. Auto-deploys on GitHub push

### Fly.io
1. Deploy backend: `fly launch`
2. Deploy frontend: `fly launch`
3. Set secrets: `fly secrets set`
4. Deploy: `fly deploy`

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check Railway connection string
   - Verify environment variables
   - Test connection manually

2. **Frontend Can't Reach Backend**
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Verify service URLs
   - Check CORS settings

3. **Build Failures**
   - Check `requirements.txt` for backend
   - Check `package.json` for frontend
   - Review platform logs

### Debug Commands
```bash
# Railway
railway status
railway logs

# Render.com
# Check dashboard logs

# Fly.io
fly status
fly logs
```

## 💰 Cost Estimation

### Monthly Costs (Approximate)
- **Railway Database**: $5-20/month (depending on usage)
- **Railway Services**: Free tier available, then $5/month per service
- **Render.com**: Free tier available, then $7/month
- **Fly.io**: Free tier available, then $1.94/month per app
- **Domain**: $10-15/year
- **Total**: $5-50/month

### Free Tier Options
- **Railway**: Free tier available
- **Render**: Free tier available
- **Fly.io**: Free tier available

## 📞 Support

For deployment issues:
1. Check platform logs
2. Verify environment variables
3. Test database connection
4. Review platform-specific documentation

## 🎉 Success Checklist

- [ ] Railway database created and connected
- [ ] Backend service deployed successfully
- [ ] Frontend service deployed successfully
- [ ] Environment variables configured
- [ ] Services can communicate with each other
- [ ] Domain pointing to service (if applicable)
- [ ] SSL certificate working (automatic)
- [ ] Health checks passing
- [ ] Application accessible via domain
- [ ] Database connection working
- [ ] File uploads working
- [ ] Authentication working

---

**Ready to deploy?** Use native deployment - it's simpler and faster! 🚀 