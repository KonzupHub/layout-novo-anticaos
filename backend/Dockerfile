FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY src ./src

# Build TypeScript
RUN npm run build

# Remover devDependencies após build para reduzir tamanho da imagem
RUN npm prune --production

# Expor porta (Cloud Run usa PORT do ambiente, mas EXPOSE ajuda na documentação)
EXPOSE 8080

# Comando de inicialização
CMD ["npm", "start"]
