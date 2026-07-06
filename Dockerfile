FROM dockerhub.timeweb.cloud/oven/bun:1.3-slim AS base



FROM base AS builder

WORKDIR /app

COPY package.json bun.lock .
RUN bun i --frozen-lockfile

COPY . .

ARG DEV
ARG API_PATH

RUN bun run lint
RUN bun run build:app



FROM base

WORKDIR /app

COPY package.json ./

COPY --from=builder /app/dist ./dist

CMD ["bun", "server:start"]