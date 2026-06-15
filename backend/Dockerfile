FROM node:alpine AS build

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN npm install -g pnpm@10

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:alpine  AS production

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN npm install -g pnpm@10

RUN pnpm install 

COPY --from=build /app/dist ./dist

CMD [ "node" , "dist/index.js"]