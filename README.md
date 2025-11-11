# Konzup Hub - MVP

Sistema de gestão de pós-venda para incidentes aéreos (atrasos, cancelamentos, overbooking, mudanças de voo).

## Arquitetura Completa

### Visão Geral

O Konzup Hub é uma aplicação full-stack dividida em duas partes principais:

1. **Frontend (Lovable)**: Interface React desenvolvida e mantida no Lovable
2. **Backend (Cursor)**: API REST desenvolvida e mantida no Cursor/VS Code
3. **Sincronização**: Git sincroniza automaticamente entre ambos os ambientes

### Stack Tecnológico

#### Frontend
- **Framework**: React 18 + Vite
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui (Radix UI)
- **Roteamento**: React Router DOM
- **Estado**: React Query (TanStack Query)
- **Autenticação**: Firebase Web SDK
- **Build**: Vite (produção otimizada)

#### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Linguagem**: TypeScript
- **Deploy**: Google Cloud Run (containerizado)
- **Autenticação**: Firebase Admin SDK
- **Banco de Dados**: Google Cloud Firestore
- **Storage**: Google Cloud Storage (PDFs)
- **Processamento**: pdf-lib (PDFs), fast-csv (CSV)

### Fluxo de Trabalho Recomendado

1. **No Cursor/VS Code** (Backend):
   - Desenvolver APIs REST
   - Configurar banco de dados (Firestore)
   - Implementar autenticação
   - Criar serviços (PDF, CSV, Storage)
   - Testar endpoints localmente

2. **No Lovable** (Frontend):
   - Ajustar componentes React
   - Consumir APIs do backend
   - Implementar fluxos de UI/UX
   - Testar integração frontend-backend

3. **Git** (Sincronização):
   - Commits automáticos do Lovable
   - Pull/Push manual do Cursor
   - Branch `main` como fonte da verdade
   - Deploy contínuo quando necessário

### Arquitetura de Dados

#### Firestore Collections
- `agencies`: Dados das agências (CNPJ, nome, cidade)
- `users`: Usuários do sistema (vinculados a agências)
- `cases`: Casos de incidentes aéreos
- `waitlist`: Emails para early access/notificações

#### Estrutura de Casos
```typescript
{
  id: string;
  cnpj: string;
  passageiro: string;
  localizador: string;
  fornecedor: string;
  tipo: 'atraso' | 'cancelamento' | 'overbooking' | 'mudanca_voo';
  prazo: string;
  status: 'em_andamento' | 'aguardando_resposta' | 'documentacao_pendente' | 'encerrado';
  responsavel: { nome: string; avatar?: string };
  notas?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Segurança

- **Autenticação**: Firebase Auth (JWT tokens)
- **Autorização**: Middleware verifica token em rotas protegidas
- **CORS**: Configurado apenas para domínio do frontend
- **Firestore Rules**: Regras de segurança no banco
- **Cloud Storage**: URLs assinadas temporárias para PDFs

## Configuração do Projeto

### Pré-requisitos

- Node.js 20+
- npm ou yarn
- Conta Google Cloud com projeto configurado
- Firebase project criado
- Google Cloud Storage bucket criado

### Como criar arquivos .env

Antes de rodar o projeto, você precisa criar os arquivos de ambiente a partir dos templates:

#### Frontend:
```bash
cp FRONT_ENV_SAMPLE.md .env
# Ou copiar o conteúdo de FRONT_ENV_SAMPLE.md para .env
# Editar .env com suas credenciais do Firebase
```

#### Backend:
```bash
cd backend
cp BACKEND_ENV_SAMPLE.md .env
# Ou copiar o conteúdo de BACKEND_ENV_SAMPLE.md para .env
# Editar .env com suas credenciais do Google Cloud
```

**Importante:** Preencha todas as variáveis nos arquivos `.env` antes de executar os servidores.

### Setup Local

#### Backend

```bash
cd backend
npm install

# Criar arquivo .env a partir do template
cp BACKEND_ENV_SAMPLE.md .env
# Ou copiar conteúdo de BACKEND_ENV_SAMPLE.md para .env
# Preencher .env com suas credenciais do Google Cloud

