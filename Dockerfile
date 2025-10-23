# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client (after code is copied)
RUN npx prisma generate

# Expose app port
EXPOSE 4000

# Run the app
CMD ["npm", "run", "start"]
