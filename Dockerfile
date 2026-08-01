# Build stage: usa a versão de Node exigida pelo projeto (ver "engines" em package.json) —
# outras versões podem quebrar o build do sass com um erro obscuro.
FROM node:18.19.1 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration production,docker

FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
