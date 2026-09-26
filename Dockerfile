FROM node:22-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node src ./src
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node migrations ./migrations

USER node

CMD ["node", "."]
