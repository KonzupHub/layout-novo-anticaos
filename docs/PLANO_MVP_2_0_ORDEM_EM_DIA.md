# Plano de Implementação - MVP 2.0 Ordem em Dia

**Data**: Janeiro 2025  
**Foco**: Motor de regras da Resolução 400 ANAC + Integração com IA

---

## Visão Geral

O MVP 2.0 adiciona um **motor de regras** que calcula automaticamente os prazos e obrigações da Resolução 400 da ANAC, integra com a IA para gerar resumos contextuais, e apresenta essas informações na tela de detalhe do caso e no PDF.

---

## 1. Motor de Regras da Resolução 400

### 1.1 Onde será implementado

**Arquivo novo**: `backend/src/services/anac-rules.ts`

**Papel**: Serviço que contém toda a lógica de cálculo de prazos e obrigações da Resolução 400.

**Funções principais**:
- `calcularPrazosANAC(caso: Case): PrazosANAC` - Calcula prazos baseados no tipo de incidente
- `verificarObrigacoes(caso: Case): ObrigacoesANAC[]` - Lista obrigações específicas do tipo
- `calcularPrazoRestante(caso: Case): number` - Retorna dias restantes para ação
- `verificarStatusPrazo(caso: Case): 'dentro_prazo' | 'proximo_vencer' | 'vencido'` - Status do prazo

**Regras da Resolução 400 a implementar**:
- **Atraso > 4h**: Prazo de 7 dias para oferecer assistência material ou reembolso
- **Cancelamento**: Prazo de 7 dias para oferecer reacomodação ou reembolso
- **Overbooking**: Prazo imediato para reacomodação + 7 dias para compensação
- **Mudança de voo**: Prazo de comunicação imediata + assistência se necessário
- **Extravio**: Prazo de 7 dias para localização + assistência emergencial imediata

**Estrutura de dados**:
```typescript
interface PrazosANAC {
  prazoLimite: Date; // Data limite para ação
  prazoRestante: number; // Dias restantes
  status: 'dentro_prazo' | 'proximo_vencer' | 'vencido';
  obrigacoes: ObrigacoesANAC[];
}

interface ObrigacoesANAC {
  tipo: 'assistencia_material' | 'reacomodacao' | 'reembolso' | 'compensacao' | 'comunicacao';
  descricao: string;
  prazo: number; // Dias
  obrigatoria: boolean;
}
```

### 1.2 Integração com rotas de casos

**Arquivo**: `backend/src/routes/cases.ts`

**Modificações**:
- Ao criar caso (`POST /api/cases`): Calcular prazos ANAC automaticamente e armazenar
- Ao buscar caso (`GET /api/cases/:id`): Incluir informações de prazos ANAC na resposta
- Ao atualizar caso (`PATCH /api/cases/:id`): Recalcular prazos se tipo ou data mudou

**Resposta estendida**:
```typescript
interface CaseResponse extends Case {
  prazosANAC?: PrazosANAC; // Adicionado ao modelo de resposta
}
```

### 1.3 Integração com PDF

**Arquivo**: `backend/src/services/pdf.ts`

**Modificações na seção "Cumprimento de Prazos ANAC"**:
- Substituir texto genérico (linha 434-450) por dados reais do motor de regras
- Mostrar:
  - Prazo limite calculado (data formatada)
  - Dias restantes
  - Status visual (dentro do prazo, próximo a vencer, vencido)
  - Lista de obrigações com checkboxes (cumpridas/pendentes)

**Exemplo de conteúdo**:
```
Cumprimento de Prazos ANAC

Prazo limite: 25/01/2025
Dias restantes: 3 dias
Status: Dentro do prazo

Obrigações:
☑ Assistência material oferecida dentro de 1h
☐ Reacomodação ou reembolso em até 7 dias
☐ Comunicação ao passageiro realizada
```

---

## 2. Integração do Motor de Regras com IA

### 2.1 Modificação da rota de IA

**Arquivo**: `backend/src/routes/ia.ts`

**Modificações**:
- Adicionar parâmetro opcional `casoId` no body
- Se `casoId` for fornecido, buscar o caso completo e seus prazos ANAC
- Passar informações de prazos ANAC para o prompt da IA

**Novo input**:
```json
{
  "tipo": "atraso",
  "descricao": "voo atrasou 5 horas",
  "prazoDias": 7,
  "casoId": "abc123" // Opcional: se fornecido, busca prazos ANAC reais
}
```

### 2.2 Modificação do serviço Gemini

**Arquivo**: `backend/src/services/gemini.ts`

