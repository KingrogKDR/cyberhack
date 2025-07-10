# Use official Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# If using TypeScript, build the app
RUN npm run build

# Expose internal port
EXPOSE 5000

# Start the app (change if not using compiled JS)
CMD ["node", "dist/index.js"]
