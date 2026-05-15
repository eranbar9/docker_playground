ARG NODE_VERSION=26

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app/

COPY ./.npmrc /app/
COPY ./package.json /app/
COPY ./package-lock.json /app/

#RUN npm install
RUN npm ci --omit=dev

FROM node:${NODE_VERSION}-alpine

ENV PORT=3000

WORKDIR /app/

COPY --from=builder /app/node_modules ./node_modules

COPY ./backend/ /app/backend/

USER node

ENTRYPOINT ["node"]

CMD ["./backend/server.js"]