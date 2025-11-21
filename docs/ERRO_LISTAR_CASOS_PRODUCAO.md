# Diagnóstico: Erro ao Listar e Criar Casos em Produção

**Data**: 2025-11-19  
**Problema**: Frontend em produção retorna erros ao listar e criar casos

---

## Endpoints Afetados

### 1. Listar Casos

**Rota Frontend**: `GET /api/cases`  
**Rota Backend**: `GET /api/cases` (requer autenticação)  
**Arquivo Backend**: `backend/src/routes/cases.ts` (linha 87-121)

**Erro Identificado**: ✅ **ÍNDICE DO FIRESTORE FALTANDO**

### 2. Criar Caso

**Rota Frontend**: `POST /api/cases`  
**Rota Backend**: `POST /api/cases` (requer autenticação)  
**Arquivo Backend**: `backend/src/routes/cases.ts` (linha 123+)

**Status**: ⚠️ **A VERIFICAR** (pode ser o mesmo erro ou diferente)

---

## Erro Detalhado - Listagem de Casos

### Código de Erro

**Código**: `9 FAILED_PRECONDITION`

**Mensagem Completa**:
```
The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/ordem-em-dia/firestore/indexes?create_composite=Ckpwcm9qZWN0cy9vcmRlbS1lbS1kaWEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2Nhc2VzL2luZGV4ZXMvXxABGggKBGNucGoQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC
```

### Query que Causa o Erro

**Arquivo**: `backend/src/repo/firestoreRepo.ts`  
**Função**: `getCasesByCnpj()` (linha 94-120)

**Código**:
```typescript
let query: FirebaseFirestore.Query = db.collection('cases').where('cnpj', '==', cnpj);

// ... filtros opcionais ...

const snapshot = await query.orderBy('createdAt', 'desc').get();
```

**Problema**: 
- A query faz `where('cnpj', '==', cnpj)` seguido de `orderBy('createdAt', 'desc')`
- Firestore requer índice composto para queries com `where` + `orderBy` em campos diferentes

### Link para Criar Índice

```
https://console.firebase.google.com/v1/r/project/ordem-em-dia/firestore/indexes?create_composite=Ckpwcm9qZWN0cy9vcmRlbS1lbS1kaWEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2Nhc2VzL2luZGV4ZXMvXxABGggKBGNucGoQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC
```

**Nota**: Este link pode expirar. Se não funcionar, consulte `docs/FIRESTORE_INDEXES_MVP2.md` para instruções manuais.

---

## Erro Detalhado - Criação de Casos

**Status**: ✅ **IDENTIFICADO**

**Erro**:
```
Error: Value for argument "data" is not a valid Firestore document. 
Cannot use "undefined" as a Firestore value (found in field "numeroVoo"). 
If you want to ignore undefined values, enable `ignoreUndefinedProperties`.
```

**Causa**: 
- Campos novos do MVP 2.0 (`numeroVoo`, `dataVoo`, etc.) são opcionais
- Quando não preenchidos, ficam como `undefined`
- Firestore não aceita `undefined` como valor de campo
- O código está tentando salvar campos `undefined` no Firestore

**Arquivo Afetado**: `backend/src/repo/firestoreRepo.ts` - função `createCase()`

**Solução**: Remover campos `undefined` do objeto antes de salvar no Firestore

---

## Logs do Cloud Run

**Serviço**: `konzup-hub-backend`  
**Projeto**: `ordem-em-dia`  
**Região**: `us-central1`

**Timestamp do Erro**: 2025-11-19T21:03:15.749Z

**Trecho do Log**:
```
code: 9,
details: 'The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/ordem-em-dia/firestore/indexes?create_composite=...'
```

---

## Impacto

### Funcionalidades Quebradas ❌

1. **Listagem de Casos**:
   - Página `/dashboard/casos` não carrega casos
   - Página `/dashboard` (Dia de hoje) não carrega casos
   - Toast de erro: "Erro ao carregar casos"

2. **Criação de Casos** (possivelmente):
   - Modal de criação pode falhar
   - Toast de erro: "Erro ao criar caso"

### Funcionalidades Funcionando ✅

1. **Login/Autenticação**: Funcionando
2. **Health Check**: Funcionando
3. **Visualização de Detalhes**: Deve funcionar (usa `get()` por ID, não query)
4. **Edição de Casos**: Deve funcionar (usa `get()` por ID, não query)

---

## Solução

### Passo 1: Criar Índice do Firestore

Seguir instruções em `docs/FIRESTORE_INDEXES_MVP2.md` para criar o índice composto necessário.

**Índice Necessário**:
- Coleção: `cases`
- Campos:
  1. `cnpj` - Ascending
  2. `createdAt` - Descending

### Passo 2: Verificar Criação de Casos

Após criar o índice e testar listagem:
1. Tentar criar um caso via frontend
2. Se ainda falhar, verificar logs específicos de `POST /api/cases`
3. Documentar erro adicional se houver

### Passo 3: Testar

Após criar o índice:
1. Aguardar 2-5 minutos para índice ficar pronto
2. Testar listagem de casos
3. Testar criação de caso
4. Documentar resultados

---

## Arquivos Relacionados

- `docs/FIRESTORE_INDEXES_MVP2.md` - Instruções detalhadas para criar índice
- `backend/src/routes/cases.ts` - Rotas de casos
- `backend/src/repo/firestoreRepo.ts` - Implementação do repositório Firestore

---

## Correção Aplicada - Criação de Casos

**Arquivo Corrigido**: `backend/src/repo/firestoreRepo.ts`

**Mudanças**:
1. Função `createCase()`: Remove campos `undefined` antes de salvar no Firestore
2. Função `updateCase()`: Remove campos `undefined` antes de atualizar no Firestore

**Código Adicionado**:
```typescript
// Remove campos undefined para evitar erro do Firestore
const cleanCaseData = Object.fromEntries(
  Object.entries(caseData).filter(([_, value]) => value !== undefined)
) as CreateCaseDto;
```

**Deploy Realizado**: 
- Revisão: `konzup-hub-backend-00011-2s2`
- Data: 2025-11-19 21:08 UTC
- Status: ✅ Deploy concluído

**Resultado Esperado**: 
- ✅ Criação de casos deve funcionar agora (campos opcionais não causam erro)
- ✅ Edição de casos deve funcionar agora (campos opcionais não causam erro)
- ⚠️ Listagem de casos ainda requer criação do índice do Firestore

---

## Resumo Final

### Erros Identificados

1. **Listagem de Casos**: ❌ Índice do Firestore faltando
   - **Status**: ⚠️ Requer ação manual (criar índice)
   - **Documentação**: `docs/FIRESTORE_INDEXES_MVP2.md`

2. **Criação de Casos**: ✅ **CORRIGIDO**
   - **Status**: ✅ Corrigido e deployado
   - **Correção**: Remoção de campos `undefined` antes de salvar

### Próximos Passos

1. **Criar Índice do Firestore** (bloqueador para listagem):
   - Seguir instruções em `docs/FIRESTORE_INDEXES_MVP2.md`
   - Usar link automático ou criar manualmente
   - Aguardar 2-5 minutos após criação

2. **Testar Após Criar Índice**:
   - Listagem de casos deve funcionar
   - Criação de casos já deve funcionar (corrigido)

---

**Última atualização**: 2025-11-19 21:08 UTC  
**Status**: 
- ✅ Criação de casos: CORRIGIDO
- ⚠️ Listagem de casos: Aguardando criação do índice do Firestore

