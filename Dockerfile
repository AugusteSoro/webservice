FROM node:8.11.1

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

ARG port=3000
ARG service=auth

COPY package.json ./
RUN yarn

COPY . .

ENV ENV_SERVICE=${service}
ENV PORT=${port}

EXPOSE ${port}

RUN [ -d /usr/src/app/storage ] || mkdir -p /usr/src/app/storage

CMD [ "node", "./bin/www" ]