# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /usr/share/nginx/html /var/cache/nginx /var/log/nginx
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["nginx", "-g", "daemon off;"]