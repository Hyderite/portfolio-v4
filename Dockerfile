FROM node:22.22.1-alpine AS builder

RUN npm install -g pnpm@10.28.2

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


FROM alpine:3.20

WORKDIR /app

COPY --from=builder /app/public/dist ./public/dist

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]
