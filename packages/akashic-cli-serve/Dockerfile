FROM node:21.7-slim as build

WORKDIR /app

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# Required files for the build
COPY package*.json ./
COPY www/ ./www/
COPY build/ ./build/
COPY src/ ./src/

# lerna 環境だと各リポジトリ内の package-lock.json が不整合を起こすため npm ci は使えない
RUN npm install

COPY . .
RUN npm prune --omit=dev

FROM node:21.7-slim

ENV TZ Asia/Tokyo
ENV LANG ja_JP.UTF-8

WORKDIR /app

COPY --from=build --chown=node:node /tini /tini

# Required files for startup
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/bin ./bin
COPY --from=build --chown=node:node /app/lib ./lib
COPY --from=build --chown=node:node /app/www ./www
COPY --from=build --chown=node:node /app/views ./views
COPY --from=build --chown=node:node /app/build ./build
COPY --from=build --chown=node:node /app/config ./config

USER node
EXPOSE 3300
ENTRYPOINT ["/tini", "--", "node", "bin/run"]
CMD ["/game"]
