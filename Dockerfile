# FROM node:14
# ENV CHROME_BIN="/usr/bin/chromium-browser" \
#     PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
# RUN set -x \
#     && apk update \
#     && apk upgrade \
#     && apk add --no-cache \
#     udev \
#     ttf-freefont \
#     chromium \
#     && npm install puppeteer@1.10.0


# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./


# RUN npm install
# # If you are building your code for production
# # RUN npm ci --only=production
# # Bundle app source
# COPY . .
# CMD [ "node", "pdf-generator.js" ]
# EXPOSE 8082


# FROM node:14-alpine

# ENV CHROME_BIN="/usr/bin/chromium-browser" \
#     NODE_ENV="production"
# RUN set -x \
#     && apk update \
#     && apk upgrade \
#     && apk add --no-cache \
#     dumb-init \
#     udev \
#     ttf-freefont \
#     chromium \
#     && npm install puppeteer-core@1.10.0 --silent \
#       \
#       # Cleanup
#       && apk del --no-cache make gcc g++ python binutils-gold gnupg libstdc++ \
#       && rm -rf /usr/include \
#       && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
#       && echo

FROM buildkite/puppeteer
COPY . /app

ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8

RUN cd /app && npm install --quiet
WORKDIR /app
CMD [ "node", "pdf-generator.js" ]
EXPOSE 8082