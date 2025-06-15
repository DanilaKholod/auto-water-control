# Use the official Node.js image as the base image.
FROM node:18-alpine as builder

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json to the working directory.
COPY package*.json ./

# Install dependencies.
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code.
COPY . .

# Build the Next.js application for production.
RUN npm run build

# Use a smaller image for production.
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port the app runs on
EXPOSE 3000

# Define the command to start the application.
CMD ["npm", "start"]