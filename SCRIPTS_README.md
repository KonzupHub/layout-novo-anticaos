# Scripts Disponíveis - Konzup Hub

## 🚀 Scripts Principais

### Na Raiz do Projeto

#### `npm run dev`
- **O que faz**: Inicia apenas o frontend (Vite)
- **Porta**: http://localhost:5173
- **Quando usar**: Quando você já tem o backend rodando separadamente

#### `npm run dev:all` ⭐ **RECOMENDADO PARA DESENVOLVIMENTO**
- **O que faz**: Inicia backend (modo STUB) e frontend juntos
- **Backend**: http://localhost:8080 (modo STUB - sem credenciais Google)
- **Frontend**: http://localhost:5173
- **Quando usar**: Para desenvolvimento completo sem precisar de credenciais

#### `npm run build`
- **O que faz**: Build de produção do frontend
- **Saída**: Pasta `dist/`

#### `npm run lint`
- **O que faz**: Executa o linter ESLint

### No Backend (`cd backend`)

#### `npm run dev`
- **O que faz**: Inicia backend normal (requer credenciais Google)
- **Porta**: http://localhost:8080

#### `npm run dev:stub` ⭐ **DESENVOLVIMENTO SEM CREDENCIAIS**
- **O que faz**: Inicia backend em modo STUB (memória)
- **Porta**: http://localhost:8080
- **Vantagem**: Não precisa de credenciais do Google Cloud

#### `npm run build`
- **O que faz**: Compila TypeScript para JavaScript
- **Saída**: Pasta `dist/`

#### `npm start`
- **O que faz**: Roda o build compilado em produção

## 📝 Script de Testes

### `./scripts/curl-exemplos.sh`
- **O que faz**: Testa todas as rotas da API com exemplos
- **Requisitos**: Backend deve estar rodando
- **Uso**: `./scripts/curl-exemplos.sh` ou `bash scripts/curl-exemplos.sh`

**Rotas testadas:**
1. ✅ `GET /api/health` - Health check
2. ✅ `POST /api/waitlist` - Cadastro de email
3. ✅ `POST /api/auth/signup` - Criar conta
4. ℹ️ `POST /api/auth/login` - Nota: feito via Firebase SDK no frontend
5. ✅ `GET /api/cases` - Listar casos (requer auth)
6. ✅ `POST /api/cases` - Criar caso (requer auth)
7. ✅ `POST /api/cases/:id/pdf` - Gerar PDF (requer auth)
8. ✅ `POST /api/upload-csv` - Upload CSV (requer auth e arquivo)

## 🎯 Comandos para Começar

### Primeira vez (instalar dependências)
```bash
# Na raiz do projeto
npm install

# No backend
cd backend && npm install && cd ..
```

### Desenvolvimento (1 comando)
```bash
npm run dev:all
```

Isso vai:
- ✅ Instalar `concurrently` se ainda não estiver instalado
- ✅ Iniciar backend em modo STUB (porta 8080)
- ✅ Iniciar frontend (porta 5173)
- ✅ Mostrar logs de ambos no mesmo terminal

## 📋 Arquivo CSV de Teste

Localizado em: `tests/planilha-exemplo.csv`

**Colunas:**
- passageiro
- localizador
- voo
- fornecedor
- tipo
- prazo
- status
- responsavel
- notas

**Uso:** Para testar o endpoint `POST /api/upload-csv`

## 🔍 Verificação Rápida

Após executar `npm run dev:all`, você deve ver:

1. **Backend**:
   ```
   ⚠️  ════════════════════════════════════════════════════════════
      MODO STUB ATIVO - DESENVOLVIMENTO APENAS
      ⚠️  NÃO USE EM PRODUÇÃO
   ```

2. **Frontend**:
   ```
   VITE v5.x.x  ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```

3. **Teste rápido**:
   ```bash
   curl http://localhost:8080/api/health
   ```

## 🛠️ Troubleshooting

### Erro: `concurrently: command not found`
**Solução:**
```bash
npm install
```

### Backend não inicia
**Solução:**
```bash
cd backend
npm install
npm run dev:stub
```

### Porta já em uso
**Solução:** Feche outros processos nas portas 8080 ou 5173

### Frontend não conecta ao backend
**Verifique:** Arquivo `.env` na raiz com `VITE_API_BASE=http://localhost:8080/api`

