FROM node:22.21.1-alpine3.21 AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:22.21.1-alpine3.21  AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

CMD [ "node" , "dist/index.js"]