# SPDX-License-Identifier: MIT
#
# Copyright (C) 2021 Olliver Schinagl <oliver@schinagl.nl>

FROM index.docker.io/library/alpine:latest AS builder

WORKDIR /src

COPY . /src/

RUN apk add --no-cache \
        nodejs-current \
        npm \
    && \
    npm install \
        --no-audit \
        --no-fund \
        --production \
        --verbose \
    && \
    unlink 'node_modules/eslint' && \
    mkdir -p 'node_modules/eslint/' && \
    cp -a 'bin/' 'conf/' 'lib/' 'messages/' 'package.json' \
       'node_modules/eslint' && \
    mkdir -p '/eslint' && \
    mv 'node_modules/' '/' && \
    node '/node_modules/eslint/bin/eslint.js' --version


FROM index.docker.io/library/alpine:latest

LABEL maintainer="Olliver Schinagl <oliver@schinagl.nl>"

RUN apk add --no-cache \
        nodejs-current \
        tini \
    && \
    addgroup -S 'eslint' && \
    adduser -D -G 'eslint' -h '/var/lib/eslint' -s '/bin/false' -S 'eslint' && \
    ln -f -n -s '/usr/local/lib/node_modules/eslint/bin/eslint.js' '/usr/local/bin/eslint'

COPY --from=builder "/node_modules/" "/usr/local/lib/node_modules"
COPY "./dockerfiles/docker-entrypoint.sh" "/init"

ENTRYPOINT [ "/init" ]

USER 'eslint'
