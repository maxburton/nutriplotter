FROM node:8.15.0-alpine
WORKDIR /app
RUN mkdir -p /app &&\
	chown node:node /app &&\
	mkdir .node &&\
	echo "prefix = .node" > .npmrc &&\
	PATH="/app/.node/bin:$PATH" &&\
	NODE_PATH="/app/.node/lib/node_modules:$NODE_PATH"
RUN apk add git openjdk8-jre bash python make g++ --no-cache
USER node
COPY package.json .
COPY package-lock.json .
RUN npm install &&\
	npm install expo-cli gulp-cli turtle-cli