FROM node:18-slim AS development

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["nest", "start", "--watch", "--entryFile", "main"]

FROM node:18-slim AS production

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules 

CMD ["node", "dist/main"]