FROM node:18.12.1-alpine

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PATH:$PNPM_HOME
ENV PNPM_VERSION=8.3.1

RUN apk update \
  && apk upgrade \
  && apk add --no-cache curl \
  && curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm \
  && chmod +x /bin/pnpm

WORKDIR /usr/app

COPY ./apps/server/package.json .
COPY ./apps/server/pnpm-lock.yaml .

RUN pnpm i --frozen-lockfile --prod

COPY ./apps/server/prisma ./prisma

RUN pnpm prisma generate

COPY ./apps/client/dist/client ./static
COPY ./apps/server/dist .

CMD ["pnpm", "prisma", "migrate", "deploy", "&&", "node", "main.js"]
