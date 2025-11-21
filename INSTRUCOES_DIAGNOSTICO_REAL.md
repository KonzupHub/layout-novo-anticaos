# Instruções para Diagnóstico Real

## Frontend está rodando

O frontend está disponível em: **http://localhost:5173** (ou verifique a porta no terminal)

---

## 1. Código Atual do Menu Lateral

### Arquivo: `src/components/layout/AppSidebar.tsx`

**Classes CSS atuais para o NavLink** (linhas 54-62):

```typescript
className={({ isActive }) =>
  cn(
    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all relative",
    "w-full text-left",
    isActive
      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-sm before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary-foreground before:rounded-l-md"
      : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  )
}
```

**Resumo das classes atuais**:

**Estado Ativo** (`isActive === true`):
- `bg-gradient-to-r from-primary to-primary/80` - Gradiente horizontal de fundo
- `text-primary-foreground` - Texto com cor do foreground do primary
- `hover:from-primary/90 hover:to-primary/70` - Hover com gradiente mais intenso
- `shadow-sm` - Sombra sutil
- `before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary-foreground before:rounded-l-md` - Barra vertical esquerda (pseudo-elemento)

**Estado Normal** (`isActive === false`):
- `text-foreground` - Texto padrão
- `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground` - Hover com fundo accent

---

## 2. Como Capturar Informações do Botão "Gerar Parecer com IA"

### Passo a passo:

1. **Abra o navegador** em `http://localhost:5173`

2. **Abra o DevTools**:
   - Chrome/Edge: `F12` ou `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Firefox: `F12` ou `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)

3. **Faça login** no sistema (use um usuário de teste válido)

4. **Navegue até um caso**:
   - Vá em "Casos" no menu lateral
   - Clique em "Ver caso" em qualquer caso existente
   - OU crie um novo caso primeiro

5. **Prepare o DevTools**:
   - **Aba Network**: 
     - Clique no ícone de "limpar" (lixeira) para limpar a lista
     - Marque a opção "Preserve log" (para não perder logs ao navegar)
     - Filtre por "Fetch/XHR" se houver essa opção
   
   - **Aba Console**:
     - Clique no ícone de "limpar" (lixeira) para limpar o console

6. **Role a página** até a seção "Resumo do Caso (IA)"

7. **Clique no botão "Gerar Parecer com IA"**

8. **Capture as informações**:

### Aba Network:

1. Localize a requisição chamada `sugerir-resumo` ou `/ia/sugerir-resumo`
2. Clique nela
3. Na aba **Headers**:
   - Copie a **Request URL** completa
   - Copie o **Request Method** (deve ser POST)
   - Em **Request Headers**, copie todos os headers (especialmente `Authorization` e `Content-Type`)
4. Na aba **Payload** ou **Request**:
   - Copie o JSON completo do body (deve ser algo como `{"casoId":"..."}`)
5. Na aba **Response**:
   - Copie o JSON completo da resposta do backend
6. Anote o **Status Code** (200, 400, 401, 403, 404, 500, etc.)

### Aba Console:

1. Procure por qualquer mensagem em **vermelho** (erros)
2. Procure por logs que começam com `[API]` (esses são logs do frontend)
3. Copie todas as mensagens de erro e logs relevantes

---

## 3. Informações Esperadas (para referência)

### Requisição esperada:

- **Nome**: `sugerir-resumo` ou `/ia/sugerir-resumo`
- **URL**: `https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api/ia/sugerir-resumo` (produção) ou `http://localhost:8080/api/ia/sugerir-resumo` (dev local)
- **Método**: `POST`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "casoId": "<id-do-caso>"
  }
  ```

### Possíveis respostas:

**Sucesso com IA**:
```json
{
  "ok": true,
  "resumo": "Texto gerado...",
  "mensagemSugerida": "Mensagem sugerida..."
}
```

**IA falhou (mas ok: true)**:
```json
{
  "ok": true,
  "resumo": null,
  "mensagemSugerida": null,
  "erroIA": "Serviço de IA temporariamente indisponível..."
}
```

**Erro (ok: false)**:
```json
{
  "ok": false,
  "error": "Mensagem de erro"
}
```

---

## 4. O Que Fazer Depois

Após capturar as informações reais:

1. **Cole aqui no chat**:
   - URL completa da requisição
   - Status code
   - Body da requisição (JSON)
   - Body da resposta (JSON completo)
   - Qualquer erro do Console

2. **Eu vou analisar** e propor a correção exata necessária

---

**IMPORTANTE**: Não altere nenhum código ainda. Apenas capture as informações reais do Network e Console.

