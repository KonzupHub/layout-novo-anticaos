# Mapeamento de Arquivos - Ordem em Dia

**Data**: Janeiro 2025  
**Objetivo**: Identificar os arquivos principais do sistema para planejamento do MVP 2.0

---

## 1. Modelo de Caso Compartilhado

### Backend
**Arquivo**: `backend/src/types/shared.ts`

**Papel**: Define os tipos TypeScript compartilhados entre backend e frontend:
- `CaseType`: Tipos de incidente (atraso, cancelamento, overbooking, mudanca_voo, extravio)
- `CaseStatus`: Status do caso (em_andamento, aguardando_resposta, documentacao_pendente, encerrado)
- `Case`: Interface principal do caso com todos os campos
- `CreateCaseDto`: DTO para criação de caso
- `UpdateCaseDto`: DTO para atualização de caso

**Campos principais do `Case`**:
- `id`, `cnpj`, `passageiro`, `localizador`, `fornecedor`
- `tipo`, `prazo` (string), `status`
- `responsavel` (objeto com nome e avatar opcional)
- `notas` (opcional)
- `createdAt`, `updatedAt` (timestamps)

### Frontend
**Arquivo**: `src/types/shared.ts`

**Papel**: Cópia sincronizada dos tipos do backend para uso no frontend React. Mantém a mesma estrutura do backend para garantir compatibilidade.

---

## 2. Rotas de Casos no Backend

**Arquivo**: `backend/src/routes/cases.ts`

**Papel**: Define todas as rotas HTTP relacionadas a casos:

**Rotas implementadas**:
- `GET /api/cases/examples` - Casos de exemplo para landing (pública)
- `GET /api/cases` - Lista casos do usuário autenticado (com filtros opcionais)
- `POST /api/cases` - Cria novo caso
- `GET /api/cases/:id` - Busca caso específico por ID
- `PATCH /api/cases/:id` - Atualiza caso existente
- `POST /api/cases/:id/pdf` - Gera PDF do caso

**Características**:
- Todas as rotas (exceto `/examples`) requerem autenticação via middleware `verifyAuth`
- Validação de permissão: verifica se o caso pertence ao CNPJ do usuário
- Integração com repositório (Firestore ou memória)
- Integração com serviço de PDF para geração de relatórios

---

## 3. Gerador de PDF

**Arquivo**: `backend/src/services/pdf.ts`

**Papel**: Gera relatórios PDF completos de casos usando a biblioteca `pdf-lib`.

**Função principal**: `generateCaseReport(caso: Case, agencia?: Agency | null, logoUrl?: string): Promise<PDFDocument>`

**Estrutura do PDF gerado**:
1. **Cabeçalho**: Título, nome da agência, CNPJ, data de emissão
2. **Identificação e Categoria**: Badge do tipo de incidente, número do caso
3. **Dados do Caso**: Grid com companhia aérea, localizador, status, prazo, responsável
4. **Cliente Afetado**: Nome do passageiro
5. **Linha do Tempo**: Marcos baseados em `createdAt`, `updatedAt`, encerramento
6. **Cumprimento de Prazos ANAC**: Texto contextual baseado em status (menciona Resolução 400)
7. **Resultado Final**: Seção destacada com status e notas do caso

**Observações importantes**:
- Linha 434: Comentário indica que "não há lógica específica de cálculo de prazos ANAC no backend"
- Linha 449: Menciona "Resolução 400" mas apenas como texto estático
- Linha 507: TODO comentado indicando que no futuro pode usar IA para gerar resumo

**Chamada**: A função é chamada pela rota `POST /api/cases/:id/pdf` em `backend/src/routes/cases.ts` (linha 281)

---

## 4. Tela de Detalhe do Caso no Frontend

**Arquivo**: `src/pages/dashboard/CasoDetail.tsx`

**Papel**: Componente React que exibe e permite edição dos detalhes de um caso individual.

**Funcionalidades**:
- **Carregamento**: Busca caso por ID via `api.getCaseById(id, token)`
- **Edição**: Permite atualizar status, responsável, notas e prazo via `api.updateCase(id, updates, token)`
- **Geração de PDF**: Botão que chama `api.generateCasePDF(id, token)` e abre PDF em nova aba
- **Navegação**: Botão "Voltar" para lista de casos

**Estrutura da tela**:
- Header com botão voltar e título
- Grid de 2 colunas:
  - **Coluna esquerda**: Informações do caso (read-only): passageiro, localizador, fornecedor, tipo
  - **Coluna direita**: Campos editáveis: status, responsável, prazo, notas
- Botões de ação: "Salvar alterações" e "Gerar Relatório PDF"

**Estados gerenciados**:
- `caso`: Dados completos do caso (read-only após carregamento)
- `status`, `responsavelNome`, `notas`, `prazo`: Estados editáveis
- `loading`, `saving`, `generatingPDF`: Estados de loading

---

## 5. Configuração do Vertex AI

**Arquivo**: `backend/src/services/gemini.ts`

**Configurações atuais**:
- **Cliente**: `VertexAI` do pacote `@google-cloud/vertexai`
- **Project ID**: `process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'ordem-em-dia'` (linha 21)
- **Região**: `us-central1` (linha 22)
- **Modelo**: `gemini-2.5-flash` (linha 23)

**⚠️ PROBLEMA IDENTIFICADO**:
- O código atual usa fallback para `ordem-em-dia` como project ID
- **Mas o Vertex AI precisa usar `carbon-bonsai-395917`** (onde existem créditos)
- O Cloud Run roda em `ordem-em-dia`, mas as chamadas de Vertex devem apontar para `carbon-bonsai-395917`

**Credenciais**:
- Em desenvolvimento: Tenta usar arquivo `keys/carbon-bonsai-395917-16f679bb2e29.json` (linha 12)
- Em produção: Usa Application Default Credentials do Cloud Run

**Função principal**: `sugerirResumoCaso(dadosDoCaso: DadosCaso): Promise<string>`
- Recebe: tipo, descrição, prazoDias
- Retorna: Resumo gerado em português (máximo 3 frases)

---

## Resumo dos Arquivos Principais

| Componente | Arquivo Backend | Arquivo Frontend | Observações |
|------------|----------------|-----------------|-------------|
| **Modelo de Caso** | `backend/src/types/shared.ts` | `src/types/shared.ts` | Tipos sincronizados |
| **Rotas de Casos** | `backend/src/routes/cases.ts` | - | 6 rotas implementadas |
| **Gerador de PDF** | `backend/src/services/pdf.ts` | - | Função `generateCaseReport` |
| **Tela de Detalhe** | - | `src/pages/dashboard/CasoDetail.tsx` | Componente React completo |
| **Vertex AI** | `backend/src/services/gemini.ts` | - | ⚠️ Precisa ajustar project ID |

---

**Próximos passos**: Ver plano de implementação MVP 2.0 em `docs/PLANO_MVP_2_0.md`

