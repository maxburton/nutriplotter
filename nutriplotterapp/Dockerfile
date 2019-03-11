FROM node:ubuntu

ARG APP_DIR=/home/node/app
ENV APP_DIR=${APP_DIR}

RUN apk add git openjdk8 bash python make g++ --no-cache && \
		npm install -g --unsafe-perm expo-cli gulp-cli turtle-cli

RUN mkdir -p ${APP_DIR}/node_modules && chown -R node:node ${APP_DIR}

USER node

WORKDIR ${APP_DIR}
COPY package.json .

RUN npm install &&\
		npm install --only=dev

SHELL ["/bin/sh"]
