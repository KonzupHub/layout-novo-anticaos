# Checklist Firebase - Configuração para Produção

## 📋 Variáveis de Ambiente

### Frontend (`.env` na raiz)

Copie estas variáveis do Firebase Console após criar o app Web:

```env
VITE_API_BASE=https://konzup-hub-api-XXXXX.run.app/api
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=konzup-hub-XXXXX.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=konzup-hub-XXXXX
VITE_FIREBASE_STORAGE_BUCKET=konzup-hub-XXXXX.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Onde encontrar:**
1. Firebase Console → Project Settings → Your apps → Web app
2. Copie o objeto `firebaseConfig` que aparece na tela
3. Cole cada valor no `.env` correspondente

### Backend (`backend/.env`)

```env
PORT=8080
FIREBASE_PROJECT_ID=konzup-hub-XXXXX
GCLOUD_PROJECT=konzup-hub-XXXXX
GCS_BUCKET=konzup-hub-XXXXX.appspot.com
CORS_ORIGIN=https://ordem.konzuphub.com
LOCAL_STUB=false
NODE_ENV=production
```

**Onde encontrar:**
- `FIREBASE_PROJECT_ID` e `GCLOUD_PROJECT`: Mesmo ID do projeto Firebase
- `GCS_BUCKET`: Nome do bucket do Firebase Storage (geralmente `projeto-id.appspot.com`)
- `CORS_ORIGIN`: URL do frontend em produção
- `LOCAL_STUB`: **SEMPRE `false` em produção**

**Importante:** No Cloud Run, não precisa de `GOOGLE_APPLICATION_CREDENTIALS`. O serviço usa Application Default Credentials automaticamente.

## 🔧 Passos no Firebase Console

### 1. Criar Projeto
- Acesse https://console.firebase.google.com
- Clique em "Adicionar projeto"
- Nome: `konzup-hub` (ou o nome que preferir)
- Desative Google Analytics (ou ative se quiser)
- Clique em "Criar projeto"

### 2. Ativar Firestore
- No menu lateral, clique em "Firestore Database"
- Clique em "Criar banco de dados"
- Escolha "Iniciar no modo de produção"
- Escolha a região: **us-central1** (mesma do Cloud Run)
- Clique em "Ativar"

### 3. Ativar Authentication
- No menu lateral, clique em "Authentication"
- Clique em "Começar"
- Na aba "Sign-in method", ative "Email/Password"
- Clique em "Salvar"

### 4. Criar App Web
- No menu lateral, clique no ícone de engrenagem → "Configurações do projeto"
- Role até "Seus apps" → Clique no ícone `</>` (Web)
- Nome do app: `Konzup Hub Web`
- Marque "Também configure o Firebase Hosting para este app" (opcional)
- Clique em "Registrar app"
- **COPIE O OBJETO `firebaseConfig`** que aparece na tela
- Cole os valores no `.env` do frontend

### 5. Ativar Storage
- No menu lateral, clique em "Storage"
- Clique em "Começar"
- Aceite os termos e clique em "Avançar"
- Escolha a região: **us-central1**
- Clique em "Concluído"
- **COPIE O NOME DO BUCKET** (aparece no topo da tela)
- Cole no `GCS_BUCKET` do backend

## ✅ Verificações

Após preencher os `.env`:

- [ ] Frontend tem todas as 6 variáveis `VITE_FIREBASE_*` preenchidas
- [ ] Backend tem `FIREBASE_PROJECT_ID` e `GCLOUD_PROJECT` iguais
- [ ] Backend tem `GCS_BUCKET` com o nome do bucket do Storage
- [ ] Backend tem `LOCAL_STUB=false` (produção)
- [ ] Backend tem `CORS_ORIGIN` apontando para o domínio do frontend
- [ ] Firestore está ativo na região `us-central1`
- [ ] Authentication está ativo com Email/Password
- [ ] Storage está ativo na região `us-central1`

## 🚀 Próximos Passos

1. Preencher os `.env` com os valores acima
2. Fazer deploy do backend no Cloud Run
3. Atualizar `VITE_API_BASE` no frontend com a URL do Cloud Run
4. Fazer deploy do frontend (Firebase Hosting ou outro)
5. Atualizar `CORS_ORIGIN` no backend com a URL do frontend