**Modificações**:
- Função `sugerirResumoCaso` aceitar parâmetro opcional `prazosANAC?: PrazosANAC`
- Incluir contexto de prazos ANAC no prompt quando disponível
- Prompt melhorado com informações sobre Resolução 400

**Prompt atualizado**:
```
Você é um assistente especializado em resumir casos de incidentes aéreos para agências de turismo, 
seguindo a Resolução 400 da ANAC.

Tipo de incidente: ${tipo}
Descrição: ${descricao}
Prazo para ação: ${prazoDias} dias
${prazosANAC ? `Prazo ANAC: ${prazosANAC.prazoRestante} dias restantes (${prazosANAC.status})` : ''}

O resumo deve:
- Mencionar o tipo de incidente e seus impactos
- Destacar os pontos principais do caso
- Referenciar os prazos da Resolução 400 quando relevante
- Ser escrito em português brasileiro
- Ter no máximo 3 frases
```

### 2.3 Nova rota: Gerar resumo com contexto do caso

**Arquivo**: `backend/src/routes/cases.ts`

**Nova rota**: `POST /api/cases/:id/resumo-ia`

**Funcionalidade**:
- Busca o caso completo por ID
- Calcula prazos ANAC usando o motor de regras
- Chama a IA com contexto completo (tipo, descrição, prazos ANAC)
- Retorna resumo gerado

**Fluxo**:
1. Verificar autenticação e permissão
2. Buscar caso do banco
3. Calcular prazos ANAC (`anac-rules.ts`)
4. Chamar IA com contexto completo (`gemini.ts`)
5. Retornar resumo gerado

---

## 3. Apresentação na Tela de Detalhe do Caso

### 3.1 Arquivo a modificar

**Arquivo**: `src/pages/dashboard/CasoDetail.tsx`

### 3.2 Novos componentes a adicionar

**Seção "Prazos ANAC"** (nova seção no grid):
- Card mostrando:
  - Prazo limite (data formatada)
  - Dias restantes (com badge colorido: verde/amarelo/vermelho)
  - Status do prazo
  - Lista de obrigações com checkboxes interativos
  - Botão "Gerar resumo com IA" (chama nova rota `/api/cases/:id/resumo-ia`)

**Seção "Resumo do Caso"** (nova seção):
- Campo de texto editável para resumo
- Botão "Gerar com IA" ao lado
- Loading state durante geração
- Preview do resumo gerado antes de salvar
- Botão "Salvar resumo" para armazenar no campo `notas` ou novo campo `resumo`

**Layout proposto**:
```
┌─────────────────────────────────────┐
│ Informações do Caso (read-only)     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Campos Editáveis (status, etc)     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Prazos ANAC (novo)                  │
│ - Prazo limite: 25/01/2025         │
│ - Dias restantes: 3 (dentro prazo) │
│ - Obrigações: [checkboxes]          │
│ - [Botão: Gerar resumo com IA]      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Resumo do Caso (novo)               │
│ [Campo texto editável]              │
│ [Botão: Gerar com IA] [Salvar]      │
└─────────────────────────────────────┘
```

### 3.3 Integração com API

**Arquivo**: `src/lib/api.ts`

**Nova função**:
```typescript
async generateCaseSummary(id: string, token?: string | null): Promise<ApiResponse<{ resumo: string; prazosANAC: PrazosANAC }>>
```

**Chamada**: `POST /api/cases/:id/resumo-ia`

---

## 4. Integração no PDF

### 4.1 Arquivo a modificar

**Arquivo**: `backend/src/services/pdf.ts`

### 4.2 Modificações na função `generateCaseReport`

**Parâmetro adicional**: `prazosANAC?: PrazosANAC`

**Seção "Cumprimento de Prazos ANAC" (linha 428-463)**:
- **Antes**: Texto genérico baseado em status
- **Depois**: Dados reais do motor de regras:
  - Prazo limite calculado (data formatada)
  - Dias restantes com status visual
  - Lista de obrigações com indicadores de cumprimento
  - Referência explícita à Resolução 400

**Seção "Resultado Final" (linha 468-520)**:
- **Antes**: Texto baseado em status + notas
- **Depois**: 
  - Se houver resumo gerado pela IA, usar o resumo
  - Se não houver, usar texto padrão + notas
  - Manter opção de edição manual (notas)

**Modificação na rota de PDF**:
**Arquivo**: `backend/src/routes/cases.ts` (linha 251-306)

