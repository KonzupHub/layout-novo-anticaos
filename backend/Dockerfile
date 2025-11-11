FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY src ./src

# Build TypeScript
RUN npm run build

# Expor porta
EXPOSE 8080

# Comando de inicialização
CMD ["npm", "start"]
