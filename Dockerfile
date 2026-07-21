# Use a multi-stage build to compile TypeScript & React client assets
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package descriptors and lockfiles
COPY package*.json ./

# Install dev & production dependencies to enable compiling code
RUN npm install

# Copy application source files
COPY . .

# Run build step - compiles frontend assets & esbuild server to dist/
ENV NODE_ENV=production
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy compiled assets from builder
COPY --from=builder /usr/src/app/dist ./dist

# Expose server port (8080 is default for Cloud Run)
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

# Run compiled production server CJS bundle
CMD [ "npm", "start" ]
