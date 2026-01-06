FROM node:20-alpine AS build

ARG VITE_API_URL

ENV NODE_ENV=production
ENV HUSKY=0

WORKDIR /app/

COPY package.json .
COPY package-lock.json .

RUN npm pkg delete scripts.prepare
RUN npm ci

COPY public public
COPY src src
COPY index.html .
COPY tsconfig*.json .
COPY vite.config.ts .
COPY .env .

RUN npm run build

FROM nginx:1.27.0-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
