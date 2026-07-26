# ---- Build stage ----
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Same-origin: browser calls /api, nginx routes it internally (see nginx.conf / ingress).
# This avoids needing to touch the backend's CORS config at all in production.
# Overridable at build time (docker-compose passes an absolute localhost URL for local testing).
ARG REACT_APP_API_BASE_URL=/api
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# ---- Runtime stage ----
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
