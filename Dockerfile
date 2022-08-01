FROM node:16 AS builder

COPY package.json package-lock.json tsconfig.json vite.config.ts index.html ./
COPY src/ ./src/

RUN npm ci && npm run -s build


FROM node:16

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
