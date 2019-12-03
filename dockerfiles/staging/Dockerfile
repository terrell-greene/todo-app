FROM node:10.15.1

WORKDIR /usr/src/app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn install --quiet

COPY ./dist ./
COPY ./src/client ./client
COPY ./src/generated.ts ./generated.ts

RUN yarn build:client

CMD ["/bin/bash"]