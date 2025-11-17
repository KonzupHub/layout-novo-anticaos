# Plano de Rollback Seletivo - Integração de IA

## Contexto

Este documento descreve duas opções de rollback caso seja necessário remover ou desativar a integração de IA (Vertex AI Gemini) do projeto Ordem em Dia.

**Commit base (sem IA)**: `451c27e` - "fix: restaurar backend completo e Firebase após pull do Lovable"  
**Branch de proteção criada**: `ordem-em-dia-ia-atual` (contém o estado atual com IA)

---

## Opção A: Manter IA e Corrigir Ambiente/Configuração

### Descrição

Manter todo o código atual com IA e focar em resolver problemas de ambiente e configuração de deploy na Cloudflare.

### Por que esta opção é a mais segura?

1. ✅ **Build local passa sem erros**
   - `npm run build` funciona perfeitamente
   - Não há erros de compilação TypeScript
   - Não há dependências faltando

2. ✅ **IA não afeta o frontend**
   - Nenhum componente React usa a IA
   - O frontend não importa código relacionado à IA
   - Remover a IA não resolveria problemas do frontend

3. ✅ **IA está isolada no backend**
   - Toda a lógica está em arquivos específicos
   - Não altera comportamento de rotas existentes
   - Não quebra funcionalidades atuais

4. ✅ **Problema é de ambiente, não de código**
   - O erro na Cloudflare Pages é relacionado a:
     - Variáveis de ambiente não configuradas
     - Build command incorreto
     - Cloudflare usando Bun em vez de npm
   - Nenhum desses problemas está relacionado à IA

### Ações Recomendadas

1. **Configurar variáveis de ambiente na Cloudflare Pages**
   - Adicionar todas as variáveis `VITE_FIREBASE_*` listadas em `FRONTEND_ENV_PROD.md`
   - Garantir que estão no ambiente **Production**

2. **Corrigir build command na Cloudflare**
   - Usar: `corepack disable && NPM_CONFIG_LEGACY_PEER_DEPS=true npm install && npm run build`
   - Output directory: `dist`

3. **Verificar logs do build**
   - Identificar erro específico nos logs da Cloudflare
   - Corrigir baseado no erro encontrado

### Prós

- ✅ Mantém funcionalidade de IA disponível
- ✅ Não requer mudanças de código
- ✅ Resolve o problema real (ambiente/configuração)
- ✅ Não introduz riscos de quebrar código existente

### Contras

- ⚠️ Pode levar tempo para identificar e corrigir problema de ambiente
- ⚠️ Requer acesso à Cloudflare Dashboard

---

## Opção B: Rollback Parcial em Branch de Experimentação

### Descrição

Criar uma branch de experimento removendo apenas os arquivos de IA do backend, mantendo todas as outras melhorias.

### Quando considerar esta opção?

- ❌ **NÃO recomendado** se o build local passa (que é o caso atual)
- ✅ Apenas se houver evidência clara de que a IA está causando erro de build ou execução
- ✅ Apenas para teste/experimentação, não para produção

### Arquivos que seriam removidos/alterados

1. **Remover arquivos novos**:
   - `backend/src/services/gemini.ts`
   - `backend/src/routes/ia.ts`
   - `backend/IA_GEMINI.md`
   - `backend/keys/carbon-bonsai-395917-16f679bb2e29.json` (já deveria estar no .gitignore)

2. **Reverter mudanças em arquivos existentes**:
   - `backend/src/index.ts`: Remover import e rota de IA
   - `backend/package.json`: Remover dependência `@google-cloud/vertexai`

### Comandos Git (NÃO EXECUTAR - Apenas para referência)

```bash
# 1. Criar branch de experimento a partir do commit sem IA
git checkout -b experimento-rollback-ia 451c27e

# 2. Aplicar apenas mudanças não relacionadas à IA
# (Isso seria complexo e manual, não recomendado)

# OU: Criar branch a partir do estado atual e remover IA manualmente
git checkout -b experimento-rollback-ia
git rm backend/src/services/gemini.ts
git rm backend/src/routes/ia.ts
git rm backend/IA_GEMINI.md

# Editar backend/src/index.ts para remover:
# - import iaRouter from './routes/ia.js';
# - app.use('/api/ia', iaRouter);

# Editar backend/package.json para remover:
# - "@google-cloud/vertexai": "^1.0.0"

# Commit das mudanças
git add -A
git commit -m "test: remover IA para experimentação"
```

### Prós

- ✅ Permite testar se a IA está causando algum problema específico
- ✅ Mantém outras melhorias (PDF, autenticação, etc.)
- ✅ Pode ser feito em branch separada sem afetar main

### Contras

- ❌ **Não resolve o problema atual** (build na Cloudflare)
- ❌ Trabalho manual e propenso a erros
- ❌ Perde funcionalidade de IA sem necessidade
- ❌ Pode introduzir bugs se não for feito cuidadosamente
- ❌ Não há evidência de que a IA está causando problemas

---

## Recomendação Final

### ✅ **OPÇÃO A é claramente a melhor escolha**

**Razões:**
1. O build local passa, indicando que o código está saudável
2. A IA não afeta o frontend (nenhum componente a usa)
3. O problema é de ambiente/configuração, não de código
4. Remover a IA não resolveria o problema do deploy na Cloudflare

### Próximos Passos Recomendados

1. **Focar em resolver Cloudflare Pages**:
   - Verificar logs do build na Cloudflare Dashboard
   - Configurar variáveis de ambiente corretamente
   - Ajustar build command se necessário

2. **Manter IA funcionando**:
   - A IA está isolada e não causa problemas
   - Pode ser útil no futuro quando o frontend for integrar

3. **Se realmente precisar testar sem IA**:
   - Use a branch `ordem-em-dia-ia-atual` como backup
   - Crie uma branch de teste seguindo Opção B apenas para diagnóstico
   - **Não faça merge dessa branch em main** sem evidência clara de problema

---

## Checklist de Decisão

Antes de considerar rollback, verifique:

- [ ] Build local falha? → **NÃO** (passa com sucesso)
- [ ] Frontend usa IA? → **NÃO** (nenhum componente chama a API)
- [ ] Erro específico relacionado à IA? → **NÃO** (erro é de ambiente)
- [ ] Logs mostram erro de Vertex AI? → **NÃO** (erro é de build na Cloudflare)

**Se todas as respostas forem "NÃO", a Opção A é a correta.**

