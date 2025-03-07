FROM node:14.0-alpine

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

EXPOSE 80

ENV MONGODB_USERNAME=admin
ENV MONGODB_PASSWORD=password
ENV MONGO_HOST=localhost

# Change from npm start to node app.js to avoid using nodemon in production
CMD ["node", "app.js"]
USER nobody