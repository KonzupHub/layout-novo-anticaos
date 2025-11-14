# Solução: Forçar npm na Cloudflare Pages

## Problema

A Cloudflare Pages está detectando Bun e tentando usar `bun install` mesmo com `.nvmrc` configurado.

## Solução: Modificar Comando de Build

O comando de build precisa forçar explicitamente o uso de npm, ignorando a detecção automática do Bun.

### Na Cloudflare Pages, altere o comando de build para:

```bash
corepack disable && npm install && npm run build
```

OU

```bash
which npm && npm install && npm run build
```

OU (mais simples e direto):

```bash
/usr/bin/npm install && /usr/bin/npm run build
```

## Passo a Passo

1. Acesse: Cloudflare Dashboard > Pages > anti-caos-konzup > Settings
2. Vá em "Builds & deployments"
3. Altere o **Build command** para:
   ```
   corepack disable && npm install && npm run build
   ```
4. Salve
5. Faça novo deploy

## Por Que Isso Funciona

- `corepack disable` desabilita o Corepack (que gerencia Bun/Yarn/pnpm)
- Isso força o uso do npm padrão do sistema
- O npm está sempre disponível no ambiente da Cloudflare

## Alternativa: Usar Variável de Ambiente

Se preferir, pode adicionar uma variável de ambiente:
- Nome: `NPM_CONFIG_LEGACY_PEER_DEPS`
- Valor: `true`

Mas a solução do comando é mais direta.

