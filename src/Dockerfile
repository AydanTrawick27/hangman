FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json & lock
COPY package*.json ./

# Install deps
RUN npm install

# Copy the rest of your files (React app)
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
