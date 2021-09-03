FROM node:14-alpine
WORKDIR /usr/src/index
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/index
USER node
CMD ["npm", "start"]
