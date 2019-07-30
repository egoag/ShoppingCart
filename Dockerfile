FROM node:alpine

RUN mkdir -p /code

WORKDIR /code

COPY package.json /code

RUN apk add --no-cache python \
                       build-base && \
    npm install && \
    apk del build-base

COPY . /code

CMD ["npm", "start"]

