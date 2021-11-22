FROM node:16

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

RUN npm install -g pnpm && pnpm install
# If you are building your code for production
# RUN npm ci --only=production


EXPOSE 3000
CMD [ "pnpm", "presentar" ]
