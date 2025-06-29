#!/bin/bash

# Vercel Deployment Script for Specific Branch
# Usage: ./vercel-deploy.sh [branch-name]

BRANCH=${1:-develop}  # Default to 'develop' if no branch specified

echo "🚀 Deploying from branch: $BRANCH"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first..."
    vercel login
fi

# Switch to the specified branch
echo "📋 Switching to branch: $BRANCH"
git checkout $BRANCH

# Pull latest changes
echo "⬇️  Pulling latest changes..."
git pull origin $BRANCH

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at the URL shown above" 