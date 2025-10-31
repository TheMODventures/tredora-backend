# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies (include dev for build)
COPY package*.json ./
RUN npm install --include=dev

# Copy the rest of the application
COPY . .

# Generate Prisma client (after code is copied)
RUN npx prisma generate

# Build TypeScript project
RUN npm run build

# Expose app port
EXPOSE 4000

# Run built app
CMD ["node", "dist/index.js"]
