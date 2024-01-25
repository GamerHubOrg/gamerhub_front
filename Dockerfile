FROM node:20-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build:prod

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock

RUN yarn install --production --frozen-lockfile

RUN yarn global add vite@latest

EXPOSE 80

CMD ["yarn", "start"]