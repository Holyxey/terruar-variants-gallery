FROM dockerhub.timeweb.cloud/oven/bun:1.3-slim AS builder

WORKDIR /app

COPY package.json bun.lock .
RUN bun i --frozen-lockfile

COPY . .

ARG API_PATH
ARG DIR_PUBLIC
ARG DEV

RUN bun run lint
RUN bun run build:app

FROM dockerhub.timeweb.cloud/oven/bun:1.3-slim

WORKDIR /app

COPY package.json ./

COPY --from=builder /app/dist ./dist

CMD ["bun", "run", "server:start"]