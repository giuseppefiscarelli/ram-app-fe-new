# stage 1

FROM node:16.10.0-alpine AS my-app-build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# stage 2

FROM nginx:alpine
COPY --from=my-app-build /app/dist/ram-fe /usr/share/nginx/html
EXPOSE 80
