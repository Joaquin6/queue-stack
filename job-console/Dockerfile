FROM node:10-alpine

RUN node -v \
  && yarn -v \
  && mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn

EXPOSE 3100

CMD [ "yarn", "dev" ]