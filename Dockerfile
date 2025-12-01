FROM node:lts-alpine AS builder
WORKDIR /udachnii_client
COPY package*.json .
RUN npm ci


WORKDIR /udachnii_client
COPY --chown=node:node . .
RUN npm run build && npm prune --omit=dev
COPY --from=builder /udachnii_client/node_modules ./node_modules

WORKDIR /udachnii_client

COPY --from=builder /udachnii_client/public ./public
COPY --from=builder /udachnii_client/package.json ./package.json
COPY --from=builder /udachnii_client/.next ./.next
COPY --from=builder /udachnii_client/node_modules ./node_modules

EXPOSE 3001
CMD ["npm", "start"]