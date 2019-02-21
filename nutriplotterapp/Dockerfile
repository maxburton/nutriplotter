FROM node:8.15.0-alpine
RUN mkdir -p /app &&\
	chown node:node /app
WORKDIR /app
RUN apk add git openjdk8-jre bash --no-cache &&\
	apk add bash
USER node
COPY package.json .
COPY package-lock.json .
RUN npm install &&\
	npm install expo-cli gulp-cli turtle-cli