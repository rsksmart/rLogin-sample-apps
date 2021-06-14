FROM node:14
WORKDIR /app
COPY backend/index.js .
COPY backend/package.json .
RUN yarn
EXPOSE 3007
CMD ["node", "index.js"]
