# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for tsc)
RUN npm install

# Copy source code and config
COPY . .

# Generate Prisma client and build the project
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/postgres" npx prisma generate
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose the application port (matching PORT in .env)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
