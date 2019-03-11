FROM ubuntu:18.04

ARG APP_DIR=/home/node/app
ENV APP_DIR=${APP_DIR}

RUN apt-get update && \
		apt-get install gnupg && \
		apt-get -y install curl && \
		curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
		curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
		install -y nodejs && \
		apt-get install git openjdk8 bash python make g++ --no-cache && \
		npm install -g --unsafe-perm expo-cli gulp-cli turtle-cli

RUN mkdir -p ${APP_DIR}/node_modules && chown -R node:node ${APP_DIR}

USER node

WORKDIR ${APP_DIR}
COPY package.json .

RUN npm install &&\
		npm install --only=dev

SHELL ["/bin/sh"]
