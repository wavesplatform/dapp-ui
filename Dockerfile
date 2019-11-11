FROM node:10
WORKDIR /
COPY . / 
RUN npm install
RUN npm run build
EXPOSE 3000 
CMD ["npm", "start"]