**Fluxo atualizado**:
1. Buscar caso
2. Calcular prazos ANAC usando motor de regras
3. Buscar resumo (se existir no caso ou gerar com IA opcionalmente)
4. Chamar `generateCaseReport(caso, agencia, logoUrl, prazosANAC, resumo)`

---

## 5. Resumo da Arquitetura MVP 2.0

### Fluxo de dados

```
┌─────────────────┐
│  Frontend       │
│  CasoDetail.tsx │
└────────┬────────┘
         │
         │ 1. GET /api/cases/:id
         ▼
┌─────────────────┐
│  Backend        │
│  cases.ts       │
└────────┬────────┘
         │
         │ 2. Busca caso
         ▼
┌─────────────────┐      ┌──────────────────┐
│  Repository    │      │  anac-rules.ts   │
│  (Firestore)   │─────▶│  Motor de Regras │
└─────────────────┘      └────────┬─────────┘
                                  │
                                  │ 3. Calcula prazos
                                  ▼
┌─────────────────┐      ┌──────────────────┐
│  Response       │      │  gemini.ts       │
│  com prazos     │◀─────│  (IA opcional)  │
└─────────────────┘      └──────────────────┘
         │
         │ 4. Exibe na tela
         ▼
┌─────────────────┐
│  Frontend       │
│  Mostra prazos  │
│  + Botão IA     │
└─────────────────┘
```

### Arquivos a criar/modificar

**Novos arquivos**:
1. `backend/src/services/anac-rules.ts` - Motor de regras da Resolução 400
2. `backend/src/types/anac.ts` - Tipos relacionados a prazos e obrigações ANAC

**Arquivos a modificar**:
1. `backend/src/services/gemini.ts` - Ajustar project ID e adicionar contexto de prazos
2. `backend/src/routes/ia.ts` - Aceitar casoId opcional
3. `backend/src/routes/cases.ts` - Integrar motor de regras e nova rota de resumo
4. `backend/src/services/pdf.ts` - Usar dados reais de prazos ANAC
5. `backend/src/types/shared.ts` - Adicionar campo `prazosANAC?` opcional no Case
6. `src/lib/api.ts` - Adicionar função `generateCaseSummary`
7. `src/pages/dashboard/CasoDetail.tsx` - Adicionar seções de prazos e resumo
8. `src/types/shared.ts` - Adicionar tipos de prazos ANAC

---

## 6. Ordem de Implementação Recomendada

### Fase 1: Motor de Regras (Backend)
1. Criar `backend/src/services/anac-rules.ts` com todas as regras
2. Criar `backend/src/types/anac.ts` com interfaces
3. Testar motor de regras isoladamente
4. Integrar nas rotas de casos (calcular ao criar/buscar)

### Fase 2: Correção Vertex AI
1. Ajustar `backend/src/services/gemini.ts` para usar `carbon-bonsai-395917`
2. Adicionar variável `VERTEX_AI_PROJECT_ID` no Cloud Run
3. Testar rota de IA com projeto correto

### Fase 3: Integração IA + Motor
1. Modificar `gemini.ts` para aceitar contexto de prazos ANAC
2. Criar rota `POST /api/cases/:id/resumo-ia`
3. Testar geração de resumo com contexto completo

### Fase 4: Frontend - Tela de Detalhe
1. Adicionar função `generateCaseSummary` em `api.ts`
2. Criar componente de "Prazos ANAC" em `CasoDetail.tsx`
3. Criar componente de "Resumo do Caso" com botão IA
4. Testar integração completa

### Fase 5: PDF
1. Modificar `generateCaseReport` para aceitar `prazosANAC`
2. Atualizar seção "Cumprimento de Prazos ANAC" com dados reais
3. Atualizar seção "Resultado Final" para usar resumo da IA
4. Testar geração de PDF completo

---

## 7. Considerações Técnicas

### Variáveis de ambiente necessárias

**Cloud Run**:
- `GCLOUD_PROJECT=ordem-em-dia` (já existe - para outras operações)
- `VERTEX_AI_PROJECT_ID=carbon-bonsai-395917` (nova - para chamadas de IA)

### Dependências

**Backend**:
- `@google-cloud/vertexai` (já instalado)
- `pdf-lib` (já instalado)
- Nenhuma nova dependência necessária

**Frontend**:
- Nenhuma nova dependência necessária

### Compatibilidade

- Todas as mudanças são **aditivas** (não quebram funcionalidades existentes)
- Campos novos são opcionais (`prazosANAC?`)
- Frontend antigo continua funcionando (campos novos aparecem apenas quando disponíveis)

---

**Próximos passos**: Aguardar confirmação para iniciar implementação.

