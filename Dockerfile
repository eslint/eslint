FROM nodesource/wheezy:latest
MAINTAINER David Bruant <bruant.d@gmail.com>

ENV NODE_ENV dev

RUN mkdir /usr/code

WORKDIR /usr/code

RUN npm install eslint -g

# docker build -t eslint .
# docker run -t -v $PWD:/usr/code:ro eslint eslint .