FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent

COPY . .

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

EXPOSE 1337

CMD ["npm", "run", "develop"] 