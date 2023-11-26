# Dockerfile for Flask Backend
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY . .

# Command to run the application
CMD gunicorn --bind 0.0.0.0:$PORT app:app
