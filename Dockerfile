FROM node:22.22.1-alpine AS builder

RUN npm install -g pnpm@10.28.2

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

ENV NODE_ENV=development

RUN pnpm install --frozen-lockfile --prod=false

COPY . .

RUN pnpm run build


FROM caddy:2 AS runner

WORKDIR /app

COPY --from=builder /app/public/dist ./public/dist

EXPOSE 3000

CMD ["caddy", "file-server", "--root", "public/dist", "--listen", ":3000"]
