FROM node:18-alpine

WORKDIR .
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build
CMD npm start