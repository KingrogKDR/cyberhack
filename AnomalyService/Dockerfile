# Use Node.js 18 Alpine as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the Prisma schema first
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the entire source code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8192

# Command to run the application
CMD ["npm", "start"]
