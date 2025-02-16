FROM node:23.3.0

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 80

ENV MYENV=bdfsa
# VOLUME [ "/app/node_modules" ] - to prevent 'overriding' npm install via bind mount
# VOLUME [ "/app/temp" ] - may be specified at container start via '-v /app/temp'

CMD ["npm", "start"]

USER nobody