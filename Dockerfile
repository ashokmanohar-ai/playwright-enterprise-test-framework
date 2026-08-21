FROM mcr.microsoft.com/playwright:v1.62.1-noble

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

ENV CI=true
ENTRYPOINT ["npm", "run"]
CMD ["test:smoke"]
