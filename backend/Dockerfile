# Base image
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Dependencies image
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build image
FROM dependencies AS build
COPY . .
RUN npm run build

# Production image
FROM base AS production
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY --from=build /usr/src/app/dist ./dist

# Start server
CMD ["node", "dist/main"]
EXPOSE 3000
