# React用Dockerfile
FROM node:20
 
WORKDIR /usr/src/front
 
COPY ./package*.json ./
 
RUN npm install react-scripts

RUN npm install
 
COPY . .

RUN  npm run build
 
EXPOSE 3000
 
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
