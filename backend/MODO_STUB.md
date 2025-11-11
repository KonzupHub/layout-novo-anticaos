# Modo LOCAL_STUB - Desenvolvimento sem Credenciais Google

## ⚠️ ATENÇÃO: Desenvolvimento Apenas

O modo `LOCAL_STUB` foi criado para permitir desenvolvimento local **sem necessidade de credenciais do Google Cloud**. 

**NÃO USE EM PRODUÇÃO!**

## O Que Acontece no Modo STUB

Quando `LOCAL_STUB=true`:

1. **Repositório em Memória**: Todos os dados (cases, waitlist, users, agencies) são armazenados em memória
   - ✅ Funciona sem Firestore
   - ❌ Dados são perdidos ao reiniciar o servidor

2. **Firebase Admin Desabilitado**: Não tenta conectar ao Firebase
   - ✅ Funciona sem credenciais
   - ❌ Autenticação real não funciona

3. **Storage Local**: PDFs são salvos em `backend/.tmp` ao invés do Cloud Storage
   - ✅ Funciona sem Cloud Storage
   - ✅ Arquivos servidos via `http://localhost:8080/api/files/:filename`

4. **Autenticação Mockada**: Aceita qualquer token ou cria usuário padrão
   - Usuário padrão: `dev@demo.com` com CNPJ `12345678000190`
   - ✅ Funciona sem Firebase Auth
   - ❌ Não valida tokens reais

## Como Usar

### Opção 1: Variável de Ambiente

```bash
cd backend
LOCAL_STUB=true npm run dev
```

### Opção 2: Script NPM

```bash
cd backend
npm run dev:stub
```

### Opção 3: Arquivo .env

Adicione no `backend/.env`:
```
LOCAL_STUB=true
```

Depois rode normalmente:
```bash
npm run dev
```

## Verificação

Após iniciar, você verá no console:

```
⚠️  ════════════════════════════════════════════════════════════
   MODO STUB ATIVO - DESENVOLVIMENTO APENAS
   ⚠️  NÃO USE EM PRODUÇÃO
   - Dados em memória (perdidos ao reiniciar)
   - Autenticação mockada
   - PDFs salvos em backend/.tmp
   ════════════════════════════════════════════════════════════
```

## Estrutura de Dados Mock

No modo stub, um usuário padrão é criado automaticamente:

- **UID**: `stub-user-uid`
- **Email**: `dev@demo.com`
- **CNPJ**: `12345678000190`
- **Agência**: "Agencia Demo" - São Paulo

Você pode criar casos, waitlist, etc. normalmente - tudo ficará em memória.

## Limitações

1. ❌ Dados não persistem após reiniciar
2. ❌ Autenticação não é real (aceita qualquer token)
3. ❌ Não representa comportamento de produção
4. ❌ CSV parsing funciona, mas compara com dados em memória

## Quando Usar

✅ **Use quando:**
- Desenvolvendo features frontend
- Testando fluxos sem setup completo
- Prototipando sem credenciais

❌ **NÃO use quando:**
- Testando autenticação real
- Validando comportamento de produção
- Testando integração com Google Cloud
- Em qualquer ambiente de produção

## Arquivos Criados

O modo stub cria a pasta `backend/.tmp/` para armazenar PDFs gerados. Esta pasta está no `.gitignore`.

