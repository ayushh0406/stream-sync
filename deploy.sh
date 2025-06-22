#!/bin/bash

# StreamSync Production Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
echo "🚀 Starting deployment to $ENVIRONMENT..."

# Check if required tools are installed
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose is required but not installed. Aborting." >&2; exit 1; }

# Build and deploy backend
echo "📦 Building backend..."
cd backend
docker build -t streamsync-backend:latest .

# Build and deploy frontend
echo "🎨 Building frontend..."
cd ../frontend
docker build -t streamsync-frontend:latest .

# Start services
echo "🔧 Starting services..."
cd ..
docker-compose -f docker-compose.yml up -d

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "⚡ Backend: http://localhost:5000"
echo "📊 Check logs: docker-compose logs -f"