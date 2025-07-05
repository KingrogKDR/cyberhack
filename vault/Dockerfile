FROM node:20-alpine

WORKDIR /vault

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "src/index.js"]
