FROM node:24-alpine


WORKDIR /app/api

COPY package*.json ./
COPY api/ ./

RUN npm install



EXPOSE 3001

CMD ["node", "server.js"]
