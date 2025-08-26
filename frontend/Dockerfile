FROM node:24-alpine AS deps
WORKDIR /portfolio
COPY portfolio/package*.json .
RUN npm install

FROM node:24-alpine AS builder
WORKDIR /portfolio
COPY --from=deps /portfolio/node_modules ./node_modules
COPY portfolio/src ./src
COPY portfolio/public ./public
COPY portfolio/package.json portfolio/next.config.mjs portfolio/postcss.config.mjs portfolio/jsconfig.json ./
RUN npm run build

FROM node:24-alpine
WORKDIR /portfolio
COPY --from=builder /portfolio/.next ./.next
COPY --from=builder /portfolio/public ./public
COPY --from=builder /portfolio/node_modules ./node_modules
COPY --from=builder /portfolio/package.json ./
CMD ["npm", "run", "start"]