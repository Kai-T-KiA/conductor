FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install crypto-js @types/crypto-js
RUN npm install lucide-react

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]