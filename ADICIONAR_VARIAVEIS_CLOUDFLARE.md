# Adicionar Variáveis de Ambiente na Cloudflare Pages

## ⚠️ Problema

Tela branca no site porque as variáveis do Firebase não estão configuradas na Cloudflare Pages.

## ✅ Solução Rápida

### Passo 1: Acessar Configurações

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Workers & Pages** > **Pages**
3. Clique no projeto **anti-caos-konzup**
4. Aba **Settings** (Configurações)
5. Role até **Environment variables**

### Passo 2: Adicionar Variáveis (Production)

Clique em **Add variable** e adicione cada uma dessas:

| Nome da Variável | Valor |
|-----------------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCkHVgsaIjwuggNKIv9rpa4M50ODyuy3L4` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `ordem-em-dia.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `ordem-em-dia` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `ordem-em-dia.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `336386698724` |
| `VITE_FIREBASE_APP_ID` | `1:336386698724:web:82c7283acb674603ac6bf1` |

**IMPORTANTE:**
- Selecione o ambiente **Production** ao adicionar cada variável
- **NÃO** adicione `VITE_API_BASE` (deixe vazio - o código usa o padrão)

### Passo 3: Fazer Novo Deploy

Após adicionar todas as variáveis:

1. Vá na aba **Deployments**
2. Clique nos três pontos (`...`) no deploy mais recente
3. Clique em **Retry deployment** (ou faça um novo push no GitHub)

**OU** simplesmente faça um novo commit e push:
```bash
git commit --allow-empty -m "Trigger rebuild with env vars"
git push
```

### Passo 4: Aguardar e Testar

1. Aguarde o deploy completar (2-5 minutos)
2. Acesse `https://anti-caos-konzup.pages.dev/`
3. A landing page deve aparecer normalmente

---

## Checklist

- [ ] Todas as 6 variáveis `VITE_FIREBASE_*` adicionadas
- [ ] Ambiente **Production** selecionado
- [ ] Novo deploy feito (retry ou novo push)
- [ ] Site funcionando sem tela branca

---

## Por que isso acontece?

O código em `src/lib/auth.tsx` precisa das variáveis do Firebase para inicializar. Se elas não estiverem configuradas na Cloudflare Pages, o Firebase falha e o React não consegue renderizar, resultando em tela branca.

As variáveis `VITE_*` são **embutidas no build** - por isso você precisa fazer um novo deploy após adicioná-las.

