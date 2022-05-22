FROM node:16 AS builder
ENV NODE_ENV=development
WORKDIR /app

# Add lockfile and package.jsons
COPY package.json package-lock.json ./
COPY apps/api/*.json ./apps/api/
COPY packages/models/*.json ./packages/models/
RUN npm install

# Copy source files
COPY . .

# Build
RUN npm run build -w packages/models
RUN npm run build -w apps/api

FROM node:16-stretch-slim AS runner
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY --from=builder /app/packages/models ./packages/models
RUN npm install

COPY --from=builder /app/apps/api/dist ./apps/api/dist
CMD ["npm", "run", "start:prod", "-w", "apps/api"]