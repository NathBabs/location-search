FROM node:alpine AS builder

WORKDIR /app

# remove build folder if exists
RUN rm -rf /build

# copy package.json to /app
COPY package*.json ./

# install dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:alpine AS server

WORKDIR /app

COPY package*.json ./

COPY --from=builder ./app/build ./build


EXPOSE 3200

CMD ["npm", "run", "dev"]
