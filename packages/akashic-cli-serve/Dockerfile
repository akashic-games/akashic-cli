FROM node:26.13.1-slim@sha256:e6bedef217677b276c591795e169840edd9096dbf13f29df8ef8d1856b8820bc as build

WORKDIR /app

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# Required files for the build
COPY package*.json ./
COPY www/ ./www/
COPY build/ ./build/
COPY src/ ./src/
COPY .npmrc ./

# lerna 環境だと各リポジトリ内の package-lock.json が不整合を起こすため npm ci は使えない
RUN npm i && npm run setup && npm run build

COPY . .
RUN npm prune --omit=dev

FROM node:26.13.1-slim@sha256:e6bedef217677b276c591795e169840edd9096dbf13f29df8ef8d1856b8820bc

ENV TZ Asia/Tokyo
ENV LANG ja_JP.UTF-8

WORKDIR /app

# ワークアラウンド: 依存系の akashic-cli-commons などに shrinkwrap をつけている影響で、
# 明示的に amd64 向けの libc を入れないと Apple Sillicon 上で動作しない
ARG TARGETARCH
RUN if [ "$TARGETARCH" = "arm64" ]; then \
      dpkg --add-architecture amd64 && \
      apt-get update && \
      apt-get install -y --no-install-recommends libc6:amd64 && \
      rm -rf /var/lib/apt/lists/* ; \
    fi

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
ENTRYPOINT ["/tini", "--", "node", "bin/run.js"]
CMD ["/game"]
