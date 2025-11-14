# ☁️ Cloudflare e Billing - Configuração

## 🤖 Sobre IA no Projeto

**✅ NÃO precisa de IA!**

Este projeto **NÃO usa nenhuma IA** (Gemini, OpenAI, Claude, etc.). Ele usa apenas:
- **Firebase Authentication** - para login/cadastro
- **Firestore** - banco de dados
- **Cloud Storage** - para armazenar PDFs
- **Cloud Run** - para hospedar o backend

Não há tokens de IA no código. O único token necessário é o do Firebase (já configurado no `.env`).

---

## 💳 Billing - Projeto Carbon

### Informações do Projeto
- **Projeto ID**: `carbon-bonsai-395917`
- **Billing Account ID**: `6132-7182-2655-7116`
- **Billing Account Name**: `Google Cloud 01B40C-01D702-2AD61B`

### ⚠️ IMPORTANTE: Não Criar Novo Projeto

Você quer usar o projeto **carbon-bonsai-395917** existente, não criar um novo.

### Como Adicionar o Sistema "Ordem em Dia" ao Projeto Carbon

1. **Verificar se o projeto já existe:**
   ```bash
   gcloud projects describe carbon-bonsai-395917
   ```

2. **Se o projeto não existir, criar dentro do billing correto:**
   ```bash
   gcloud projects create carbon-bonsai-395917 \
     --name="Konzup Carbon" \
     --billing-account=01B40C-01D702-2AD61B
   ```

3. **Configurar o projeto:**
   ```bash
   gcloud config set project carbon-bonsai-395917
   ```

4. **Habilitar billing (se ainda não estiver):**
   ```bash
   gcloud billing projects link carbon-bonsai-395917 \
     --billing-account=01B40C-01D702-2AD61B
   ```

5. **Criar um novo serviço Cloud Run dentro deste projeto:**
   ```bash
   # O serviço será criado como "ordem-em-dia-backend" ou similar
   # Mas dentro do projeto carbon-bonsai-395917
   ```

### ⚠️ ATENÇÃO: Firebase

O Firebase está configurado com o projeto `ordem-em-dia`. Você tem duas opções:

**Opção 1: Usar projeto Firebase separado (recomendado)**
- Manter Firebase no projeto `ordem-em-dia`
- Backend no Cloud Run no projeto `carbon-bonsai-395917`
- Backend acessa Firebase via Application Default Credentials

**Opção 2: Migrar tudo para carbon-bonsai-395917**
- Criar novo projeto Firebase dentro de `carbon-bonsai-395917`
- Atualizar todas as variáveis de ambiente
- Mais complexo, mas tudo em um lugar

---

## 🌐 Cloudflare - Configuração

### Passo 1: Configurar DNS no Cloudflare

1. Acesse o painel do Cloudflare
2. Selecione o domínio `konzuphub.com`
3. Vá em **DNS** → **Records**
4. Adicione um registro **CNAME**:
   - **Name**: `ordem` (ou `ordem.konzuphub.com`)
   - **Target**: `ghs.googlehosted.com`
   - **Proxy status**: 🟠 Proxied (laranja)

### Passo 2: Deploy no Cloud Run

Depois de fazer o deploy do backend no Cloud Run, você terá uma URL como:
```
https://ordem-em-dia-backend-XXXXX-uc.a.run.app
```

### Passo 3: Domain Mapping (no Terminal do MacBook)

**SIM, você faz isso no terminal do seu MacBook!**

Depois que:
1. ✅ O Cloud Run estiver rodando
2. ✅ O DNS do Cloudflare estiver configurado
3. ✅ O domínio `ordem.konzuphub.com` apontar para `ghs.googlehosted.com`

Execute este comando no terminal:

```bash
# Primeiro, configure o projeto
gcloud config set project carbon-bonsai-395917

# Depois, crie o domain mapping
gcloud beta run domain-mappings create \
  --service ordem-em-dia-backend \
  --domain ordem.konzuphub.com \
  --region us-central1
```

**⚠️ IMPORTANTE:**
- Substitua `ordem-em-dia-backend` pelo nome real do seu serviço Cloud Run
- O comando pode demorar alguns minutos
- O Google vai verificar se o DNS está configurado corretamente

### Passo 4: Verificar Domain Mapping

```bash
# Listar domain mappings
gcloud beta run domain-mappings list --region us-central1

# Ver detalhes
gcloud beta run domain-mappings describe ordem.konzuphub.com --region us-central1
```

### Passo 5: Atualizar CORS no Backend

Depois que o domain mapping estiver funcionando, atualize a variável `CORS_ORIGIN` no Cloud Run:

```bash
gcloud run services update ordem-em-dia-backend \
  --update-env-vars CORS_ORIGIN=https://ordem.konzuphub.com,http://localhost:5173 \
  --region us-central1
```

---

## 📋 Checklist Completo

### Antes do Deploy
- [ ] Projeto `carbon-bonsai-395917` existe e tem billing habilitado
- [ ] Billing account `01B40C-01D702-2AD61B` está vinculado
- [ ] Firebase configurado (projeto `ordem-em-dia` ou novo no carbon)
- [ ] APIs habilitadas no projeto carbon:
  - [ ] Cloud Build API
  - [ ] Cloud Run API
  - [ ] Artifact Registry API

### Deploy
- [ ] Backend deployado no Cloud Run (projeto carbon)
- [ ] Serviço Cloud Run está rodando e acessível
- [ ] Health check retorna `{ok: true}`

### DNS e Domain
- [ ] DNS no Cloudflare: `ordem.konzuphub.com` → `ghs.googlehosted.com`
- [ ] Domain mapping criado no Cloud Run
- [ ] `ordem.konzuphub.com` acessa o backend corretamente
- [ ] CORS atualizado com o novo domínio

### Frontend
- [ ] `.env` do frontend atualizado com URL do Cloud Run
- [ ] Frontend fazendo requisições corretamente
- [ ] Login e cadastro funcionando

---

## 🔗 Links Úteis

- [Cloud Run Domain Mapping](https://cloud.google.com/run/docs/mapping-custom-domains)
- [Cloudflare DNS](https://dash.cloudflare.com/)
- [Google Cloud Billing](https://console.cloud.google.com/billing)

---

## ❓ Dúvidas Frequentes

**P: Preciso criar um novo projeto Firebase?**
R: Depende. Se quiser tudo no projeto carbon, sim. Se preferir manter separado, use o `ordem-em-dia` existente.

**P: O domain mapping funciona imediatamente?**
R: Não, pode levar alguns minutos para propagar. O Google verifica o DNS primeiro.

**P: Posso usar o mesmo domínio para frontend e backend?**
R: Sim, mas precisa configurar rotas diferentes (ex: `api.ordem.konzuphub.com` para backend).

**P: O Cloudflare precisa de configuração especial?**
R: Não, apenas o CNAME apontando para `ghs.googlehosted.com` com proxy ativado.

