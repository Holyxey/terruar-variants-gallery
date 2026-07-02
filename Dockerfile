FROM dockerhub.timeweb.cloud/oven/bun:1.3-slim AS base



FROM base AS builder

WORKDIR /app

COPY package.json bun.lock .
RUN bun i --frozen-lockfile

COPY . .

ARG DEV
ARG API_PATH
ARG DIR_PUBLIC
ARG API_PATH_LOCAL
ARG API_KEY

RUN bun run lint
RUN bun run build:app



FROM base

WORKDIR /app

COPY package.json ./

COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/src/utils/pdfjs ./dist/public/pdfjs
# COPY --from=builder /app/src/assets/menus ./dist/public/menus

CMD ["bun", "server:start"]