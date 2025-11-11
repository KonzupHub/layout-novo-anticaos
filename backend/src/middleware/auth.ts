import { Request, Response, NextFunction } from 'express';
import { getAuth } from '../services/firebase-admin.js';
import { getRepository } from '../repo/index.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    cnpj: string;
    email: string;
  };
}

export async function verifyAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const isStubMode = process.env.LOCAL_STUB === 'true';
    
    if (isStubMode) {
      // Modo stub: aceita qualquer token ou cria usuário padrão
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Em modo stub, cria um usuário padrão se não houver token
        const repo = getRepository();
        const stubUser = await repo.getUserByUid('stub-user-uid');
        
        if (!stubUser) {
          // Cria agência e usuário padrão para desenvolvimento
          const agency = await repo.createAgency('12345678000190', 'Agencia Demo', 'São Paulo');
          await repo.createUser('stub-user-uid', agency.cnpj, 'dev@demo.com', 'Dev Demo', 'user');
        }
        
        req.user = {
          uid: 'stub-user-uid',
          cnpj: '12345678000190',
          email: 'dev@demo.com',
        };
        next();
        return;
      }
      
      // Se houver token, tenta usar normalmente mas aceita qualquer valor válido
      const idToken = authHeader.split('Bearer ')[1];
      
      // Em modo stub, cria ou busca usuário padrão
      const repo = getRepository();
      let user = await repo.getUserByUid('stub-user-uid');
      
      if (!user) {
        const agency = await repo.createAgency('12345678000190', 'Agencia Demo', 'São Paulo');
        user = await repo.createUser('stub-user-uid', agency.cnpj, 'dev@demo.com', 'Dev Demo', 'user');
      }
      
      req.user = {
        uid: user.uid,
        cnpj: user.cnpj,
        email: user.email,
      };
      
      next();
      return;
    }

    // Modo normal: verifica token com Firebase
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        ok: false,
        error: 'Token de autenticação não fornecido',
      });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      res.status(401).json({
        ok: false,
        error: 'Token de autenticação inválido',
      });
      return;
    }

    // Verifica o token com Firebase Admin
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Busca dados do usuário no repositório
    const repo = getRepository();
    const user = await repo.getUserByUid(decodedToken.uid);
    
    if (!user) {
      res.status(401).json({
        ok: false,
        error: 'Usuário não encontrado',
      });
      return;
    }

    // Injeta dados do usuário na request
    req.user = {
      uid: user.uid,
      cnpj: user.cnpj,
      email: user.email,
    };

    next();
  } catch (error: any) {
    console.error('Erro na autenticação:', error);
    res.status(401).json({
      ok: false,
      error: 'Token de autenticação inválido ou expirado',
      details: error.message,
    });
  }
}
