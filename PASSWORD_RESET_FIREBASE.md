# 🔐 Configuração de Recuperação de Senha no Firebase

## ✅ Status Atual

A funcionalidade de "Esqueci minha senha" **já está implementada e funcionando** no código!

A página `/esqueci-senha` usa `sendPasswordResetEmail` do Firebase, que funciona automaticamente quando:
- ✅ Firebase Authentication está ativo
- ✅ Método Email/Password está habilitado
- ✅ O projeto Firebase está configurado corretamente

## 🎯 O que já está funcionando

1. **Frontend** (`src/pages/EsqueciSenha.tsx`):
   - Usuário digita o e-mail
   - Chama `sendPasswordResetEmail(auth, email)`
   - Firebase envia e-mail automaticamente
   - Usuário recebe link para redefinir senha

2. **Firebase**:
   - Envia e-mail com link de recuperação
   - Link expira após 1 hora (padrão)
   - Usuário clica no link e redefine a senha

## ⚙️ Configuração no Firebase Console (Opcional)

Se quiser personalizar o e-mail de recuperação:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `ordem-em-dia`
3. Vá em **Authentication** → **Templates**
4. Clique em **Password reset**
5. Personalize:
   - Assunto do e-mail
   - Corpo do e-mail
   - Link de ação
   - Nome do remetente

## 📧 Template Padrão do Firebase

O Firebase já envia um e-mail padrão com:
- Assunto: "Redefina sua senha"
- Corpo: Instruções para redefinir a senha
- Link: Válido por 1 hora
- Ação: Abre página do Firebase para redefinir senha

## 🔍 Verificação

Para testar se está funcionando:

1. Acesse `/esqueci-senha`
2. Digite um e-mail cadastrado
3. Clique em "Enviar link de recuperação"
4. Verifique a caixa de entrada do e-mail
5. Clique no link recebido
6. Redefina a senha

## ⚠️ Importante

- O e-mail de recuperação é enviado **automaticamente** pelo Firebase
- Não precisa configurar servidor de e-mail próprio
- O link funciona mesmo em desenvolvimento local
- O Firebase gerencia a segurança e expiração do link

## 🚀 Próximos Passos

Nenhuma ação adicional necessária! A funcionalidade já está pronta para uso.

Se quiser personalizar o e-mail, siga os passos acima no Firebase Console.

