# create a container for building the project
FROM node:lts-hydrogen AS builder
 
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# create a container for running the project
FROM node:lts-hydrogen AS deployment

WORKDIR /usr/app
COPY package*.json ./
RUN npm install --only=prod
COPY --from=builder /usr/app/build ./

WORKDIR /usr/app
EXPOSE 3000
CMD [ "node", "index.js" ]
