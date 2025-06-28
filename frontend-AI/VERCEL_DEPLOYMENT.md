# Vercel Deployment Guide

## Prerequisites
- Your backend API is deployed and accessible
- You have a Vercel account

## Environment Variables

Set these environment variables in your Vercel project dashboard:

### Required Environment Variables

1. **NEXT_PUBLIC_API_URL**
   - Description: The URL of your backend API
   - Example: `https://your-backend-api.railway.app` or `https://your-backend-api.vercel.app`
   - Note: Must start with `NEXT_PUBLIC_` to be accessible in the browser

### Optional Environment Variables

2. **NODE_ENV**
   - Description: Node environment
   - Value: `production`

## Deployment Steps

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend-AI` directory as the root directory

2. **Configure build settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set environment variables**
   - In your Vercel project dashboard, go to Settings > Environment Variables
   - Add the required environment variables listed above

4. **Deploy**
   - Click "Deploy" in the Vercel dashboard
   - Vercel will automatically build and deploy your application

## Troubleshooting

### Common Issues

1. **Build fails with Husky error**
   - ✅ **Fixed**: The `prepare` script now checks for `.git` directory before running `husky install`

2. **API calls fail**
   - Make sure `NEXT_PUBLIC_API_URL` is set correctly
   - Ensure your backend API is accessible from the internet
   - Check CORS configuration on your backend

3. **Environment variables not working**
   - Ensure environment variables start with `NEXT_PUBLIC_` for client-side access
   - Redeploy after adding new environment variables

### Build Configuration

The project includes:
- `vercel.json` - Vercel-specific configuration
- Updated `package.json` with conditional Husky installation
- Next.js configuration optimized for production

## Post-Deployment

1. **Test your application**
   - Verify all pages load correctly
   - Test user registration and login
   - Test AI content generation
   - Check that API calls work properly

2. **Set up custom domain (optional)**
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain

3. **Monitor performance**
   - Use Vercel Analytics to monitor performance
   - Check build logs for any issues 