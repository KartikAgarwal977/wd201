FROM --platform=$BUILDPLATFORM node:lts-alpine as base

# Set the working directory in the container
WORKDIR /app

COPY package*.json /
EXPOSE 3000

FROM  base AS production
ENV  NODE_ENV=production
RUN  npm install 
COPY . /app
CMD  node index.js

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install 
COPY . /app
CMD  npm run start
