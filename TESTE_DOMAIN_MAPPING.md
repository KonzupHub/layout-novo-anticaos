# ✅ Domain Mapping Criado!

## Status Atual

✅ **Domain mapping criado com sucesso!**
- Domínio: `ordem.konzuphub.com`
- Serviço: `konzup-hub-backend`
- Região: `us-central1`

## ⏳ Aguardando SSL

O erro **525** que você está vendo é **normal** neste momento. Significa que:

1. ✅ O domain mapping foi criado
2. ✅ O DNS está configurado corretamente (apontando para Cloudflare)
3. ⏳ O Google está provisionando o certificado SSL

## 🔍 Como Verificar

### 1. Verificar Status do Domain Mapping

```bash
gcloud beta run domain-mappings list --region us-central1
```

### 2. Ver Detalhes

```bash
gcloud beta run domain-mappings describe ordem --region us-central1
```

Procure por:
- `status.conditions` - deve mostrar `Ready: True` quando estiver pronto
- `status.resourceRecords` - mostra os registros DNS necessários

### 3. Testar o Domínio

```bash
# Aguarde alguns minutos e teste:
curl -I https://ordem.konzuphub.com/api/health

# Quando funcionar, deve retornar:
# HTTP/2 200
# {"ok":true,"stub":false}
```

## ⏱️ Tempo de Espera

O provisionamento do SSL geralmente leva:
- **5-15 minutos** após criar o domain mapping
- Pode levar até **1 hora** em alguns casos

## 🔧 Se Ainda Não Funcionar Após 15 Minutos

### Verificar DNS no Cloudflare

1. Acesse: https://dash.cloudflare.com
2. Vá em **DNS** → **Records**
3. Verifique se existe:
   - **Type**: CNAME
   - **Name**: `ordem`
   - **Target**: `ghs.googlehosted.com`
   - **Proxy**: 🟠 Proxied (laranja)

### Verificar no Google Cloud

```bash
# Ver status detalhado
gcloud beta run domain-mappings describe ordem --region us-central1 --format="yaml"

# Verificar se o DNS está correto
dig ordem.konzuphub.com
```

## ✅ Quando Estiver Funcionando

Depois que o SSL for provisionado, você poderá:

1. **Testar a API:**
   ```bash
   curl https://ordem.konzuphub.com/api/health
   ```

2. **Atualizar CORS no Cloud Run:**
   ```bash
   gcloud run services update konzup-hub-backend \
     --update-env-vars CORS_ORIGIN=https://ordem.konzuphub.com,http://localhost:5173 \
     --region us-central1
   ```

3. **Atualizar frontend:**
   - No `.env` do frontend, adicione:
   ```env
   VITE_API_BASE=https://ordem.konzuphub.com/api
   ```

## 📝 Comandos Úteis

```bash
# Ver todos os domain mappings
gcloud beta run domain-mappings list --region us-central1

# Ver detalhes de um domain mapping
gcloud beta run domain-mappings describe ordem --region us-central1

# Deletar domain mapping (se precisar recriar)
gcloud beta run domain-mappings delete ordem --region us-central1

# Testar domínio
curl -v https://ordem.konzuphub.com/api/health
```

