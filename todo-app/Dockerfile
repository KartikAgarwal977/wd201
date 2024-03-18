# Use a multi-stage build with specified platform
FROM --platform=$BUILDPLATFORM node:lts as base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Expose port 3000
EXPOSE 3000

# Install dependencies
RUN npm install

# --- Production Stage ---
FROM base AS production

# Set environment variables
ENV NODE_ENV=production
RUN npm install  pm2 -g and pm2 start ecosystem.config.js
# Copy the rest of the application code
COPY . /app

# Command to run the application
CMD ["node", "index.js"]

# --- Development Stage ---
FROM base as dev

# Set environment variables
ENV NODE_ENV=development

# Install nodemon globally and install dependencies
RUN npm install -g nodemon && npm install 

# Copy the rest of the application code
COPY . .

HEALTHCHECK --interval=1m --timeout=30s --start-period=5s --retries=3 CMD  curl -f http://localhost:3000 || exit 1

# Command to start the development server
CMD ["npm", "run", "start:prod"]
