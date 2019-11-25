FROM node:latest

COPY . /certificate

WORKDIR /certificate

RUN npm install --production

EXPOSE 3000

CMD npm start
