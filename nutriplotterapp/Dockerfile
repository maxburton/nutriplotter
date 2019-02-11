FROM node:8.15.0-alpine
COPY package.json .
COPY package-lock.json .
RUN apk add git openjdk8-jre --no-cache &&\ 
	npm install &&\ 
	npm install -g expo-cli turtle-cli gulp-cli
	