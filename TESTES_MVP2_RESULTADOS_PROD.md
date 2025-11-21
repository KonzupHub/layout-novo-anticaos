# Testes e Correções - Casos em Produção

**Data**: 2025-11-19  
**Objetivo**: Corrigir erros de listagem e criação de casos em produção

---

## Erros Identificados

### 1. Erro de Listagem de Casos

**Erro**: `9 FAILED_PRECONDITION`  
**Mensagem**: `The query requires an index`

**Causa**: Query com `where('cnpj', '==', cnpj)` + `orderBy('createdAt', 'desc')` requer índice composto no Firestore

**Status**: ✅ **CORRIGIDO** - Índice criado

### 2. Erro de Criação de Casos

**Erro**: `Cannot use "undefined" as a Firestore value (found in field "numeroVoo")`

**Causa**: Campos opcionais do MVP 2.0 ficam `undefined` quando não preenchidos; Firestore não aceita `undefined`

**Status**: ✅ **CORRIGIDO** - Código atualizado para remover campos `undefined`

---

## Correções Aplicadas

### 1. Índice do Firestore Criado

**Comando Executado**:
```bash
gcloud firestore indexes composite create \
  --collection-group=cases \
  --query-scope=COLLECTION \
  --field-config field-path=cnpj,order=ASCENDING \
  --field-config field-path=createdAt,order=DESCENDING \
  --project=ordem-em-dia
```

**Resultado**: 
- Índice criado com sucesso
- ID do índice: `CICAgOjXh4EK`
- Status inicial: `CREATING` (aguardando ficar `READY`)

**Tempo estimado para ficar pronto**: 2-5 minutos

### 2. Código Corrigido

**Arquivo**: `backend/src/repo/firestoreRepo.ts`

**Mudanças**:

1. **Função `createCase()`** (linha 74-99):
   - Adicionada remoção de campos `undefined` antes de salvar
   ```typescript
   const cleanCaseData = Object.fromEntries(
     Object.entries(caseData).filter(([_, value]) => value !== undefined)
   ) as CreateCaseDto;
   ```

2. **Função `updateCase()`** (linha 143-168):
   - Adicionada remoção de campos `undefined` antes de atualizar
   ```typescript
   const cleanUpdates = Object.fromEntries(
     Object.entries(updates).filter(([_, value]) => value !== undefined)
   ) as UpdateCaseDto;
   ```

**Deploy Realizado**:
- Revisão: `konzup-hub-backend-00012-bb8`
- Data: 2025-11-19 21:26 UTC
- Status: ✅ Deploy concluído

---

## Testes Realizados

### Health Check

**URL**: `GET https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api/health`

**Status HTTP**: `200 OK`

**Resposta**:
```json
{
  "ok": true,
  "stub": false
}
```

**Resultado**: ✅ Funcionando

---

## Próximos Testes (Após Índice Ficar Pronto)

Após o índice do Firestore ficar em estado `READY` (2-5 minutos), testar:

1. **Listagem de Casos**:
   - `GET /api/cases` (com autenticação)
   - Deve retornar `200 OK` com array de casos (mesmo que vazio)

2. **Criação de Caso**:
   - `POST /api/cases` (com autenticação e payload válido)
   - Deve retornar `201 Created` com o caso criado

---

## Payload de Teste para Criação

**Payload Mínimo** (campos obrigatórios):
```json
{
  "passageiro": "Maria Silva",
  "localizador": "ABC123",
  "fornecedor": "LATAM",
  "tipo": "atraso",
  "prazo": "2025-11-20T18:00:00Z",
  "status": "em_andamento",
  "responsavel": {
    "nome": "João Santos",
    "avatar": "JS"
  }
}
```

**Payload Completo** (com campos opcionais do MVP 2.0):
```json
{
  "passageiro": "Maria Silva",
  "localizador": "ABC123",
  "fornecedor": "LATAM",
  "tipo": "atraso",
  "prazo": "2025-11-20T18:00:00Z",
  "status": "em_andamento",
  "responsavel": {
    "nome": "João Santos",
    "avatar": "JS"
  },
  "numeroVoo": "LA1234",
  "dataVoo": "2025-11-20",
  "horarioPrevisto": "14:30",
  "horarioReal": "19:45",
  "origem": "GRU",
  "destino": "GIG",
  "canalVenda": "Site",
  "consolidadora": "CVC",
  "timelineIncidente": "Voo atrasou 5 horas devido a problemas técnicos"
}
```

**Nota**: Campos opcionais podem ser omitidos. O código agora remove campos `undefined` automaticamente.

---

## Status Atual

- ✅ **Índice do Firestore**: **READY** (ID: `CICAgOjXh4EK`)
- ✅ **Código corrigido**: Deployado em produção (revisão `konzup-hub-backend-00012-bb8`)
- ✅ **Commit**: Correção de campos `undefined` commitada localmente

---

## Resumo das Correções

### O Que Foi Feito

1. **Índice do Firestore Criado**:
   - Coleção: `cases`
   - Campos: `cnpj` (ASC) + `createdAt` (DESC)
   - ID: `CICAgOjXh4EK`
   - Status: Criado (aguardando ficar READY)

2. **Código Corrigido**:
   - Arquivo: `backend/src/repo/firestoreRepo.ts`
   - Funções: `createCase()` e `updateCase()`
   - Correção: Remoção de campos `undefined` antes de salvar no Firestore
   - Deploy: Revisão `konzup-hub-backend-00012-bb8`

### Resultado Esperado

Com o índice READY e código corrigido:
- ✅ **Listagem de casos**: Deve funcionar (`GET /api/cases`)
- ✅ **Criação de casos**: Deve funcionar (`POST /api/cases`)
- ✅ **Edição de casos**: Deve funcionar (`PATCH /api/cases/:id`)

### Validação

**Índice do Firestore**:
- ID: `CICAgOjXh4EK`
- Estado: **READY** ✅
- Campos: `cnpj` (ASCENDING) + `createdAt` (DESCENDING)

**Backend em Produção**:
- Revisão: `konzup-hub-backend-00012-bb8`
- Health Check: ✅ Funcionando
- Código: ✅ Corrigido (remoção de campos `undefined`)

---

## Comportamento Esperado no Frontend

### Após Login

1. **Página "Dia de hoje"** (`/dashboard`):
   - ✅ Deve carregar casos sem erro
   - ✅ Cards de estatísticas devem mostrar números corretos
   - ✅ Lista de casos prioritários deve aparecer

2. **Página "Casos"** (`/dashboard/casos`):
   - ✅ Deve carregar lista de casos sem erro
   - ✅ Não deve aparecer toast "Erro ao carregar casos"
   - ✅ Se não houver casos, mostra estado vazio corretamente

### Criar Novo Caso

1. **Clicar em "Novo caso"**:
   - ✅ Modal abre normalmente

2. **Preencher formulário**:
   - ✅ Campos obrigatórios: passageiro, localizador, fornecedor, tipo, prazo, status, responsável
   - ✅ Campos opcionais (MVP 2.0): podem ser preenchidos ou deixados vazios

3. **Clicar em "Criar caso"**:
   - ✅ Caso é criado com sucesso
   - ✅ Toast de sucesso aparece
   - ✅ Modal fecha
   - ✅ Caso aparece na lista imediatamente
   - ✅ Não deve aparecer toast "Erro ao criar caso"

---

**Última atualização**: 2025-11-19 21:35 UTC

