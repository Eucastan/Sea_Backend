FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npm run migrate:prod && npm run start:prod"]