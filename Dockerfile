
# dev
FROM node:16.14-alpine3.14 as development
EXPOSE 3000/tcp

WORKDIR /usr/src/app

COPY . .
RUN npm install && npm run build

# production
FROM node:16.14-alpine3.14 as production
EXPOSE 3000/tcp
ARG NPM_TOKEN
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . .
COPY --from=development /usr/src/app/dist ./dist

RUN npm install --only=production

RUN chown -R node:node /usr/src/app
USER node

CMD ["node", "dist/main"]