npm run dev  # Desenvolvimento
npm run build  # Build para produção
npm start  # Executar build
```

Variáveis de ambiente necessárias no `backend/.env`:
- `PORT=8080`
- `FIREBASE_PROJECT_ID=seu-projeto-id`
- `GCLOUD_PROJECT=seu-projeto-id`
- `GCS_BUCKET=konzup-hub-pdfs`
- `CORS_ORIGIN=http://localhost:5173`
- `GOOGLE_APPLICATION_CREDENTIALS=.keys/konzup-sa.json` (apenas local)
- `NODE_ENV=development` (opcional)

#### Frontend

```bash
# Na raiz do projeto
npm install

# Criar arquivo .env a partir do template
cp FRONT_ENV_SAMPLE.md .env
# Ou copiar conteúdo de FRONT_ENV_SAMPLE.md para .env
# Preencher .env com suas credenciais do Firebase

npm run dev  # Servidor de desenvolvimento (porta padrão do Vite: 5173)
```

### Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication com Email/Password
3. Crie um banco Firestore em modo produção
4. Configure as regras de segurança do Firestore:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /agencies/{cnpj} {
         allow read: if request.auth != null;
         allow write: if false; // Apenas via Cloud Functions/Admin
       }
       match /users/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
       match /cases/{caseId} {
         allow read, write: if request.auth != null;
       }
       match /waitlist/{entry} {
         allow write: if false; // Apenas via Cloud Functions/Admin
         allow read: if request.auth != null && request.auth.token.admin == true;
       }
     }
   }
   ```

### Configuração do Google Cloud

1. Crie um Service Account no Google Cloud Console
2. Baixe o arquivo JSON de credenciais
3. Configure as permissões necessárias:
   - Firestore User
   - Storage Admin
   - Firebase Admin

4. Crie um bucket no Cloud Storage:
   ```bash
   gsutil mb gs://konzup-hub-pdfs
   ```

## Deploy no Cloud Run

### Backend

```bash
# Build da imagem Docker
cd backend
docker build -t gcr.io/SEU-PROJETO/konzup-hub-backend .

# Push para Google Container Registry
docker push gcr.io/SEU-PROJETO/konzup-hub-backend

# Deploy no Cloud Run
gcloud run deploy konzup-hub-backend \
  --image gcr.io/SEU-PROJETO/konzup-hub-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "PORT=8080,GCLOUD_PROJECT=SEU-PROJETO,FIREBASE_PROJECT_ID=SEU-PROJETO,GCS_BUCKET=konzup-hub-pdfs,CORS_ORIGIN=https://seu-dominio.com"
```

### Frontend

O frontend pode ser hospedado em:
- Vercel
- Netlify
- Google Cloud Storage + Cloud CDN
- Firebase Hosting

**Firebase Hosting:**

```bash
npm run build
firebase deploy --only hosting
```

Configure `VITE_API_BASE` para apontar para a URL do Cloud Run do backend.

## Funcionalidades do MVP

1. ✅ Waitlist - Cadastro de emails na landing page
2. ✅ Autenticação - Login e cadastro com Firebase Auth
3. ✅ CRUD de Casos - Criar, listar, atualizar casos
4. ✅ Geração de PDF - Relatórios de caso salvos no Cloud Storage
5. ✅ Upload CSV - Processamento de planilhas da consolidadora
6. ✅ Dashboard "Dia de Hoje" - Visualização de casos prioritários

## Endpoints da API

### Públicos (sem autenticação)
- `GET /api/health` - Health check
- `POST /api/waitlist` - Salvar email na waitlist
- `POST /api/early-access` - Cadastro de early access (landing page)
- `GET /api/cases/examples` - Retornar casos de exemplo para landing page

### Autenticados (requer token Bearer)
- `POST /api/auth/signup` - Criar conta
- `GET /api/cases` - Listar casos do usuário
- `POST /api/cases` - Criar novo caso
- `PATCH /api/cases/:id` - Atualizar caso existente
- `POST /api/cases/:id/pdf` - Gerar PDF do caso
- `POST /api/upload-csv` - Upload e processamento de CSV

## Estrutura do Projeto

```
.
├── backend/          # API Node.js + Express
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── types/
│   └── Dockerfile
├── src/              # Frontend React
│   ├── pages/
│   ├── components/
│   ├── lib/
│   └── types/
└── README.md
```

## Testes

```bash
cd backend
npm test  # Executa testes unitários
```

## Suporte

Para problemas ou dúvidas, consulte a documentação do Google Cloud e Firebase.