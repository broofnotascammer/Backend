# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
# We copy these separately to leverage Docker layer caching
# If your package-lock.json isn't present, you can remove that line
COPY package*.json ./

# Install app dependencies
# This command will read package.json and install modules into node_modules
RUN npm install --production

# Copy the rest of the application code
# The .dockerignore file will prevent node_modules from being copied
COPY . .

# Expose the port your app runs on
# Your server.js listens on process.env.PORT, which Render sets to 10000.
# EXPOSE is mainly for documentation and network configuration in other environments.
EXPOSE 3000

# Define the command to run your app
# This will start your server.js script
CMD [ "node", "server.js" ]
