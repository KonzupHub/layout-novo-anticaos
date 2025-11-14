# Configurar Build na Interface do Cloudflare Pages

## ⚠️ Importante

O Wrangler CLI não tem comando direto para atualizar configurações de build de projetos Pages existentes. A forma mais simples é pela interface web.

## Passo a Passo Rápido (2 minutos)

### 1. Acesse o Projeto

1. Abra: https://dash.cloudflare.com/
2. Clique em **Workers & Pages** (no menu lateral)
3. Clique em **Pages**
4. Clique no projeto **anti-caos-konzup**

### 2. Vá em Settings

1. No menu superior do projeto, clique em **Settings** (Configurações)
2. Role a página para baixo

### 3. Encontre "Builds & deployments"

Procure por uma seção chamada:
- **"Builds & deployments"** OU
- **"Build configuration"** OU  
- **"Build settings"**

### 4. Configure os Campos

Você verá campos como:

**Build command:**
```
npm install && npm run build
```

**Build output directory:**
```
dist
```

**Root directory (opcional):**
```
/ (deixe vazio ou coloque /)
```

### 5. Salve

1. Clique em **Save** (Salvar)
2. Aguarde a confirmação

### 6. Faça Novo Deploy

1. Vá na aba **Deployments** (Implantações)
2. Clique nos três pontos (`...`) no deploy mais recente
3. Clique em **Retry deployment** (Tentar novamente)
4. Aguarde 2-5 minutos

---

## Se Não Encontrar a Seção

Às vezes a seção de build está em:
- **Settings** > **Builds & deployments**
- Ou pode estar na primeira tela ao criar o projeto

Se realmente não encontrar, me avise e posso tentar outra abordagem.

---

## Alternativa: Criar Novo Projeto (Não Recomendado)

Se não conseguir encontrar as configurações, podemos criar um novo projeto com as configurações corretas, mas isso não é necessário - a seção deve estar lá.

