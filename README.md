# 🧠 AI Content Generator – Intelligent Content Creation with Railway Database

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **FastAPI**, and **PostgreSQL** (Railway)
Self-hosted AI content generation with OpenAI integration, user authentication, advanced image generation & persistent output saving

![AI Content Generator Banner](AI.png)

🚀 A powerful full-stack AI application that enables users to generate high-quality content including blog posts, email drafts, and AI-generated images—all with secure JWT authentication, usage tracking, and persistent storage powered by Railway PostgreSQL.

This is a fully custom-built application, designed and developed from scratch, combining advanced LLM capabilities with a modern, responsive frontend and robust FastAPI backend.

## 📽️ Demo Recording (Coming Soon)
A recorded walkthrough will soon be available where I:

- Showcase content generation in action (blog posts, emails, images)
- Walk through image generation (prompt to result, including sophisticated scenes)
- Show Railway database with user data & saved outputs
- Point to backend logs and authentication flow
- Demonstrate real-time frontend/backend interaction
- Show deployment process on Render.com or VPS

Recording tools: OBS Studio, Railway dashboard, browser console, and Postman/DevTools for API behavior.

## ✨ Key Features

🤖 **AI Content Generation**: Generate blog posts, email drafts, and marketing content with OpenAI
🎨 **Image Generation**: Sophisticated image outputs via DALL-E 3 integration
💬 **User Authentication**: Secure JWT-based authentication with user profiles
🔐 **Google OAuth**: One-click sign-in/sign-up with Google accounts
🛡️ **Usage Tracking**: Monitor and limit user usage with persistent storage
🧠 **Output Management**: Save and retrieve generated content with metadata
🔐 **Secure Backend API**: Built with FastAPI with request rate limiting and CORS
🗄️ **Railway Database**: Managed PostgreSQL with automatic backups and scaling
🐳 **Docker Ready**: Complete containerization for easy deployment
🌐 **Production Ready**: Nginx reverse proxy, SSL support, and health checks

## 🛠️ Stack & Tools

| Layer | Tech Used |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Backend** | FastAPI (Python), SQLAlchemy ORM |
| **Database** | PostgreSQL (Railway managed) |
| **Authentication** | JWT Bearer tokens, bcrypt hashing |
| **AI Models** | GPT-3.5-turbo, DALL-E 3 |
| **DevOps** | Docker, Docker Compose, Nginx |
| **Deployment** | Render.com, Fly.io, VPS ready |

## 🚧 Status

✅ **Core functionality complete**
✅ **User authentication working**
✅ **Google OAuth authentication implemented**
✅ **AI content generation implemented**
✅ **Image generation with DALL-E 3**
✅ **Railway database integration**
✅ **Docker containerization**
✅ **Production deployment configuration**
✅ **Nginx reverse proxy setup**
🔜 **Video recording + documentation polish**
🔜 **Advanced usage analytics**

## 🧪 Running Locally

### Prerequisites
- Node.js 18+
- Python 3.8+
- Docker & Docker Compose
- Railway account for database

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Predaotor/AI-content-Generator
cd AI-content-Generator

# Set up environment variables
cp env.example .env
# Edit .env with your Railway database URL and OpenAI API key

# Start with Docker Compose
docker-compose up --build -d

# Or run individually
cd frontend-AI && npm install && npm run dev
cd backend-AI && pip install -r requirements.txt && uvicorn app.main:app --reload
```

### Environment Variables
```bash
# Railway Database
DATABASE_URL=postgresql://user:pass@host:port/db
DATABASE_PUBLIC_URL=postgresql://user:pass@host:port/db

# Security
SECRET_KEY=your_super_secret_key
JWT_SECRET_KEY=your_jwt_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# App Config
ENVIRONMENT=development
DEBUG=true
```

### Google OAuth Setup

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API

2. **Create OAuth 2.0 Credentials**:
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID (Web application)
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   - Copy the Client ID

3. **Set Environment Variables**:
   - Backend: Set `GOOGLE_CLIENT_ID` in your backend `.env`
   - Frontend: Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in your frontend `.env.local`

4. **Test Google Sign-In**:
   - Users can now sign in/sign up with their Google accounts
   - Automatic user creation with unique usernames
   - Seamless integration with existing JWT authentication

## 🚀 Deployment

### Option 1: Render.com (Recommended)
1. Fork/clone this repository
2. Create Render account and connect GitHub
3. Set environment variables in Render dashboard
4. Deploy automatically with `render.yaml`

### Option 2: VPS Deployment
```bash
# Follow detailed guide in DEPLOYMENT.md
# Quick deployment:
./deploy-production.sh  # Linux/Mac
deploy-production.bat   # Windows
```

### Option 3: Railway Full Stack
- Database: Already on Railway
- Backend: Deploy to Railway with Docker
- Frontend: Deploy to Railway with Docker

## 📁 Project Structure

```
AI-content-Generator/
├── frontend-AI/          # Next.js frontend
│   ├── src/
│   │   ├── pages/       # Next.js pages
│   │   ├── components/  # React components
│   │   └── utils/       # API utilities
│   └── Dockerfile       # Frontend container
├── backend-AI/          # FastAPI backend
│   ├── app/
│   │   ├── routes/      # API endpoints
│   │   ├── models.py    # Database models
│   │   └── main.py      # FastAPI app
│   └── Dockerfile       # Backend container
├── docker-compose.yaml  # Multi-container setup
├── nginx.conf          # Reverse proxy config
├── DEPLOYMENT.md       # Deployment guide
└── render.yaml         # Render.com config
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/google` - Google OAuth authentication
- `GET /auth/profile` - Get user profile

### Content Generation
- `POST /generate/generate-template` - Generate text content
- `POST /generate/generate-image-template` - Generate images
- `POST /save/save-output` - Save generated content

### Health Check
- `GET /health` - Service health status

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Google OAuth**: Secure third-party authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Pydantic models for data validation
- **SQL Injection Protection**: SQLAlchemy ORM

## 📊 Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email
- `hashed_password`: Bcrypt hashed password (nullable for OAuth users)
- `created_at`: Account creation timestamp

### Saved Outputs Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `template_type`: Content type (blog_post, email_draft, image)
- `content`: Generated content
- `created_at`: Generation timestamp

## 🐳 Docker Configuration

### Multi-Stage Builds
- **Frontend**: Node.js Alpine with Next.js optimization
- **Backend**: Python Alpine with FastAPI
- **Nginx**: Reverse proxy with SSL support

### Health Checks
- Backend: `http://localhost:8000/health`
- Frontend: `http://localhost:3000`
- Automatic restart on failure

## 💰 Cost Estimation

### Monthly Costs (Approximate)
- **Railway Database**: $5-20/month (depending on usage)
- **Render.com**: Free tier available, then $7/month
- **Domain**: $10-15/year (optional)
- **Total**: $5-35/month

### Free Tier Options
- **Railway**: Free tier available
- **Render**: Free tier available
- **Fly.io**: Free tier available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT and DALL-E APIs
- **Railway** for managed PostgreSQL
- **Next.js** team for the amazing framework
- **FastAPI** team for the high-performance backend framework
- **Google** for OAuth authentication services

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Test database connection
4. Review platform-specific documentation

---

**Ready to generate amazing content?** Deploy this application and start creating with AI! 🚀