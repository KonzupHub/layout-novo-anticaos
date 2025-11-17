# Configuração de CORS no Backend

## Domínios Permitidos

O backend está configurado para aceitar requisições dos seguintes domínios:

### Desenvolvimento
- `http://localhost:5173` - Frontend local

### Produção
- `https://ordem.konzuphub.com` - Domínio customizado principal
- `https://anti-caos-konzup.pages.dev` - URL padrão da Cloudflare Pages

### Preview da Cloudflare Pages
- Qualquer domínio que termine com `.pages.dev` (ex: `https://[hash]-[projeto].pages.dev`)

## Configuração

A configuração de CORS está no arquivo `backend/src/index.ts`, nas linhas 23-74.

### Como Funciona

1. **Variável de Ambiente `CORS_ORIGIN`**:
   - Se definida, usa o valor da variável (pode ser uma string única ou múltiplas origens separadas por vírgula)
   - Se não definida, usa o fallback padrão com os domínios listados acima

2. **Validação Dinâmica**:
   - O CORS verifica dinamicamente se a origem da requisição está na lista permitida
   - Permite requisições sem origin (ex: Postman, curl)
   - Permite automaticamente qualquer domínio `.pages.dev` (preview da Cloudflare)

3. **Credentials**:
   - `credentials: true` está habilitado para permitir cookies e headers de autenticação

## Exemplo de Configuração no Cloud Run

Para configurar múltiplas origens no Cloud Run, defina a variável de ambiente `CORS_ORIGIN`:

```bash
CORS_ORIGIN=https://ordem.konzuphub.com,https://anti-caos-konzup.pages.dev,http://localhost:5173
```

**Nota**: Se `CORS_ORIGIN` não estiver definida, o código usa automaticamente o fallback padrão que já inclui os domínios de produção.

## Troubleshooting

### Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"

Isso significa que o domínio de origem não está na lista permitida. Verifique:

1. Se o domínio está na lista de fallback padrão
2. Se a variável `CORS_ORIGIN` no Cloud Run inclui o domínio
3. Se o domínio de preview da Cloudflare termina com `.pages.dev` (será permitido automaticamente)

### Erro: "CORS policy: Credentials flag is true, but 'Access-Control-Allow-Credentials' header is missing"

Isso não deve acontecer, pois `credentials: true` está configurado. Se acontecer, verifique se o backend está usando a versão mais recente do código.

## Segurança

**IMPORTANTE**: A configuração atual permite domínios específicos conhecidos. Para maior segurança em produção:

1. Defina explicitamente `CORS_ORIGIN` no Cloud Run com apenas os domínios necessários
2. Remova o fallback padrão se quiser controle total via variável de ambiente
3. Considere adicionar autenticação nas rotas públicas se necessário

## Arquivos Relacionados

- `backend/src/index.ts` - Configuração principal de CORS (linhas 23-74)
- `DEPLOY_CLOUD_RUN.md` - Instruções de deploy incluindo variável `CORS_ORIGIN`

