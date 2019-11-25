FROM node:latest

COPY . /validate

WORKDIR /validate

RUN npm install --production

EXPOSE 3000

CMD npm start
