FROM node:23-alpine3.20

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 3000

ENV MONGO_USERNAME=admin
ENV MONGO_PASSWORD=asssword
ENV MONGO_HOST=localhost
ENV MONGO_DATABASE=goals-dev

CMD ["npm", "start"]