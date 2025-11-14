# Troubleshooting: Tela Branca no Site

## Problema

O site está retornando tela branca tanto em:
- `https://anti-caos-konzup.pages.dev/`
- `https://ordem.konzuphub.com`

O HTML está sendo servido corretamente, mas o JavaScript não está renderizando.

---

## Causa Provável

**Variáveis de ambiente do Firebase não configuradas na Cloudflare Pages.**

O código em `src/lib/auth.tsx` tenta inicializar o Firebase usando variáveis `VITE_FIREBASE_*`. Se essas variáveis não estiverem configuradas, o Firebase falha ao inicializar e o React não consegue renderizar, resultando em tela branca.

---

## Solução: Configurar Variáveis de Ambiente na Cloudflare Pages

### Passo 1: Acessar Configurações do Projeto

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Vá em **Workers & Pages** > **Pages**
3. Clique no projeto **anti-caos-konzup**
4. Vá na aba **Settings** (Configurações)
5. Role até a seção **Environment variables** (Variáveis de ambiente)

### Passo 2: Adicionar Variáveis do Firebase

Adicione as seguintes variáveis para o ambiente **Production**:

| Variável | Onde encontrar |
|----------|---------------|
| `VITE_FIREBASE_API_KEY` | Firebase Console > Project Settings > General > Your apps > Web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Console > Project Settings > General > Your apps > Web app config |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Console > Project Settings > General |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Console > Project Settings > General > Your apps > Web app config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console > Project Settings > General > Your apps > Web app config |
| `VITE_FIREBASE_APP_ID` | Firebase Console > Project Settings > General > Your apps > Web app config |

**Importante:**
- Use os mesmos valores que estão no seu arquivo `.env` local
- Certifique-se de selecionar o ambiente **Production**
- **NÃO** adicione `VITE_API_BASE` (deixe vazio ou não adicione - o código usa o padrão do Cloud Run)

### Passo 3: Fazer Novo Deploy

Após adicionar as variáveis:

1. Vá na aba **Deployments**
2. Clique nos três pontos (`...`) no deploy mais recente
3. Clique em **Retry deployment** (ou faça um novo push para o GitHub)

Isso vai fazer um novo build com as variáveis de ambiente configuradas.

### Passo 4: Verificar Logs do Build

1. No deploy, clique para ver os detalhes
2. Verifique os logs do build
3. Procure por erros relacionados a:
   - Firebase initialization
   - Environment variables
   - Build errors

---

## Como Verificar se as Variáveis Estão Configuradas

### No Console do Navegador

1. Abra o site em modo de desenvolvimento (F12)
2. Vá na aba **Console**
3. Procure por erros como:
   - `Firebase: Error (auth/invalid-api-key)`
   - `Firebase: No Firebase App '[DEFAULT]' has been created`
   - `Uncaught Error: Firebase: ...`

### Verificar no Código

O código em `src/lib/auth.tsx` linha 17-24 tenta inicializar o Firebase:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  // ...
};
```

Se essas variáveis estiverem vazias (`''`), o Firebase não vai inicializar corretamente.

---

## Checklist de Verificação

- [ ] Variáveis `VITE_FIREBASE_*` adicionadas na Cloudflare Pages
- [ ] Ambiente **Production** selecionado ao adicionar variáveis
- [ ] Valores das variáveis estão corretos (mesmos do `.env` local)
- [ ] Novo deploy feito após adicionar variáveis
- [ ] Logs do build verificados (sem erros)
- [ ] Console do navegador verificado (sem erros de Firebase)

---

## Teste Após Configurar

Após configurar as variáveis e fazer novo deploy:

1. Aguarde o deploy completar (2-5 minutos)
2. Acesse `https://anti-caos-konzup.pages.dev/`
3. Abra o console do navegador (F12)
4. Verifique se não há erros
5. A landing page deve aparecer normalmente

---

## Se o Problema Persistir

1. **Verifique os logs do build:**
   - No projeto Pages, vá em **Deployments**
   - Clique no deploy mais recente
   - Veja os logs completos do build

2. **Verifique o console do navegador:**
   - Abra F12 > Console
   - Copie qualquer erro que aparecer
   - Isso vai ajudar a identificar o problema exato

3. **Teste localmente:**
   - Certifique-se de que o `.env` local tem todas as variáveis
   - Rode `npm run build` localmente
   - Veja se o build funciona sem erros

---

## Nota Importante

As variáveis de ambiente `VITE_*` são **embutidas no build** no momento da compilação. Isso significa que:

- Você precisa fazer um **novo deploy** após adicionar/modificar variáveis
- As variáveis não podem ser alteradas sem fazer um novo build
- O Vite substitui `import.meta.env.VITE_*` pelos valores reais durante o build

