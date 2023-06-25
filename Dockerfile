FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN yarn install --network-timeout 1000000

COPY . .

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start:prod"]
