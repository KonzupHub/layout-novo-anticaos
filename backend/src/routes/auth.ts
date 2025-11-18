import { Router, Request, Response } from 'express';
import { getAuth } from '../services/firebase-admin.js';
import { getRepository } from '../repo/index.js';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, senha, cnpj, nomeAgencia, cidade, nome } = req.body;

    // Validação de campos obrigatórios
    if (!email || !senha || !cnpj || !nomeAgencia || !cidade || !nome) {
      res.status(400).json({
        ok: false,
        error: 'Todos os campos são obrigatórios',
      });
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        ok: false,
        error: 'Email inválido',
      });
      return;
    }

    // Validação de senha mínima
    if (senha.length < 6) {
      res.status(400).json({
        ok: false,
        error: 'Senha deve ter no mínimo 6 caracteres',
      });
      return;
    }

    const isStubMode = process.env.LOCAL_STUB === 'true';
    const repo = getRepository();
    
    if (isStubMode) {
      // Modo stub: retorna token mockado sem criar no Firebase
      const stubUid = `stub-${Date.now()}`;
      const agency = await repo.getAgency(cnpj) || await repo.createAgency(cnpj, nomeAgencia, cidade);
      const user = await repo.createUser(stubUid, agency.cnpj, email, nome, 'user');
      
      // Retorna token mockado (frontend pode usar qualquer string como token em modo stub)
      res.status(201).json({
        ok: true,
        data: {
          uid: user.uid,
          email: user.email,
          customToken: 'stub-token-' + stubUid, // Token mockado
          message: 'Conta criada com sucesso (modo STUB)',
        },
      });
      return;
    }
    
    const auth = getAuth();

    // Cria usuário no Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password: senha,
      emailVerified: false,
    });

    try {
      // Cria ou atualiza agency
      let agency = await repo.getAgency(cnpj);
      if (!agency) {
        agency = await repo.createAgency(cnpj, nomeAgencia, cidade);
      }

      // Cria user
      await repo.createUser(userRecord.uid, cnpj, email, nome, 'user');

      // Não gera custom token (requer permissão iam.serviceAccounts.signBlob)
      // O frontend fará login direto com email/senha após receber sucesso
      res.status(201).json({
        ok: true,
        data: {
          uid: userRecord.uid,
          email: userRecord.email,
          message: 'Conta criada com sucesso. Faça login com seu email e senha.',
        },
      });
    } catch (firestoreError: any) {
      // Se falhar no Firestore, remove o usuário do Auth
      await auth.deleteUser(userRecord.uid);
      throw firestoreError;
    }
  } catch (error: any) {
    console.error('Erro ao criar conta:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem do erro:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Mapeia códigos específicos do Firebase Admin
    if (error.code === 'auth/email-already-exists') {
      res.status(409).json({
        ok: false,
        error: 'Email já cadastrado',
      });
      return;
    }
    
    if (error.code === 'auth/invalid-email') {
      res.status(400).json({
        ok: false,
        error: 'Email inválido',
      });
      return;
    }
    
    if (error.code === 'auth/weak-password') {
      res.status(400).json({
        ok: false,
        error: 'Senha muito fraca',
      });
      return;
    }
    
    if (error.code === 'auth/operation-not-allowed') {
      res.status(500).json({
        ok: false,
        error: 'Operação não permitida. Verifique a configuração do Firebase Auth.',
        details: error.message,
      });
      return;
    }
    
    if (error.code === 'auth/insufficient-permission') {
      res.status(500).json({
        ok: false,
        error: 'Erro de permissão no Firebase. Verifique as configurações do serviço.',
        details: error.message,
      });
      return;
    }

    // Erro genérico com detalhes para debug
    res.status(500).json({
      ok: false,
      error: 'Erro ao criar conta',
      details: error.message || 'Erro desconhecido',
      code: error.code || 'unknown',
    });
  }
});

// Endpoint de login removido - será gerenciado pelo Firebase SDK no frontend
// O cliente fará login direto no Firebase Auth e receberá um idToken
// que será usado nas requisições autenticadas

export default router;
