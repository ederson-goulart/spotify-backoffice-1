FROM node:22.15.0-alpine3.21 AS build
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}


ARG MINIO_ENDPOINT_INTERNAL
ENV MINIO_ENDPOINT_INTERNAL=${MINIO_ENDPOINT_INTERNAL}

ARG MINIO_ACCESS_KEY
ENV MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}

ARG MINIO_SECRET_KEY
ENV MINIO_SECRET_KEY=${MINIO_SECRET_KEY}

COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22.15.0-alpine3.21 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/generated ./generated
COPY --from=build /app/src ./src
EXPOSE 3000
CMD ["npm", "run", "start"]