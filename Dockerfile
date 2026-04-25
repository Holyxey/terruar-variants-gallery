FROM oven/bun:1.3 AS builder

WORKDIR /app

COPY package.json bun.lock .
RUN bun i --frozen-lockfile

COPY . .

RUN bun run lint
RUN bun run build:app

FROM oven/bun:1.3-slim

WORKDIR /app

COPY package.json ./

COPY --from=builder /app/dist ./dist

CMD ["bun", "run", "server:start"]