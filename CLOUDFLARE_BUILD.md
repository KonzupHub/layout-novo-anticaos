# Configuração de Build para Cloudflare Pages

## Gerenciador de Pacotes

**IMPORTANTE**: Este projeto usa **npm** como gerenciador de pacotes padrão, **NÃO Bun**.

A Cloudflare Pages deve usar `npm install` e `npm run build`, nunca `bun install`.

## Arquivo bun.lockb

O arquivo `bun.lockb` **NÃO deve ser commitado** no repositório, pois:

- Sua presença faz a Cloudflare detectar automaticamente o Bun
- A Cloudflare então tenta usar `bun install --frozen-lockfile`
- Isso causa erro porque o lockfile do Bun não está sincronizado com o `package.json`
- O build falha com: `"error: lockfile had changes, but lockfile is frozen"`

**Solução**: O arquivo `bun.lockb` foi removido do controle de versão e adicionado ao `.gitignore`.

## Configuração Recomendada na Cloudflare Pages

### Comando de Build

```
npm install && npm run build
```

**OU** (se a Cloudflare não detectar npm automaticamente):

```
corepack disable && NPM_CONFIG_LEGACY_PEER_DEPS=true npm install && npm run build
```

### Diretório de Saída

```
dist
```

### Variáveis de Ambiente

Certifique-se de que todas as variáveis `VITE_FIREBASE_*` estão configuradas no ambiente **Production**:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Consulte `FRONTEND_ENV_PROD.md` para mais detalhes.

## Verificação

Após configurar, verifique nos logs do build na Cloudflare que:

1. ✅ O comando executado é `npm install` (não `bun install`)
2. ✅ O build completa com sucesso
3. ✅ Os arquivos são gerados em `dist/`

## Troubleshooting

### Se a Cloudflare ainda usar Bun

1. Verifique se `bun.lockb` não está no repositório (deve estar no `.gitignore`)
2. Force o uso de npm no comando de build (veja comando acima)
3. Verifique se `package.json` tem `"packageManager": "npm@10.9.2"`

### Se o build falhar

1. Verifique os logs completos do build na Cloudflare
2. Confirme que todas as variáveis `VITE_FIREBASE_*` estão configuradas
3. Teste o build localmente com `npm install && npm run build`

## Notas

- O projeto usa Node.js 20 (definido em `.nvmrc`)
- O `package.json` especifica `"packageManager": "npm@10.9.2"`
- O arquivo `.npmrc` força o uso de npm
- Todos esses arquivos ajudam a garantir que npm seja usado, mas remover `bun.lockb` é essencial

