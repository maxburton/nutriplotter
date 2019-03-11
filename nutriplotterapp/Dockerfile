FROM circleci/node:8.12

ARG APP_DIR=/home/node/app
ENV APP_DIR=${APP_DIR}

RUN echo "deb http://http.debian.net/debian jessie-backports main" | sudo tee --append /etc/apt/sources.list
RUN sudo apt-get update
RUN sudo apt-get install -t jessie-backports openjdk-8-jdk
RUN apt-get install -y git bash python make g++

RUN mkdir -p ${APP_DIR}/node_modules && chown -R ubuntu ${APP_DIR}

USER ubuntu

WORKDIR ${APP_DIR}
COPY package.json .

RUN npm install &&\
		npm install --only=dev

SHELL ["/bin/sh"]
