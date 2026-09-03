# ---- build the React app ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# src/api/api.js reads VITE_API_URL. In production the site and the API share
# one origin and nginx (below) proxies /api -> the backend container.
ENV VITE_API_URL=/api
RUN npm run build

# ---- serve with nginx ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
