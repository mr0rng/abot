FROM node:17.6-alpine3.14

COPY ./target-docker/package.json /app/
WORKDIR /app/
RUN cd /app/ && npm install --production

COPY ./target-docker/ /app/

CMD [ "node", "index.js" ]