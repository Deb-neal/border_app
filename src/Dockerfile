FROM node:10 AS builder

WORKDIR /app

COPY package.json package-lock.json . ./

RUN npm ci
RUN npm run build

FROM node:10-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD npm run start:dev

