# Use Node.js 24 LTS
FROM node:24

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend source files
COPY . .

# Expose the port
EXPOSE 5000

# Start the server
CMD ["npm", "run", "dev"]

