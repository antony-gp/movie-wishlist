FROM node:22-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

EXPOSE ${PORT}

CMD npm run start:$(if [ ${NODE_ENV} = 'development' ] ; then echo 'dev' ; else echo 'prod'; fi)