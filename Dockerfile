FROM node:16 AS builder

COPY package.json package-lock.json tsconfig.json vite.config.ts index.html ./
COPY src/ ./src/

RUN npm ci && npm run -s build


FROM node:16

LABEL org.opencontainers.image.title="GitHub Dashboard" \
      org.opencontainers.image.vendor="Konstantin Möllers" \
      org.opencontainers.image.description="A web app which displays open pull requests of an organisation with customisable filters."

WORKDIR /app
COPY --from=builder dist/ /app/dist/
COPY package.json package-lock.json tsconfig.json /app/
COPY src/ /app/src/

ENV HTTP_PORT=8080 \
    GITHUB_TOKEN="" \
    GITHUB_ORG="" \
    FILTERS="[]"

RUN npm ci --omit=dev

EXPOSE 8080
CMD npm run -s start:prod
