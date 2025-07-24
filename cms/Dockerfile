# Sanity CMS Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy project files
COPY . .

# Install Sanity CLI and dependencies
RUN npm install -g sanity
RUN npm install

# Build the studio
RUN sanity build

# Expose port and run preview server
EXPOSE 3333
CMD ["sanity", "start"]
