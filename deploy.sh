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

#!/bin/bash

# Check if the deployment target (frontend or backend) is provided
if [ -z "$1" ]; then
  echo "Please specify the deployment target ('frontend' or 'backend')."
  exit 1
fi

TARGET=$1

if [ "$TARGET" == "frontend" ]; then
  APP_NAME="family-chatgpt-frontend"
else
  APP_NAME="family-chatgpt-api"
fi

DOCKER_CONTEXT="./$TARGET"         # Assuming Dockerfiles are inside frontend/ and backend/ directories

# Build the Docker image
echo "Building Docker image for $TARGET..."
docker build --platform linux/amd64 -t $APP_NAME $DOCKER_CONTEXT

# Tag the image for Heroku
echo "Tagging image for Heroku..."
docker tag $APP_NAME registry.heroku.com/$APP_NAME/web

# Push to Heroku Container Registry
echo "Pushing image to Heroku Container Registry..."
docker push registry.heroku.com/$APP_NAME/web

# Release the image
echo "Releasing image..."
heroku container:release web --app $APP_NAME

echo "Deployment of $TARGET complete."