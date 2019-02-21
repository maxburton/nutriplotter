FROM node:8.15.0-alpine
RUN mkdir -p /app &&\
	chown node:node /app
WORKDIR /app
USER node
COPY package.json .
COPY package-lock.json .
RUN apk add git openjdk8-jre bash --no-cache &&\
	apk add bash &&\
	npm install &&\
	npm install -g expo-cli &&\
	npm install -g gulp-cli &&\
	npm install -g turtle-cli