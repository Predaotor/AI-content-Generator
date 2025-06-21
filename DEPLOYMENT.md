# 🚀 AI Content Generator - Deployment Guide

## Recommended Deployment Strategy

This guide follows the recommended approach for solo developers and freelancers:
- **Database**: Railway (Managed PostgreSQL)
- **Application**: Docker Compose on VPS/Cloud Platform
- **Domain & SSL**: Custom domain with Let's Encrypt

## 📋 Prerequisites

1. **Railway Account**: [railway.app](https://railway.app) (Free tier available)
2. **VPS or Cloud Platform**: Choose from:
   - **Render.com** (Recommended for beginners)
   - **Fly.io** (Good free tier)
   - **DigitalOcean** (Reliable VPS)
   - **Hetzner** (Cost-effective)
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

## ☁️ Step 2: Choose Your Deployment Platform

### Option A: Render.com (Recommended)

1. **Create Render Account**: [render.com](https://render.com)
2. **Connect GitHub**: Link your repository
3. **Create Web Service**:
   - **Build Command**: `docker-compose up --build -d`
   - **Start Command**: `docker-compose up -d`
   - **Environment Variables**: Add all from `.env`

### Option B: Fly.io

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **Deploy**: `fly deploy`

### Option C: VPS (DigitalOcean/Hetzner)

1. **Provision VPS**: Ubuntu 20.04+ recommended
2. **Install Docker**: 
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```
3. **Install Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

## 🐳 Step 3: Deploy with Docker Compose

### 3.1 Upload Your Code
```bash
# Clone or upload your project to the server
git clone <your-repo-url>
cd AI-content-Generator
```

### 3.2 Configure Environment
```bash
# Copy environment template
cp env.example .env

# Edit with your Railway database details
nano .env
```

### 3.3 Deploy
```bash
# Build and start services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🌐 Step 4: Domain & SSL Setup

### 4.1 Point Domain to Server
1. **Get Server IP**: `curl ifconfig.me`
2. **Update DNS**: Point your domain to the server IP
3. **Wait for Propagation**: 5-30 minutes

### 4.2 SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 4.3 Update Nginx Configuration
Update `nginx.conf` with your domain:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    # ... rest of config
}
```

## 🔧 Step 5: Production Configuration

### 5.1 Environment Variables
Ensure these are set in production:
```bash
NODE_ENV=production
ENVIRONMENT=production
DEBUG=false
```

### 5.2 Security Headers
Nginx configuration includes security headers:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Content-Security-Policy

### 5.3 Health Checks
Services include health checks:
- Backend: `http://localhost:8000/health`
- Frontend: `http://localhost:3000`

## 📊 Step 6: Monitoring & Maintenance

### 6.1 Logs
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
```

### 6.2 Updates
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### 6.3 Backup
```bash
# Database backup (Railway handles this automatically)
# Application backup
tar -czf backup-$(date +%Y%m%d).tar.gz ./
```

## 🎯 Platform-Specific Instructions

### Render.com
1. Create new Web Service
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically

### Fly.io
```bash
fly launch
fly secrets set DATABASE_URL="your-railway-url"
fly deploy
```

### DigitalOcean App Platform
1. Create App from GitHub
2. Select Docker Compose
3. Configure environment variables
4. Deploy

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check Railway connection string
   - Verify network access
   - Test connection manually

2. **Frontend Can't Reach Backend**
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Verify Docker network configuration
   - Check service names in docker-compose

3. **SSL Issues**
   - Verify domain DNS propagation
   - Check Certbot installation
   - Review nginx configuration

### Debug Commands
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Test database connection
docker-compose exec backend python -c "from app.database import engine; engine.connect(); print('DB OK')"

# Check network
docker network ls
docker network inspect ai-content-generator_ai-app
```

## 💰 Cost Estimation

### Monthly Costs (Approximate)
- **Railway Database**: $5-20/month (depending on usage)
- **VPS (DigitalOcean)**: $5-12/month
- **Domain**: $10-15/year
- **Total**: $10-35/month

### Free Tier Options
- **Railway**: Free tier available
- **Render**: Free tier available
- **Fly.io**: Free tier available

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Test database connection
4. Review platform-specific documentation

## 🎉 Success Checklist

- [ ] Railway database created and connected
- [ ] Environment variables configured
- [ ] Docker Compose deployment successful
- [ ] Domain pointing to server
- [ ] SSL certificate installed
- [ ] Health checks passing
- [ ] Application accessible via domain
- [ ] Database connection working
- [ ] File uploads working
- [ ] Authentication working

---

**Ready to deploy?** Choose your platform and follow the steps above! 