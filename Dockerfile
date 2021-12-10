# FROM node:current-alpine3.12 as common-build-stage
FROM node:latest as common-build-stage
WORKDIR /usr/local/app
ADD . .
RUN yarn set version berry 
RUN yarn install
RUN yarn build
RUN yarn prod:ipfs
COPY . .
EXPOSE 80

FROM common-build-stage as production-build-stage
ENV NODE_ENV production

CMD [ "node", "build/index.js" ]
