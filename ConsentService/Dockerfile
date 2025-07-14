FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Prisma binaries and generation
RUN npx prisma generate

# Optional: Auto-migrate on build (or do it on container start)
# RUN npx prisma migrate deploy

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
