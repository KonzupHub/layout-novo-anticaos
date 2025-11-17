# Histórico de Integração da IA (Vertex AI Gemini)

## Data Aproximada de Integração

A integração da IA foi realizada após o commit `451c27e` (fix: restaurar backend completo e Firebase após pull do Lovable), que ocorreu em novembro de 2024. Os arquivos de IA foram adicionados em commits subsequentes, sendo o mais recente relacionado `96fb0b7` (Configurar npm e build para Cloudflare Pages).

## Arquivos do Backend Relacionados à IA

### 1. **backend/src/services/gemini.ts** (NOVO)
- **Função principal**: `sugerirResumoCaso(dadosDoCaso: DadosCaso): Promise<string>`
- **Responsabilidade**: 
  - Inicializa cliente Vertex AI com modelo `gemini-2.5-flash`
  - Configura credenciais (local: arquivo JSON, produção: Application Default Credentials)
  - Gera resumos de casos de incidentes aéreos em português brasileiro
  - Limpa formatação (remove HTML, markdown) e limita a 3 frases
  - Trata erros específicos do Vertex AI (PERMISSION_DENIED, NOT_FOUND, QUOTA_EXCEEDED)
- **Dependências**: `@google-cloud/vertexai`

### 2. **backend/src/routes/ia.ts** (NOVO)
- **Rota HTTP**: `POST /api/ia/sugerir-resumo`
- **Responsabilidade**:
  - Valida entrada (tipo, descricao, prazoDias)
  - Chama `sugerirResumoCaso` do serviço Gemini
  - Retorna JSON com resumo ou erro
- **Status de autenticação**: Atualmente sem autenticação (recomendado adicionar em produção)

### 3. **backend/src/index.ts** (MODIFICADO)
- **Mudança**: Adicionada importação e registro da rota de IA
  ```typescript
  import iaRouter from './routes/ia.js';
  app.use('/api/ia', iaRouter);
  ```
- **Impacto**: Baixo - apenas adiciona uma nova rota, não altera comportamento existente

### 4. **backend/package.json** (MODIFICADO)
- **Mudança**: Adicionada dependência `@google-cloud/vertexai: ^1.0.0`
- **Impacto**: Aumenta tamanho do bundle, mas não afeta funcionalidades existentes

### 5. **backend/src/services/pdf.ts** (MODIFICADO - NÃO DIRETAMENTE RELACIONADO À IA)
- **Mudança**: Redesign completo do layout do PDF
- **Nota**: Há um TODO no código indicando que no futuro a seção "Resultado Final" pode usar a rota `/api/ia/sugerir-resumo`
- **Impacto**: Não usa IA atualmente, apenas menciona como possibilidade futura

### 6. **backend/src/routes/cases.ts** (MODIFICADO - NÃO DIRETAMENTE RELACIONADO À IA)
- **Mudança**: Rota de PDF agora busca dados da agência para incluir no PDF
- **Impacto**: Não relacionado à IA, apenas melhoria no PDF

### 7. **backend/IA_GEMINI.md** (NOVO)
- Documentação da rota de IA
- Exemplos de uso, comandos curl, limitações

### 8. **backend/keys/carbon-bonsai-395917-16f679bb2e29.json** (NOVO)
- Arquivo de credenciais para desenvolvimento local
- **IMPORTANTE**: Este arquivo contém chaves privadas e não deve ser commitado em produção

## Arquivos do Frontend Relacionados à IA

### Resultado da Busca
**NENHUM arquivo do frontend foi encontrado chamando a API de IA diretamente.**

- O frontend não possui componentes, hooks ou páginas que chamam `/api/ia/sugerir-resumo`
- A IA está implementada apenas no backend
- O frontend pode usar a IA no futuro, mas atualmente não há integração

### Arquivos do Frontend Modificados (mas não relacionados à IA)
- `src/lib/api.ts`: Mudanças em tratamento de erros e API_BASE padrão (não relacionado à IA)
- `src/pages/Index.tsx`: Integração com API de waitlist (não relacionado à IA)
- `src/pages/Login.tsx`, `src/pages/Cadastro.tsx`: Integração com Firebase Auth (não relacionado à IA)
- Outros arquivos: Melhorias gerais de autenticação e UX (não relacionado à IA)

## Arquitetura Atual

```
┌─────────────────┐
│   Frontend      │
│   (React/Vite)  │
└────────┬────────┘
         │
         │ HTTP Request
         ▼
┌─────────────────┐
│   Backend       │
│   (Express)     │
│                 │
│  POST /api/ia/  │
│  sugerir-resumo │
└────────┬────────┘
         │
         │ Chama
         ▼
┌─────────────────┐
│  gemini.ts      │
│  (Serviço IA)   │
└────────┬────────┘
         │
         │ API Call
         ▼
┌─────────────────┐
│  Vertex AI      │
│  Gemini 2.5     │
│  Flash          │
└─────────────────┘
```

### Fluxo de Dados

1. **Cliente faz requisição** → `POST /api/ia/sugerir-resumo` com JSON:
   ```json
   {
     "tipo": "atraso",
     "descricao": "voo atrasou 5 horas...",
     "prazoDias": 7
   }
   ```

2. **Backend valida** → Rota `ia.ts` valida campos obrigatórios

3. **Serviço chama IA** → `gemini.ts` monta prompt e chama Vertex AI

4. **Vertex AI responde** → Texto gerado em português

5. **Serviço processa** → Remove formatação, limita a 3 frases

6. **Backend retorna** → JSON com resumo ou erro

### Configuração

- **Modelo**: `gemini-2.5-flash`
- **Região**: `us-central1`
- **Projeto**: `ordem-em-dia` (ou `carbon-bonsai-395917` em desenvolvimento)
- **Credenciais**:
  - Desenvolvimento: Arquivo JSON em `backend/keys/`
  - Produção: Application Default Credentials (Cloud Run)

## Impacto no Build

✅ **Build local do frontend passa sem erros**
- A IA não afeta o build do frontend
- Nenhuma dependência nova foi adicionada ao frontend
- O frontend não importa código relacionado à IA

✅ **Build do backend funciona**
- Dependência `@google-cloud/vertexai` é instalada corretamente
- Código TypeScript compila sem erros

## Notas Importantes

1. **A IA não está sendo usada no frontend atualmente**
   - A rota existe e funciona, mas nenhum componente React a chama
   - Isso significa que remover a IA do backend não quebraria o frontend

2. **A IA é isolada no backend**
   - Toda a lógica está em `backend/src/services/gemini.ts` e `backend/src/routes/ia.ts`
   - Remover esses arquivos e a rota do `index.ts` seria suficiente para desativar a IA

3. **O PDF não usa IA ainda**
   - Há um TODO no código indicando possibilidade futura
   - Atualmente o PDF usa apenas dados do caso, sem IA

4. **Autenticação não implementada**
   - A rota `/api/ia/sugerir-resumo` não requer autenticação
   - Isso pode ser um problema de segurança e custos em produção

