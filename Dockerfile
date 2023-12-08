# Use the official Node.js 18 image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# # Install build dependencies
RUN apk add --no-cache --virtual .gyp python3 make g++ postgresql-dev

# # Install project dependencies
RUN npm ci

# # Copy the rest of the application code
COPY . .

# # Expose the application port
EXPOSE 3000

RUN npm run build
# CMD ["tail", "-f", "/dev/null"]

# # Start the Nest.js application
CMD ["node", "dist/main.js"]
