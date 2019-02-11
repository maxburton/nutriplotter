FROM node:8.15.0-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN apk add git openjdk8-jre bash --no-cache