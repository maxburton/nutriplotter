FROM node:11.9-alpine

# install Alpine dependencies
RUN apk add git openjdk8-jre bash python make g++ --no-cache &&\
 		npm install expo-cli gulp-cli turtle-cli --global --unsafe-perm

USER node

WORKDIR /home/node/

COPY package.json .

# install NPM dependencies
RUN npm install &&\
		npm install --only=dev
