#!/bin/bash

# Define the app name
APP_NAME="family-chatgpt-frontend"

# Build the Docker image
echo "Building Docker image..."
docker build --platform linux/amd64 -t $APP_NAME . 

# Tag the image for Heroku
echo "Tagging image for Heroku..."
docker tag $APP_NAME registry.heroku.com/$APP_NAME/web

# Push to Heroku Container Registry
echo "Pushing image to Heroku Container Registry..."
docker push registry.heroku.com/$APP_NAME/web

# Release the image
echo "Releasing image..."
heroku container:release web --app $APP_NAME

echo "Deployment complete."