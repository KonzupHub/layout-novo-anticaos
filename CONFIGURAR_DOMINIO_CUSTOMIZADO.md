# Configurar Domínio Customizado ordem.konzuphub.com

## Status Atual

✅ **Frontend deployado e funcionando:**
- URL temporária: `https://anti-caos-konzup.pages.dev/`
- Site carregando corretamente (HTML, não JSON)

❌ **Domínio customizado ainda não configurado:**
- `ordem.konzuphub.com` ainda aponta para o backend (retorna JSON)

---

## Passo a Passo na Cloudflare

### Passo 1: Acessar o Projeto Pages

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. No menu lateral, clique em **Workers & Pages**
3. Clique em **Pages** (ou **Pages and Workers**)
4. Encontre o projeto **anti-caos-konzup** (ou o nome que você deu)
5. Clique no projeto para abrir

### Passo 2: Adicionar Domínio Customizado

1. Dentro do projeto, procure a aba **Custom domains** (ou **Domínios personalizados**)
2. Clique no botão **Set up a custom domain** (ou **Configurar domínio personalizado**)
3. Na caixa de texto, digite exatamente: `ordem.konzuphub.com`
4. Clique em **Continue** (ou **Continuar**)

### Passo 3: Aguardar Configuração Automática

A Cloudflare vai:
- Criar automaticamente o registro CNAME no DNS
- Configurar SSL automaticamente
- Validar o domínio

**Isso pode levar alguns minutos** (geralmente 2-5 minutos, mas pode levar até 24h em casos raros)

### Passo 4: Verificar Status

1. Na mesma tela de **Custom domains**, você verá `ordem.konzuphub.com` listado
2. O status pode aparecer como:
   - **Active** (verde) = ✅ Funcionando
   - **Pending** (amarelo) = ⏳ Aguardando validação
   - **Error** (vermelho) = ❌ Problema (veja mensagem de erro)

### Passo 5: Verificar DNS (Opcional - para confirmar)

1. No menu lateral, vá em **DNS** > **Records**
2. Procure por um registro com:
   - **Tipo**: `CNAME`
   - **Nome**: `ordem`
   - **Conteúdo/Target**: Deve apontar para `anti-caos-konzup.pages.dev` (ou similar)
   - **Proxy**: Proxied (laranja) ou DNS only (cinza)

**Se o registro não aparecer automaticamente**, você pode criar manualmente:
1. Clique em **Add record**
2. Configure:
   - Tipo: `CNAME`
   - Nome: `ordem`
   - Target: `anti-caos-konzup.pages.dev`
   - Proxy: Habilitado (recomendado)
3. Salve

---

## Testar Após Configurar

Após configurar e aguardar alguns minutos, teste:

```bash
curl -I https://ordem.konzuphub.com
```

**Deve retornar:**
- `Content-Type: text/html` (não `application/json`)
- Status `200` (não `404`)

E no navegador, deve mostrar a landing page do Ordem em Dia.

---

## Troubleshooting

### Se o domínio não funcionar após configurar:

1. **Aguarde mais tempo** (pode levar até 24h para SSL, geralmente menos)

2. **Limpe o cache da Cloudflare:**
   - Vá em **Caching** > **Configuration**
   - Clique em **Purge Everything**

3. **Verifique se há Page Rules conflitantes:**
   - Vá em **Rules** > **Page Rules**
   - Procure por regras que afetem `ordem.konzuphub.com`
   - Se houver regras redirecionando para o Cloud Run, remova ou ajuste

4. **Verifique os logs do Pages:**
   - No projeto Pages, vá em **Deployments**
   - Clique no deploy mais recente
   - Verifique se há erros

---

## Checklist Final

Após seguir os passos:

- [ ] Domínio customizado `ordem.konzuphub.com` adicionado no projeto Pages
- [ ] Status do domínio está "Active" ou "Pending"
- [ ] Registro CNAME criado no DNS (automaticamente ou manualmente)
- [ ] Aguardou alguns minutos para propagação
- [ ] Testou `https://ordem.konzuphub.com` e retorna HTML (não JSON)

---

## Nota Importante

- O backend continua em: `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app`
- O frontend estará em: `https://ordem.konzuphub.com` (após configurar)
- São serviços separados e o domínio deve apontar para o **frontend** (Pages), não para o backend

