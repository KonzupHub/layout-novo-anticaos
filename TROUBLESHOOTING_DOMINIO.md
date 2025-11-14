# Troubleshooting: ordem.konzuphub.com retornando JSON

## Problema

Ao acessar `https://ordem.konzuphub.com`, está aparecendo:
```json
{"ok":false,"error":"Rota não encontrada"}
```

Isso significa que o domínio está apontando para o **backend (Cloud Run)** em vez do **frontend (Cloudflare Pages)**.

---

## Diagnóstico

**Verificação realizada:**
- DNS aponta para IPs da Cloudflare (correto)
- Resposta HTTP é JSON do backend (incorreto)
- Deveria retornar HTML do frontend React

**Causa provável:**
O domínio `ordem.konzuphub.com` não está configurado corretamente na Cloudflare Pages, ou o frontend ainda não foi deployado.

---

## Solução Passo a Passo

### Passo 1: Verificar se o Frontend foi Deployado na Cloudflare Pages

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Vá em **Pages** > **Projects**
3. Procure pelo projeto do Ordem em Dia
4. Verifique se existe pelo menos um deploy concluído

**Se não houver projeto:**
- Siga o guia `DEPLOY_CLOUDFLARE_FRONTEND.md` para criar o projeto e fazer o primeiro deploy

**Se houver projeto mas sem deploy:**
- Faça o primeiro deploy seguindo o guia

---

### Passo 2: Verificar Domínio Customizado na Cloudflare Pages

1. No projeto Cloudflare Pages, vá em **Custom domains**
2. Verifique se `ordem.konzuphub.com` está listado
3. Verifique o status (deve estar "Active" ou "Valid")

**Se o domínio não estiver configurado:**
1. Clique em **Add custom domain**
2. Digite: `ordem.konzuphub.com`
3. Clique em **Continue**
4. Aguarde a validação (pode levar alguns minutos)

---

### Passo 3: Verificar DNS na Cloudflare

1. No Cloudflare Dashboard, vá em **DNS** > **Records** da zona `konzuphub.com`
2. Procure por um registro CNAME ou A para `ordem`

**O que deve existir:**
- **Tipo**: `CNAME`
- **Nome**: `ordem` (ou `ordem.konzuphub.com`)
- **Target**: Deve apontar para o projeto Pages (algo como `[projeto].pages.dev`)
- **Proxy status**: Proxied (laranja) ou DNS only (cinza)

**Se não existir ou estiver errado:**
1. Crie/edite o registro CNAME:
   - Nome: `ordem`
   - Target: A URL do seu projeto Pages (ex: `ordem-em-dia.pages.dev`)
   - Proxy: Habilitado (recomendado)
2. Salve e aguarde a propagação (alguns minutos)

---

### Passo 4: Verificar se há Redirecionamento ou Proxy Errado

Se o DNS estiver correto mas ainda apontar para o backend, pode haver:

1. **Page Rules configuradas incorretamente**
   - Vá em **Rules** > **Page Rules** na Cloudflare
   - Verifique se há regras para `ordem.konzuphub.com` que redirecionam para o Cloud Run
   - Remova ou corrija essas regras

2. **Workers ou Transform Rules**
   - Vá em **Workers & Pages** > **Workers** ou **Rules** > **Transform Rules**
   - Verifique se há workers ou regras interceptando requisições para `ordem.konzuphub.com`

---

### Passo 5: Limpar Cache da Cloudflare

Após corrigir a configuração:

1. Vá em **Caching** > **Configuration**
2. Clique em **Purge Everything** (ou apenas purge do domínio `ordem.konzuphub.com`)
3. Aguarde alguns minutos

---

## Checklist de Verificação

Após seguir os passos acima, verifique:

- [ ] Projeto criado no Cloudflare Pages
- [ ] Pelo menos um deploy concluído com sucesso
- [ ] Domínio customizado `ordem.konzuphub.com` configurado no projeto Pages
- [ ] Status do domínio customizado está "Active" ou "Valid"
- [ ] Registro CNAME correto no DNS apontando para o projeto Pages
- [ ] Nenhuma Page Rule redirecionando para o Cloud Run
- [ ] Cache limpo na Cloudflare

---

## Teste Final

Após corrigir tudo, teste:

```bash
curl -I https://ordem.konzuphub.com
```

**Deve retornar:**
- `Content-Type: text/html` (não `application/json`)
- Status `200` (não `404`)

E ao abrir no navegador, deve mostrar a landing page do Ordem em Dia, não JSON.

---

## Se o Problema Persistir

1. **Verifique os logs do Cloudflare Pages:**
   - No projeto Pages, vá em **Deployments**
   - Clique no deploy mais recente
   - Verifique os logs de build e runtime

2. **Verifique se o build está gerando arquivos:**
   - O build deve gerar arquivos na pasta `dist`
   - Deve haver um `index.html` na raiz do `dist`

3. **Teste a URL temporária do Pages:**
   - Acesse `https://[seu-projeto].pages.dev`
   - Se funcionar lá mas não no domínio customizado, o problema é na configuração do DNS/domínio

---

## Nota Importante

O backend continua funcionando em:
- `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app`

O frontend deve funcionar em:
- `https://ordem.konzuphub.com` (após configurar corretamente)

São serviços separados e o domínio `ordem.konzuphub.com` deve apontar para o **frontend**, não para o backend.

