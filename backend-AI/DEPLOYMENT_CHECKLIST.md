# Backend Deployment Checklist

## Pre-Deployment Testing

### 1. Test Imports Locally
```bash
cd backend-AI
python test_imports.py
```
This should show "🎉 All imports successful!" if everything is working.

### 2. Test Local Run
```bash
cd backend-AI
python main.py
```
The server should start without import errors.

### 3. Test Database Migrations
```bash
cd backend-AI
python manage_migrations.py
```
Choose option 5 to run all migration tasks.

## Database Migration Options

### Option A: Simple Setup (Current)
- Uses `Base.metadata.create_all()` to create tables
- **Pros**: Simple, works for initial setup
- **Cons**: No migration history, can't handle schema changes safely
- **Use when**: You're just getting started or have a simple schema

### Option B: Alembic Migrations (Recommended for Production)
- Uses Alembic for proper migration management
- **Pros**: Safe schema changes, migration history, rollback capability
- **Cons**: More complex setup
- **Use when**: You need to manage schema changes in production

## Environment Variables Required

Make sure these environment variables are set in your deployment platform:

### Database Configuration
- `DATABASE_URL` - Your PostgreSQL connection string
- `DATABASE_PUBLIC_URL` - Public database URL (for local development)

### Security
- `SECRET_KEY` - A long, random secret key
- `JWT_SECRET_KEY` - A long, random JWT secret key

### OpenAI Configuration
- `OPENAI_API_KEY` - Your OpenAI API key

### Application Configuration
- `ENVIRONMENT` - Set to "production"
- `DEBUG` - Set to "false"

## Migration Strategy for Production

### If Using Simple Setup (Option A):
1. **Initial deployment**: Run locally to create tables
2. **Schema changes**: Update models locally, run app to apply changes
3. **⚠️ Warning**: This can cause data loss if not careful

### If Using Alembic (Option B):
1. **Initial setup**: Run `python manage_migrations.py` and choose option 5
2. **Schema changes**: 
   - Update your models
   - Run `alembic revision --autogenerate -m "Description of changes"`
   - Review the generated migration file
   - Run `alembic upgrade head`
3. **✅ Safe**: Migrations are tracked and can be rolled back

## Deployment Platforms

### Railway
1. Connect your GitHub repository
2. Set the root directory to `backend-AI`
3. Add all environment variables
4. Deploy

### Render
1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python main.py`
5. Add all environment variables
6. Deploy

### Heroku
1. Create a new app
2. Connect your GitHub repository
3. Set the root directory to `backend-AI`
4. Add all environment variables
5. Deploy

## Post-Deployment Testing

### 1. Health Check
Test the health endpoint:
```bash
curl https://your-backend-url.com/health
```
Should return: `{"status": "healthy", "service": "ai-content-generator-api"}`

### 2. Root Endpoint
Test the root endpoint:
```bash
curl https://your-backend-url.com/
```
Should return API information.

### 3. Database Connection
Test database connection:
```bash
curl https://your-backend-url.com/test-db
```
Should return database status.

## Common Issues & Solutions

### Import Errors
- ✅ **Fixed**: Updated import paths in `main.py`
- ✅ **Fixed**: Added proper Python path configuration
- ✅ **Fixed**: Ensured all `__init__.py` files exist

### Database Connection Issues
- Check `DATABASE_URL` is correct
- Ensure database is accessible from deployment platform
- Verify database credentials

### Migration Issues
- **Simple setup**: Tables are created automatically when app starts
- **Alembic setup**: Run migrations manually or add to deployment script
- **Data loss**: Always backup before running migrations

### CORS Issues
- ✅ **Fixed**: Added Vercel domains to CORS origins
- Frontend should now be able to connect to backend

### Environment Variables
- Ensure all required variables are set
- Check variable names match exactly (case-sensitive)
- Redeploy after adding new environment variables

## Troubleshooting

### If deployment fails:
1. Check the deployment logs
2. Run `python test_imports.py` locally
3. Verify all environment variables are set
4. Check database connectivity
5. Ensure all dependencies are in `requirements.txt`

### If API calls fail:
1. Test health endpoint first
2. Check CORS configuration
3. Verify frontend is using correct backend URL
4. Check authentication tokens

### If database issues occur:
1. Check database connection string
2. Verify database is running and accessible
3. Check if tables exist (use `/test-db` endpoint)
4. Run migrations if using Alembic

## Next Steps After Backend Deployment

1. **Note the backend URL** - You'll need this for frontend deployment
2. **Test the API endpoints** - Ensure they work correctly
3. **Update frontend environment variables** - Set `NEXT_PUBLIC_API_URL` to your backend URL
4. **Deploy frontend** - Deploy to Vercel with the correct backend URL

## Migration Commands Reference

### Alembic Commands:
```bash
# Create a new migration
alembic revision --autogenerate -m "Description"

# Run migrations
alembic upgrade head

# Check current migration
alembic current

# Show migration history
alembic history

# Rollback one migration
alembic downgrade -1

# Rollback to specific migration
alembic downgrade <revision_id>
```

### Using the Migration Manager:
```bash
python manage_migrations.py
```
This provides an interactive menu for common migration tasks 