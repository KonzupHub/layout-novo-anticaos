# Konzup Hub - Backend API

API REST para gestão de casos de incidentes aéreos.

## Setup Local

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
# Editar .env com suas credenciais do Google Cloud
```

3. Configurar credenciais do Google Cloud:
```bash
mkdir -p .keys
# Colocar arquivo JSON da service account em .keys/konzup-sa.json
```

4. Executar em desenvolvimento:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:8080`

## Deploy no Google Cloud Run

1. Build da imagem Docker:
```bash
docker build -t gcr.io/SEU-PROJETO/konzup-hub-backend .
```

2. Push para Google Container Registry:
```bash
docker push gcr.io/SEU-PROJETO/konzup-hub-backend
```

3. Deploy no Cloud Run:
```bash
gcloud run deploy konzup-hub-backend \
  --image gcr.io/SEU-PROJETO/konzup-hub-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "PORT=8080,FIREBASE_PROJECT_ID=SEU-PROJETO,GCLOUD_PROJECT=SEU-PROJETO,GCS_BUCKET=konzup-hub-pdfs,CORS_ORIGIN=https://seu-dominio.com"
```

**Nota:** No Cloud Run, não é necessário configurar `GOOGLE_APPLICATION_CREDENTIALS` pois ele usa Application Default Credentials automaticamente.

## Variáveis de Ambiente

- `PORT`: Porta do servidor (default: 8080)
- `FIREBASE_PROJECT_ID`: ID do projeto Firebase
- `GCLOUD_PROJECT`: ID do projeto Google Cloud
- `GCS_BUCKET`: Nome do bucket do Cloud Storage para PDFs
- `CORS_ORIGIN`: Origem permitida para CORS (ex: http://localhost:5173)
- `GOOGLE_APPLICATION_CREDENTIALS`: Caminho para credenciais (apenas local, ex: .keys/konzup-sa.json)

## Endpoints

- `POST /api/waitlist` - Cadastrar email na waitlist (sem autenticação)
- `POST /api/auth/signup` - Criar conta (sem autenticação)
- `GET /api/cases` - Listar casos (autenticado)
- `POST /api/cases` - Criar caso (autenticado)
- `PATCH /api/cases/:id` - Atualizar caso (autenticado)
- `POST /api/cases/:id/pdf` - Gerar PDF do caso (autenticado)
- `POST /api/upload-csv` - Upload e processamento de CSV (autenticado)
- `GET /api/health` - Health check

## Respostas da API

Todas as respostas seguem o formato:
- Sucesso: `{ ok: true, data: ... }`
- Erro: `{ ok: false, error: "mensagem em português" }`

## Autenticação

Os endpoints protegidos requerem um header:
```
Authorization: Bearer <ID_TOKEN_DO_FIREBASE>
```

O ID token é obtido no frontend após login com Firebase Auth.

