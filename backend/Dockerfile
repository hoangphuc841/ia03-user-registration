FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies (including devDeps so `start:dev` works inside container)
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

# By default run production build. In docker-compose we override to `start:dev` for development.
CMD ["npm", "run", "start:prod"]
