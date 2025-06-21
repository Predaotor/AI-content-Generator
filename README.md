# AI Content Generator

A modern, full-stack AI-powered content generation application built with Next.js, FastAPI, and OpenAI.

## 🚀 Features

- **AI-Powered Content Generation**: Create blog posts, email drafts, and images
- **User Authentication**: Secure user registration and login system
- **Content Management**: Save and manage generated content
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **Real-time Typing Effect**: ChatGPT-like content display
- **Token Management**: Track and limit API usage
- **Dark/Light Mode**: Toggle between themes

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Context** - State management

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **OpenAI API** - AI content generation

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy
- **PostgreSQL** - Database

## 📋 Prerequisites

- Docker and Docker Compose
- OpenAI API key
- PostgreSQL (included in Docker setup)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-content-Generator
```

### 2. Set Up Railway Database
1. Create a new project on [Railway](https://railway.app/)
2. Add a PostgreSQL database to your project
3. Get your database connection URL from Railway dashboard

### 3. Set Up Environment Variables

You need to set up environment variables in two locations:

#### Root Level (.env for Docker Compose)
```bash
cp env.example .env
```

Edit `.env` file with your actual values:
```env
# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=production
```

#### Backend Level (backend-AI/.env for FastAPI)
Create `backend-AI/.env` file with your backend configuration:
```env
# Database Configuration (Railway)
DATABASE_URL=postgresql://username:password@host:port/database_name

# Security
SECRET_KEY=your_super_secret_key_here_make_it_long_and_random
JWT_SECRET_KEY=your_jwt_secret_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration
ENVIRONMENT=production
DEBUG=false
```

### 4. Deploy with Docker Compose
```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

Or manually:
```bash
docker-compose up --build -d
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Nginx (if enabled)**: http://localhost:80

## 🔧 Development Setup

### Frontend Development
```bash
cd frontend-AI
npm install
npm run dev
```

### Backend Development
```bash
cd backend-AI
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📁 Project Structure

```
AI-content-Generator/
├── frontend-AI/                 # Next.js frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Next.js pages
│   │   ├── utils/             # Utility functions
│   │   └── styles/            # Global styles
│   ├── public/                # Static assets
│   └── Dockerfile             # Frontend container
├── backend-AI/                 # FastAPI backend
│   ├── app/
│   │   ├── routes/            # API routes
│   │   ├── models/            # Database models
│   │   ├── utils/             # Utility functions
│   │   └── main.py            # FastAPI app
│   └── Dockerfile             # Backend container
├── docker-compose.yaml         # Multi-container setup
├── nginx.conf                  # Nginx configuration
├── deploy.sh                   # Deployment script
└── env.example                 # Environment variables template
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting with Nginx
- Security headers
- Non-root Docker containers
- Environment variable management

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Content Generation
- `POST /generate/{template_type}` - Generate content
- `POST /save` - Save generated content
- `GET /saved` - Get saved content

## 🚀 Production Deployment

### 1. Environment Setup
- Set all required environment variables
- Configure SSL certificates
- Set up domain names

### 2. Database Setup
- PostgreSQL is automatically set up with Docker
- Data is persisted in Docker volumes

### 3. SSL Configuration
Uncomment and configure SSL in `nginx.conf`:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... rest of configuration
}
```

### 4. Monitoring
- Health checks are configured for all services
- Logs can be viewed with `docker-compose logs`

## 🔧 Configuration

### Frontend Configuration
- Update `NEXT_PUBLIC_API_URL` in `.env`
- Configure image domains in `next.config.js`

### Backend Configuration
- Set database URL in `.env`
- Configure OpenAI API key
- Set JWT secrets

### Nginx Configuration
- Rate limiting settings
- SSL configuration
- Security headers

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_PASSWORD` | Database password | Yes |
| `DB_PORT` | Database port | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NODE_ENV` | Environment (production/development) | No |

## 🐛 Troubleshooting

### Common Issues

1. **Services not starting**
   ```bash
   docker-compose logs
   ```

2. **Database connection issues**
   - Check PostgreSQL container status
   - Verify database credentials

3. **API connection issues**
   - Ensure backend is running
   - Check `NEXT_PUBLIC_API_URL` configuration

4. **Build failures**
   - Clear Docker cache: `docker system prune`
   - Rebuild: `docker-compose build --no-cache`

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.


