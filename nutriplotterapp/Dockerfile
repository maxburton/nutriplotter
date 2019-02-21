FROM node:8.15.0-alpine
RUN apk add git openjdk8-jre bash python make g++ --no-cache
USER node
COPY package.json .
COPY package-lock.json .
RUN mkdir .node &&\
	echo "prefix = .node" > .npmrc &&\
	PATH="~/.node/bin:$PATH" &&\
	NODE_PATH="~/.node/lib/node_modules:$NODE_PATH" &&\
	source ~/.profile &&\
	npm install &&\
	npm install expo-cli gulp-cli turtle-cli