# Dockerfile for Vue.js Frontend
FROM node:lts as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:stable-alpine as production-stage

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the 'dist' directory from the build-stage to the nginx directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the custom nginx config
COPY ./nginx/nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose the port (Heroku will dynamically assign a port)
EXPOSE $PORT

CMD ["nginx", "-g", "daemon off;"]
