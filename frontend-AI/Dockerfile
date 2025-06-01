# frontend AI Dockerfile
FROM node:20-alpine

WORKDIR /src 
COPY . /src  
RUN apk update && apk upgrade && npm install  
RUN npm run build
EXPOSE 3000 

CMD ["npm", "run", "dev"]