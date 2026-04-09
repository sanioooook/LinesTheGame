# syntax=docker/dockerfile:1

FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

# --host makes Vite listen on 0.0.0.0 (required inside Docker)
CMD ["npx", "vite", "--host"]
