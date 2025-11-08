# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies (including prisma)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client (after code is copied)
# RUN npx prisma generate

# Build TypeScript project
# RUN npm run build

# Expose app port
EXPOSE 4000

# Entrypoint ensures DB + migrations before app start
ENTRYPOINT ["/app/wait-for-db.sh"]

# Command to start the app
CMD ["npm", "run", "start:prod"]
