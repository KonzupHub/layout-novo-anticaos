# Resumo - Implementação do Modo LOCAL_STUB

## Arquivos Criados

### Repositórios
- `src/repo/repo.ts` - Interface `IRepository`
- `src/repo/memoryRepo.ts` - Implementação em memória
- `src/repo/firestoreRepo.ts` - Implementação Firestore (refatorado)
- `src/repo/index.ts` - Factory que escolhe repositório baseado em `LOCAL_STUB`

### Documentação
- `MODO_STUB.md` - Documentação completa do modo stub

## Arquivos Modificados

### Backend
1. **`src/services/firebase-admin.ts`**
   - Verifica `LOCAL_STUB` e não inicializa Firebase se ativo

2. **`src/services/storage.ts`**
   - Modo stub: salva PDFs em `backend/.tmp`
   - Retorna URLs locais: `http://localhost:8080/api/files/:filename`

3. **`src/middleware/auth.ts`**
   - Modo stub: cria usuário padrão automaticamente
   - Aceita qualquer token ou nenhum token

4. **`src/routes/auth.ts`**
   - Modo stub: cria usuário sem Firebase Auth
   - Retorna token mockado

5. **`src/routes/waitlist.ts`**
   - Usa `getRepository()` ao invés de função direta

6. **`src/routes/cases.ts`**
   - Usa `getRepository()` para todas operações

7. **`src/services/csv.ts`**
   - Usa `getRepository()` para buscar casos

8. **`src/index.ts`**
   - Adiciona rota `/api/files/:filename` para servir PDFs em modo stub
   - Mostra aviso visual quando modo stub está ativo
   - Health check retorna status do modo stub

### Configuração
1. **`package.json`**
   - Novo script: `dev:stub` - Roda com `LOCAL_STUB=true`

2. **`BACKEND_ENV_SAMPLE.md`**
   - Adicionada variável `LOCAL_STUB=true` com comentários

3. **`.gitignore`**
   - Adicionado `backend/.tmp/`

4. **`.dockerignore`**
   - Adicionado `.tmp`

## Como Iniciar no Modo Stub

### Comando Único:

```bash
cd backend && npm run dev:stub
```

Ou manualmente:

```bash
cd backend
LOCAL_STUB=true npm run dev
```

## Comportamento do Modo Stub

- ✅ **Repositório**: Memória (Map/Array)
- ✅ **Firebase Admin**: Desabilitado
- ✅ **Cloud Storage**: Ignorado, usa `.tmp`
- ✅ **Autenticação**: Mockada (usuário padrão)
- ✅ **PDFs**: Salvos em `backend/.tmp/`
- ✅ **Servir PDFs**: Via `GET /api/files/:filename`

## Avisos Implementados

1. **Console**: Banner visual ao iniciar servidor
2. **Health Check**: Retorna `stub: true` quando ativo
3. **Documentação**: `MODO_STUB.md` com avisos claros

## Limitações Documentadas

- Dados perdidos ao reiniciar
- Autenticação não real
- Não representa produção
- Usado apenas para desenvolvimento

