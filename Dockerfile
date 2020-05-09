FROM node:latest as node
WORkDIR /app
COPY . .
RUN npm i
RUN npm run build --prod

FROM nginx:alpine
COPY --from=node /app/dist/ /usr/share/nginx/html

