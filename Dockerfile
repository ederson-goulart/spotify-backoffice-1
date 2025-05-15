FROM node:22.15.0-alpine3.21 AS dev
ENV NODE_ENV=development
WORKDIR /app
COPY . .
RUN npm ci
EXPOSE 3000
CMD ["npm", "run", "dev"]