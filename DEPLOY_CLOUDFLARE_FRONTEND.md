# Deploy do Frontend na Cloudflare Pages

Este guia explica como fazer o deploy do frontend do Ordem em Dia na Cloudflare Pages usando o subdomínio `ordem.konzuphub.com`.

## Pré-requisitos

1. Conta na Cloudflare com a zona `konzuphub.com` já configurada
2. Repositório do código no GitHub (ou outro suportado pela Cloudflare Pages)
3. Acesso ao Firebase Console para obter as credenciais

## Passo 1: Criar Projeto no Cloudflare Pages

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Vá em **Pages** > **Create a project**
3. Conecte seu repositório (GitHub, GitLab, etc.)
4. Selecione o repositório `anti-caos-konzup-main`

## Passo 2: Configurar Build Settings

Na tela de configuração do projeto, configure:

- **Project name**: `ordem-em-dia` (ou outro nome de sua preferência)
- **Production branch**: `main` (ou a branch principal do seu repo)
- **Build command**: 
  ```bash
  npm install && npm run build
  ```
- **Build output directory**: 
  ```
  dist
  ```
- **Root directory**: 
  ```
  / (raiz do repositório)
  ```

## Passo 3: Configurar Variáveis de Ambiente

Na seção **Environment variables**, adicione as seguintes variáveis para o ambiente **Production**:

| Variável | Valor | Onde encontrar |
|----------|-------|---------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCkHVgsaIjwuggNKIv9rpa4M50ODyuy3L4` | Firebase Console > Project Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | `ordem-em-dia.firebaseapp.com` | Firebase Console > Project Settings |
| `VITE_FIREBASE_PROJECT_ID` | `ordem-em-dia` | Firebase Console > Project Settings |
| `VITE_FIREBASE_STORAGE_BUCKET` | `ordem-em-dia.firebasestorage.app` | Firebase Console > Project Settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `336386698724` | Firebase Console > Project Settings |
| `VITE_FIREBASE_APP_ID` | `1:336386698724:web:82c7283acb674603ac6bf1` | Firebase Console > Project Settings |
| `VITE_API_BASE` | *(deixe vazio ou não adicione)* | Usará o padrão: `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api` |

**Importante**: 
- Não adicione `VITE_API_BASE` ou deixe vazio para usar o backend em produção automaticamente
- Os valores acima são exemplos - use os valores reais do seu projeto Firebase

## Passo 4: Fazer o Primeiro Deploy

1. Clique em **Save and Deploy**
2. Aguarde o build completar (pode levar alguns minutos)
3. Verifique se o build foi bem-sucedido na aba **Deployments**

## Passo 5: Configurar Domínio Customizado

1. No projeto Cloudflare Pages, vá em **Custom domains**
2. Clique em **Set up a custom domain**
3. Digite: `ordem.konzuphub.com`
4. Clique em **Continue**
5. A Cloudflare irá:
   - Criar automaticamente um registro CNAME apontando para o projeto Pages
   - Configurar SSL automaticamente (pode levar alguns minutos)

## Passo 6: Verificar Configuração DNS

Após configurar o domínio customizado, verifique na Cloudflare:

1. Vá em **DNS** > **Records** da zona `konzuphub.com`
2. Deve existir um registro CNAME:
   - **Name**: `ordem`
   - **Target**: `[seu-projeto].pages.dev` (gerado automaticamente)
   - **Proxy status**: Proxied (laranja) ou DNS only (cinza)

**Nota**: Se o registro não aparecer automaticamente, você pode criar manualmente:
- Tipo: `CNAME`
- Nome: `ordem`
- Target: `[seu-projeto].pages.dev`
- Proxy: Habilitado (recomendado)

## Passo 7: Aguardar Propagação e SSL

1. Aguarde alguns minutos para a propagação DNS
2. Aguarde a configuração automática do SSL (pode levar até 24h, geralmente menos)
3. Verifique o status do SSL em **SSL/TLS** > **Overview** na Cloudflare

## Passo 8: Testar o Deploy

1. Acesse `https://ordem.konzuphub.com` no navegador
2. Verifique se a landing page carrega corretamente
3. Teste o login/cadastro (deve conectar ao Firebase)
4. Teste criar um caso e gerar PDF (deve chamar o backend no Cloud Run)

## Checklist Final

- [ ] Projeto criado no Cloudflare Pages
- [ ] Build settings configurados (comando: `npm install && npm run build`, output: `dist`)
- [ ] Variáveis de ambiente `VITE_FIREBASE_*` configuradas
- [ ] `VITE_API_BASE` deixado vazio (ou não adicionado)
- [ ] Primeiro deploy concluído com sucesso
- [ ] Domínio customizado `ordem.konzuphub.com` configurado
- [ ] Registro CNAME criado na zona DNS
- [ ] SSL configurado e ativo
- [ ] Site acessível em `https://ordem.konzuphub.com`
- [ ] Frontend conectando ao backend em `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api`

## Troubleshooting

### Build falha
- Verifique os logs na aba **Deployments**
- Confirme que todas as variáveis `VITE_FIREBASE_*` estão configuradas
- Verifique se o comando de build está correto

### Erro de CORS no navegador
- Verifique se o backend tem `https://ordem.konzuphub.com` na variável `CORS_ORIGIN`
- Veja `DEPLOY_CLOUD_RUN.md` para atualizar as variáveis do Cloud Run

### Domínio não resolve
- Aguarde a propagação DNS (pode levar até 48h, geralmente menos)
- Verifique se o registro CNAME está correto na Cloudflare

### SSL não funciona
- Aguarde a configuração automática (pode levar até 24h)
- Verifique se o proxy está habilitado no registro DNS
- Em **SSL/TLS** > **Overview**, verifique o status do certificado

## Notas Importantes

- O frontend automaticamente usa `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api` como URL da API se `VITE_API_BASE` não estiver definida
- O backend já está configurado para aceitar requisições de `https://ordem.konzuphub.com` (após atualizar o CORS)
- Não é necessário configurar nada no código - apenas as variáveis de ambiente na Cloudflare

