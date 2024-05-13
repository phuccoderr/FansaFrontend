FROM node:22-alpine as BUILD_IMAGE
WORKDIR /app/react-app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:22-alpine as PRODUCTION_IMAGE

WORKDIR /app/react-app

COPY --from=BUILD_IMAGE /app/react-app/dist/ /app/react-app/dist/
EXPOSE 3001
COPY package.json .
COPY vite.config.ts .

RUN npm install typescript --legacy-peer-deps

CMD [ "npm","run","preview" ]

