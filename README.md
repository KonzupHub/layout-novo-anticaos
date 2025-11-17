# Ordem em Dia - Konzup Hub

Sistema de gestão de pós-venda para incidentes aéreos em agências de turismo.

## 🚀 Tecnologias

Este projeto é construído com:

- **Frontend**: Vite + React + TypeScript + shadcn-ui + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: Google Cloud Firestore
- **Storage**: Google Cloud Storage
- **IA**: Google Vertex AI (Gemini)
- **Autenticação**: Firebase Auth
- **Deploy Frontend**: Cloudflare Pages
- **Deploy Backend**: Google Cloud Run

## 📋 Pré-requisitos

- Node.js 20+ (recomendado usar nvm)
- npm 10+
- Conta Google Cloud (para backend)
- Conta Cloudflare (para frontend)

## 🛠️ Instalação e Desenvolvimento

### Frontend

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Backend

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento (com stub)
npm run dev:stub

# Build
npm run build

# Iniciar em produção
npm start
```

### Desenvolvimento Full-Stack

```bash
# Na raiz do projeto, rodar frontend e backend juntos
npm run dev:all
```

## 🌐 URLs de Produção

- **Frontend**: https://ordem.konzuphub.com
- **Backend API**: https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api

## 📚 Documentação

- [Deploy do Backend no Cloud Run](./DEPLOY_CLOUD_RUN.md)
- [Deploy do Frontend na Cloudflare](./DEPLOY_CLOUDFLARE_FRONTEND.md)
- [Configuração de CORS](./backend/BACKEND_CORS.md)
- [Configuração de Build para Cloudflare](./CLOUDFLARE_BUILD.md)
- [Histórico de Integração de IA](./HISTORICO_IA.md)

## 🔧 Variáveis de Ambiente

### Frontend

Crie um arquivo `.env` na raiz do projeto:

```env
# Para desenvolvimento local, descomente:
# VITE_API_BASE=http://localhost:8080/api

# Em produção, VITE_API_BASE não precisa ser definida
# O código usa automaticamente a URL do Cloud Run

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Backend

Veja [DEPLOY_CLOUD_RUN.md](./DEPLOY_CLOUD_RUN.md) para variáveis de ambiente do backend.

## 📝 Estrutura do Projeto

```
.
├── src/              # Código do frontend React
├── backend/          # Código do backend Node.js
├── public/           # Arquivos estáticos (favicon, etc)
└── docs/             # Documentação adicional
```

## 🧪 Testes

```bash
# Testes do backend
cd backend
npm test
```

## 📦 Deploy

### Frontend (Cloudflare Pages)

Siga as instruções em [DEPLOY_CLOUDFLARE_FRONTEND.md](./DEPLOY_CLOUDFLARE_FRONTEND.md)

### Backend (Google Cloud Run)

Siga as instruções em [DEPLOY_CLOUD_RUN.md](./DEPLOY_CLOUD_RUN.md)

## 🤝 Contribuindo

Este é um projeto privado. Para contribuições, entre em contato com a equipe Konzup.

## 📄 Licença

Proprietário - Konzup Hub
