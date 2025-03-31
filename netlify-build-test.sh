#!/bin/bash
# Script to test Netlify build locally

echo "🧪 Testing Netlify build locally..."

# Load environment variables from .env.local
if [ -f .env.local ]; then
  echo "📄 Loading environment variables from .env.local"
  export $(grep -v '^#' .env.local | xargs)
else
  echo "⚠️ No .env.local file found. Make sure you have set environment variables."
fi

# Run type checking
echo "🔍 Running TypeScript type checking..."
npx tsc --noEmit

# Run linting
echo "🧹 Running ESLint..."
npm run lint

# Run build
echo "🏗️ Running production build..."
npm run build

# Check build status
if [ $? -eq 0 ]; then
  echo "✅ Build successful! Your app should deploy correctly to Netlify."
else
  echo "❌ Build failed. Fix the errors above before deploying to Netlify."
  exit 1
fi
