# Índices do Firestore Necessários para MVP 2.0

**Data**: 2025-11-19  
**Problema**: Query de listagem de casos requer índice composto no Firestore

---

## Erro Identificado

**Código de Erro**: `9 FAILED_PRECONDITION`

**Mensagem**:
```
The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/ordem-em-dia/firestore/indexes?create_composite=...
```

**Rota Afetada**: `GET /api/cases`

**Impacto**:
- ❌ Listagem de casos falha
- ✅ Criação de casos funciona (não usa query com orderBy)
- ✅ Visualização de detalhes funciona (usa get por ID)
- ✅ Edição de casos funciona (usa get por ID)

---

## Query que Requer Índice

**Arquivo**: `backend/src/repo/firestoreRepo.ts`  
**Função**: `getCasesByCnpj()`

**Query Firestore**:
```typescript
let query = db.collection('cases')
  .where('cnpj', '==', cnpj)
  .orderBy('createdAt', 'desc')
  .get();
```

**Filtros Opcionais** (quando presentes, podem requerer índices adicionais):
- `where('status', '==', filters.status)`
- `where('tipo', '==', filters.tipo)`
- `where('prazo', '<=', ateDate.toISOString())`

---

## Índice Necessário

### Índice Base (Obrigatório)

**Coleção**: `cases`

**Campos**:
1. `cnpj` - Ascending (==)
2. `createdAt` - Descending (orderBy)

**Tipo**: Composite Index

**Link para Criação**:
```
https://console.firebase.google.com/v1/r/project/ordem-em-dia/firestore/indexes?create_composite=Ckpwcm9qZWN0cy9vcmRlbS1lbS1kaWEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2Nhc2VzL2luZGV4ZXMvXxABGggKBGNucGoQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC
```

**Nota**: O link acima é gerado automaticamente pelo Firestore e pode expirar. Se o link não funcionar, crie o índice manualmente conforme descrito abaixo.

---

## Como Criar o Índice

### Opção 1: Usar o Link Automático (Recomendado)

1. Acesse o link fornecido no erro (copiado dos logs)
2. O console do Firebase abrirá com o índice pré-configurado
3. Clique em "Criar Índice"
4. Aguarde a criação (pode levar alguns minutos)

### Opção 2: Criar Manualmente no Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `ordem-em-dia`
3. Vá em **Firestore Database** → **Índices**
4. Clique em **Criar Índice**
5. Configure:
   - **Coleção**: `cases`
   - **Campos**:
     - Campo 1: `cnpj` - Tipo: Ascending
     - Campo 2: `createdAt` - Tipo: Descending
   - **Query scope**: Collection
6. Clique em **Criar**

### Opção 3: Usar Firebase CLI

```bash
firebase deploy --only firestore:indexes
```

**Arquivo `firestore.indexes.json`** (se não existir, criar na raiz do projeto):
```json
{
  "indexes": [
    {
      "collectionGroup": "cases",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "cnpj",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## Status do Índice

**Status Atual**: ⚠️ **NÃO CRIADO**

**Ação Necessária**: Criar o índice usando uma das opções acima

**Tempo Estimado**: 2-5 minutos após criação

**Impacto Após Criação**: 
- ✅ Listagem de casos passará a funcionar
- ✅ Página "Dia de hoje" passará a carregar casos
- ✅ Página "Casos" passará a mostrar lista

---

## Índices Adicionais (Opcionais)

Se forem usados filtros na listagem de casos, podem ser necessários índices adicionais:

### Índice para Filtro por Status

**Campos**:
1. `cnpj` - Ascending
2. `status` - Ascending
3. `createdAt` - Descending

**Quando necessário**: Quando o frontend filtrar casos por status

### Índice para Filtro por Tipo

**Campos**:
1. `cnpj` - Ascending
2. `tipo` - Ascending
3. `createdAt` - Descending

**Quando necessário**: Quando o frontend filtrar casos por tipo

### Índice para Filtro por Prazo

**Campos**:
1. `cnpj` - Ascending
2. `prazo` - Ascending
3. `createdAt` - Descending

**Quando necessário**: Quando o frontend filtrar casos por prazo (até uma data)

**Nota**: Esses índices só são necessários se os filtros forem usados. Por enquanto, o índice base é suficiente para a funcionalidade principal.

---

## Verificação

Após criar o índice, verificar:

1. **No Console do Firebase**:
   - Índice aparece na lista com status "Pronto" (não "Em criação")

2. **Testando a API**:
   ```bash
   # Fazer login e obter token
   # Depois chamar:
   curl -H "Authorization: Bearer <token>" \
     https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api/cases
   ```
   - Deve retornar `200 OK` com lista de casos (mesmo que vazia)

3. **No Frontend**:
   - Acessar `https://ordem.konzuphub.com`
   - Fazer login
   - Página "Casos" deve carregar sem erro
   - Página "Dia de hoje" deve carregar sem erro

---

## Referências

- [Firestore Indexes Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Composite Indexes](https://firebase.google.com/docs/firestore/query-data/index-overview#composite_indexes)

---

**Última atualização**: 2025-11-19  
**Status**: ⚠️ Aguardando criação do índice

