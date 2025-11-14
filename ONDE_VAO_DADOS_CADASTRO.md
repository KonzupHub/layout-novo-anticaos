# 📍 Onde vão os dados quando uma pessoa se cadastra?

Quando alguém cria uma conta no Konzup Hub, os dados são salvos em **dois lugares no Firebase**:

## 1. **Firebase Authentication** 🔐
- **E-mail** e **senha** são salvos no Firebase Authentication
- O Firebase gerencia a autenticação e segurança das credenciais
- Cada usuário recebe um `uid` (User ID) único

## 2. **Firestore Database** 📊

### Collection `agencies` (Agências)
Armazena dados da empresa:
- `cnpj`: CNPJ da agência (gerado automaticamente como `00000000000000` - campo interno, não coletado do usuário)
- `nome`: Nome da empresa (campo "Nome da empresa" do formulário)
- `cidade`: Cidade da agência (gerado automaticamente como "São Paulo" - campo interno, não coletado do usuário)
- `createdAt`: Data de criação

### Collection `users` (Usuários)
Armazena dados do usuário:
- `uid`: ID único do usuário (vem do Firebase Auth)
- `cnpj`: CNPJ da agência vinculada (gerado automaticamente - campo interno)
- `email`: E-mail do usuário (coletado no formulário)
- `nome`: Nome do usuário (gerado automaticamente a partir do e-mail - campo interno)
- `role`: Papel do usuário (padrão: `'user'`)
- `createdAt`: Data de criação

## 🔄 Fluxo de Cadastro

1. **Frontend** (`src/pages/Cadastro.tsx`):
   - Usuário preenche apenas: **Nome da empresa**, **E-mail**, **Senha**, **Confirme sua senha**
   - Validação: senhas coincidem, senha tem no mínimo 6 caracteres
   - Dica de senha forte é exibida no campo

2. **Backend** (`backend/src/routes/auth.ts`):
   - Recebe os dados do frontend
   - Gera automaticamente:
     - `cnpj`: `00000000000000` (padrão interno)
     - `cidade`: `São Paulo` (padrão interno)
     - `nome`: Parte antes do `@` do e-mail (ex: `joao@empresa.com` → nome = `joao`)
   - Cria usuário no **Firebase Authentication** (email + senha)
   - Cria ou atualiza agência na collection `agencies` do Firestore
   - Cria usuário na collection `users` do Firestore
   - Gera um token customizado para o frontend fazer login

3. **Frontend** (`src/lib/auth.tsx`):
   - Recebe o token customizado
   - Faz login automático usando `signInWithCustomToken`
   - Redireciona para o dashboard

## 📝 Campos do formulário vs. campos salvos

### Campos coletados do usuário:
- ✅ **Nome da empresa** → salvo em `agencies.nome`
- ✅ **E-mail** → salvo em Firebase Auth e `users.email`
- ✅ **Senha** → salvo apenas no Firebase Auth (criptografada)

### Campos gerados automaticamente (não coletados):
- 🔧 **CNPJ**: `00000000000000` (padrão interno)
- 🔧 **Cidade**: `São Paulo` (padrão interno)
- 🔧 **Nome do usuário**: Parte antes do `@` do e-mail (ex: `joao@empresa.com` → `joao`)

## 🔍 Como verificar os dados

### No Firebase Console:
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `ordem-em-dia`
3. **Authentication**: Veja os usuários cadastrados
4. **Firestore Database**: Veja as collections `agencies` e `users`

### Em modo LOCAL_STUB:
- Os dados são salvos apenas em memória (não persistem após reiniciar o servidor)
- Para testar com dados reais, desative `LOCAL_STUB=false` no `.env` do backend

