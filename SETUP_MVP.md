# Setup MVP - Konzup Hub

## ✅ Mudanças Aplicadas

### Backend

1. ✅ **Rota de upload ajustada**: `/api/upload-csv/csv` → `/api/upload-csv`
2. ✅ **CORS configurado**: Restrito para `CORS_ORIGIN` (default: http://localhost:5173)
3. ✅ **Health check simplificado**: Retorna apenas `{ok: true}`
4. ✅ **Porta padrão**: Alterada de 3000 para 8080
5. ✅ **README criado**: Instruções de setup local e deploy

### Frontend

1. ✅ **Cliente API ajustado**: `VITE_API_BASE` default mudado para `http://localhost:8080/api`
2. ✅ **Upload CSV corrigido**: Agora usa `/api/upload-csv` (sem `/csv`)
3. ✅ **Badge "Ambiente de demonstração"**: Adicionado no Login e Dashboard Header

### Qualidade

1. ✅ **.gitignore atualizado**: Inclui `.env`, `.env.local` e `backend/.keys/`
2. ✅ **Script de testes criado**: `scripts/curl-exemplos.sh`

## 📝 Arquivos que Precisam ser Criados Manualmente

Devido ao `.gitignore`, você precisa criar estes arquivos manualmente:

### 1. `backend/.env.example`

Crie o arquivo com:
```
PORT=8080
FIREBASE_PROJECT_ID=
GCLOUD_PROJECT=
GCS_BUCKET=
CORS_ORIGIN=http://localhost:5173
GOOGLE_APPLICATION_CREDENTIALS=.keys/konzup-sa.json
NODE_ENV=development
```

### 2. `.env.example` (raiz do projeto - frontend)

Crie o arquivo com:
```
VITE_API_BASE=http://localhost:8080/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. `backend/.keys/` (pasta)

Crie a pasta e coloque sua service account JSON:
```bash
mkdir -p backend/.keys
# Copie o arquivo JSON da service account para:
# backend/.keys/konzup-sa.json
```

## 🚀 Próximos Passos para Rodar Localmente

### Backend

1. Copiar `.env.example` para `.env`:
   ```bash
   cd backend
   cp .env.example .env
   # Editar .env com suas credenciais
   ```

2. Instalar dependências:
   ```bash
   npm install
   ```

3. Configurar credenciais:
   ```bash
   mkdir -p .keys
   # Colocar arquivo JSON da service account em .keys/konzup-sa.json
   ```

4. Executar:
   ```bash
   npm run dev
   ```

### Frontend

1. Copiar `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   # Editar .env com suas credenciais do Firebase
   ```

2. Instalar dependências:
   ```bash
   npm install
   ```

3. Executar:
   ```bash
   npm run dev
   ```

## 🧪 Testar a API

Execute o script de testes:
```bash
chmod +x scripts/curl-exemplos.sh
./scripts/curl-exemplos.sh
```

Ou teste manualmente:
```bash
# Health check
curl http://localhost:8080/api/health

# Waitlist
curl -X POST http://localhost:8080/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com"}'
```

## 📋 Checklist Final

- [ ] Criar `backend/.env.example` (se não foi criado automaticamente)
- [ ] Criar `.env.example` na raiz (se não foi criado automaticamente)
- [ ] Criar `backend/.env` com suas credenciais
- [ ] Criar `.env` na raiz com suas credenciais Firebase
- [ ] Criar pasta `backend/.keys/` e colocar service account JSON
- [ ] Testar backend: `cd backend && npm run dev`
- [ ] Testar frontend: `npm run dev`
- [ ] Verificar se CORS está funcionando
- [ ] Testar endpoints com `scripts/curl-exemplos.sh`

## 🔍 Verificações Importantes

1. **CORS**: Backend deve aceitar requisições de `http://localhost:5173`
2. **Portas**: Backend na 8080, Frontend na 5173 (Vite default)
3. **Autenticação**: Login usa Firebase SDK, token enviado em `Authorization: Bearer`
4. **Rotas**: 
   - Upload CSV: `POST /api/upload-csv` (não `/api/upload-csv/csv`)
   - Health: `GET /api/health` retorna `{ok: true}`

