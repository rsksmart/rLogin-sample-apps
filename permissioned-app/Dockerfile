FROM node:14
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn setup
COPY backend/index.js .
EXPOSE 3007
CMD ["node", "index.js"]

