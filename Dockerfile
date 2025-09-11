FROM node:24-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

EXPOSE 3000

CMD ["node", "dist/main"]
