FROM ubuntu:18.04

ARG APP_DIR=/home/node/app
ENV APP_DIR=${APP_DIR}

RUN apt-get update && \
		apt-get -y install gnupg && \
		apt-get -y install curl && \
		curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
		curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
		apt-get install -y nodejs && \
		apt-get install -y git openjdk-8-jdk bash python make g++


WORKDIR ${APP_DIR}
COPY package.json .

RUN npm install &&\
		npm install --only=dev
