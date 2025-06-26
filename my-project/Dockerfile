FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent

COPY src ./src
COPY config ./config
COPY database ./database
COPY public ./public

COPY .env* ./
COPY favicon.png ./

ENV NODE_ENV=production

EXPOSE 1337

CMD ["npm", "run", "develop"] 