FROM node:20-slim

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
