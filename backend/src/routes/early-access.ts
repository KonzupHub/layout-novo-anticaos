import { Router, Request, Response } from 'express';
import { getRepository } from '../repo/index.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({
        ok: false,
        error: 'Email é obrigatório',
      });
      return;
    }

    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        ok: false,
        error: 'Email inválido',
      });
      return;
    }

    const repo = getRepository();
    // Usa a mesma coleção waitlist para early access
    await repo.addToWaitlist(email);

    res.status(200).json({
      ok: true,
      data: {
        message: 'Email cadastrado com sucesso. Você será avisado quando o Konzup Hub estiver disponível!',
      },
    });
  } catch (error: any) {
    console.error('Erro ao salvar email no early access:', error);
    res.status(500).json({
      ok: false,
      error: 'Erro ao processar solicitação',
      details: error.message,
    });
  }
});

export default router;

