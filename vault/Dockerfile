FROM node:20-alpine

WORKDIR /vault

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8963

CMD ["node", "dist/index.js"]
