FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock tsconfig.json vite.config.ts ./
COPY config ./config
COPY public-multi ./public-multi
COPY src ./src

RUN bun install --frozen-lockfile
RUN bun run build:multi

FROM nginx:alpine AS runtime

COPY config/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist-vite /usr/share/nginx/html

EXPOSE 80
