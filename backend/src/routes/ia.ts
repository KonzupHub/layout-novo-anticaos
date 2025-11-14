import { Router, Request, Response } from 'express';
import { sugerirResumoCaso } from '../services/gemini.js';

const router = Router();

/**
 * POST /api/ia/sugerir-resumo
 * 
 * Gera um resumo de caso usando IA (Gemini Vertex AI)
 * 
 * Body JSON:
 * {
 *   "tipo": "atraso",
 *   "descricao": "voo atrasou 5 horas, passageiro perdeu conexão e ficou sem assistência",
 *   "prazoDias": 7
 * }
 * 
 * Resposta de sucesso:
 * {
 *   "ok": true,
 *   "resumo": "texto gerado pelo Gemini"
 * }
 * 
 * Resposta de erro:
 * {
 *   "ok": false,
 *   "error": "mensagem simples em português"
 * }
 * 
 * NOTA: Em produção, é recomendado proteger esta rota com autenticação
 * para evitar uso indevido e controlar custos da API do Vertex AI.
 */
router.post('/sugerir-resumo', async (req: Request, res: Response) => {
  try {
    const { tipo, descricao, prazoDias } = req.body;

    // Validação dos campos obrigatórios
    if (!tipo || typeof tipo !== 'string') {
      res.status(400).json({
        ok: false,
        error: 'Campo "tipo" é obrigatório e deve ser uma string',
      });
      return;
    }

    if (!descricao || typeof descricao !== 'string') {
      res.status(400).json({
        ok: false,
        error: 'Campo "descricao" é obrigatório e deve ser uma string',
      });
      return;
    }

    if (prazoDias === undefined || typeof prazoDias !== 'number' || prazoDias < 0) {
      res.status(400).json({
        ok: false,
        error: 'Campo "prazoDias" é obrigatório e deve ser um número positivo',
      });
      return;
    }

    // Chama o serviço de IA
    const resumo = await sugerirResumoCaso({
      tipo,
      descricao,
      prazoDias,
    });

    res.status(200).json({
      ok: true,
      resumo,
    });
  } catch (error: unknown) {
    console.error('Erro ao gerar resumo:', error);
    
    let mensagemErro = 'Erro ao gerar resumo do caso';
    
    if (error instanceof Error) {
      mensagemErro = error.message;
    }

    res.status(500).json({
      ok: false,
      error: mensagemErro,
    });
  }
});

export default router;

