# Correção de Erros de Casos em Produção

**Data**: 2025-11-19  
**Problema**: Erros ao listar e criar casos no frontend em produção

---

## Resumo Executivo

Dois erros foram identificados e corrigidos/documentados:

1. **Listagem de Casos**: Erro de índice do Firestore (requer ação manual)
2. **Criação de Casos**: Erro de campos `undefined` no Firestore (✅ CORRIGIDO)

---

## Erro 1: Listagem de Casos

### Problema

**Erro**: `9 FAILED_PRECONDITION` - Query requer índice composto no Firestore

**Mensagem**:
```
The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/ordem-em-dia/firestore/indexes?create_composite=...
```

**Query Afetada**:
```typescript
db.collection('cases')
  .where('cnpj', '==', cnpj)
  .orderBy('createdAt', 'desc')
  .get()
```

### Solução

**Ação Necessária**: Criar índice composto no Firestore

**Documentação Completa**: `docs/FIRESTORE_INDEXES_MVP2.md`

**Link Rápido** (pode expirar):
```
https://console.firebase.google.com/v1/r/project/ordem-em-dia/firestore/indexes?create_composite=Ckpwcm9qZWN0cy9vcmRlbS1lbS1kaWEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2Nhc2VzL2luZGV4ZXMvXxABGggKBGNucGoQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC
```

**Status**: ⚠️ **AGUARDANDO CRIAÇÃO DO ÍNDICE**

---

## Erro 2: Criação de Casos

### Problema

**Erro**:
```
Error: Value for argument "data" is not a valid Firestore document. 
Cannot use "undefined" as a Firestore value (found in field "numeroVoo").
```

**Causa**: 
- Campos novos do MVP 2.0 são opcionais
- Quando não preenchidos, ficam como `undefined`
- Firestore não aceita `undefined` como valor

### Solução Aplicada

**Arquivo Corrigido**: `backend/src/repo/firestoreRepo.ts`

**Mudanças**:

1. **Função `createCase()`** (linha 74-92):
   - Adicionada remoção de campos `undefined` antes de salvar

2. **Função `updateCase()`** (linha 143-162):
   - Adicionada remoção de campos `undefined` antes de atualizar

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

**Status**: ✅ **CORRIGIDO E DEPLOYADO**

---

## Testes Realizados

### Após Correção

**Health Check**: ✅ Funcionando
```bash
curl https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api/health
# Resposta: {"ok":true,"stub":false}
```

**Criação de Casos**: ✅ Deve funcionar agora (correção aplicada)

**Listagem de Casos**: ⚠️ Ainda requer criação do índice

---

## Próximos Passos

1. **Criar Índice do Firestore**:
   - Acessar `docs/FIRESTORE_INDEXES_MVP2.md`
   - Seguir instruções para criar índice
   - Aguardar 2-5 minutos após criação

2. **Testar em Produção**:
   - Acessar `https://ordem.konzuphub.com`
   - Fazer login
   - Testar criação de caso (deve funcionar)
   - Testar listagem de casos (deve funcionar após criar índice)

---

## Arquivos Modificados

- `backend/src/repo/firestoreRepo.ts` - Correção de campos `undefined`

## Arquivos de Documentação Criados

- `docs/FIRESTORE_INDEXES_MVP2.md` - Instruções para criar índice
- `docs/ERRO_LISTAR_CASOS_PRODUCAO.md` - Diagnóstico completo dos erros
- `docs/CORRECAO_ERROS_CASOS_PRODUCAO.md` - Este arquivo (resumo)

---

**Última atualização**: 2025-11-19 21:08 UTC

