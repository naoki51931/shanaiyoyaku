# React用Dockerfile
FROM node:22.13.1
 
WORKDIR /usr/src/front
 
COPY ./front/package*.json ./
 
RUN npm install react-scripts

RUN npm install
 
COPY . .

#RUN  npm run build
 
EXPOSE 3000
 
CMD ["npx", "serve", "-s", "build", "-l", "3000"]