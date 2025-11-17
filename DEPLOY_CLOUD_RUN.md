# Deploy do Backend no Google Cloud Run

## ⚠️ Pré-requisitos

1. **Billing habilitado** no projeto `ordem-em-dia`
2. **APIs habilitadas:**
   - Cloud Build API
   - Cloud Run API
   - Artifact Registry API

Para habilitar billing e APIs:
```bash
# Habilitar billing (faça no Console do Google Cloud)
# https://console.cloud.google.com/billing

# Depois habilite as APIs:
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com --project=ordem-em-dia
```

## Variáveis de Ambiente para Cloud Run

Configure estas variáveis no serviço Cloud Run:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `FIREBASE_PROJECT_ID` | `ordem-em-dia` | ID do projeto Firebase |
| `GCLOUD_PROJECT` | `ordem-em-dia` | ID do projeto Google Cloud |
| `GCS_BUCKET` | `ordem-em-dia.firebasestorage.app` | Nome do bucket do Firebase Storage |
| `CORS_ORIGIN` | (opcional) `https://ordem.konzuphub.com,https://anti-caos-konzup.pages.dev,http://localhost:5173` | Origens permitidas (separadas por vírgula). Se não definida, o código usa fallback padrão com domínios de produção. |
| `NODE_ENV` | `production` | Ambiente de produção |
| `LOCAL_STUB` | `false` | Desabilita modo stub em produção |
| `PORT` | `8080` | Porta do servidor (Cloud Run define automaticamente, mas incluímos para compatibilidade) |

**Nota sobre CORS_ORIGIN**: 
- Se não definida, o backend usa automaticamente um fallback padrão que inclui:
  - `http://localhost:5173` (desenvolvimento)
  - `https://ordem.konzuphub.com` (produção)
  - `https://anti-caos-konzup.pages.dev` (Cloudflare Pages)
  - Qualquer domínio terminando com `.pages.dev` (preview da Cloudflare)
- Se definida, aceita múltiplas origens separadas por vírgula
- Recomendado: deixar vazia para usar o fallback padrão, ou definir explicitamente se precisar de controle total

## Comandos para Deploy

### 1. Configurar projeto e região

```bash
gcloud config set project ordem-em-dia
gcloud config set run/region us-central1
```

### 2. Habilitar APIs necessárias

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 3. Criar Artifact Registry (se não existir)

```bash
gcloud artifacts repositories create konzup-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for Konzup Hub" \
  --project=ordem-em-dia
```

**Nota:** Se o repositório já existir, este comando falhará. Isso é normal, continue para o próximo passo.

### 4. Build e Push da imagem Docker usando Cloud Build

```bash
cd backend

# Build da imagem usando Cloud Build (recomendado)
gcloud builds submit --tag us-central1-docker.pkg.dev/ordem-em-dia/konzup-repo/konzup-hub-backend:latest \
  --project=ordem-em-dia

# Isso vai:
# 1. Fazer upload do código para Cloud Build
# 2. Executar o Dockerfile
# 3. Fazer push da imagem para Artifact Registry
```

**Alternativa com Docker local:**
Se você tiver Docker instalado localmente:
```bash
cd backend
docker build -t konzup-hub-backend .
docker tag konzup-hub-backend us-central1-docker.pkg.dev/ordem-em-dia/konzup-repo/konzup-hub-backend:latest
docker push us-central1-docker.pkg.dev/ordem-em-dia/konzup-repo/konzup-hub-backend:latest
```

### 5. Deploy no Cloud Run

```bash
gcloud run deploy konzup-hub-backend \
  --image us-central1-docker.pkg.dev/ordem-em-dia/konzup-repo/konzup-hub-backend:latest \
  --platform managed \
  --region us-central1 \
  --project ordem-em-dia \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars="FIREBASE_PROJECT_ID=ordem-em-dia,GCLOUD_PROJECT=ordem-em-dia,GCS_BUCKET=ordem-em-dia.firebasestorage.app,NODE_ENV=production,LOCAL_STUB=false"
```

**Explicação dos parâmetros:**
- `--allow-unauthenticated`: Permite acesso público (necessário para o frontend)
- `--memory 512Mi`: Memória alocada (ajuste se necessário)
- `--cpu 1`: 1 vCPU
- `--timeout 300`: Timeout de 5 minutos
- `--max-instances 10`: Máximo de instâncias simultâneas

### 6. Obter URL do serviço

```bash
gcloud run services describe konzup-hub-backend \
  --region us-central1 \
  --format="value(status.url)"
```

### 7. Testar health check

```bash
# Substitua URL_DO_SERVICO pela URL retornada acima
curl https://URL_DO_SERVICO/api/health
```

## Verificação Pós-Deploy

Após o deploy, verifique:

1. **Health Check:**
   ```bash
   curl https://[SERVICE_URL]/api/health
   ```
   Deve retornar: `{"ok":true,"stub":false}`

2. **Logs:**
   ```bash
   gcloud run services logs read konzup-hub-backend --region us-central1 --limit 50
   ```

3. **Variáveis de Ambiente:**
   ```bash
   gcloud run services describe konzup-hub-backend --region us-central1 --format="value(spec.template.spec.containers[0].env)"
   ```

## Troubleshooting

- Se o build falhar, verifique os logs: `gcloud builds list --limit=1`
- Se o serviço não iniciar, verifique os logs do Cloud Run
- Se houver erro de autenticação, verifique se o serviço tem permissões no Firebase

