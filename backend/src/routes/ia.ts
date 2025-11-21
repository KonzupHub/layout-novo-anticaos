import { Router, Request, Response } from 'express';
import { AuthenticatedRequest, verifyAuth } from '../middleware/auth.js';
import { sugerirResumoCaso } from '../services/gemini.js';
import { interpretarCasoANAC } from '../services/anacRules.js';
import { getRepository } from '../repo/index.js';

const router = Router();

/**
 * POST /api/ia/sugerir-resumo
 * 
 * MVP 2.0: Gera um resumo de caso usando IA (Gemini Vertex AI)
 * Aceita casoId opcional para buscar dados completos e contexto ANAC
 * 
 * Body JSON (modo simples):
 * {
 *   "tipo": "atraso",
 *   "descricao": "voo atrasou 5 horas, passageiro perdeu conexão e ficou sem assistência",
 *   "prazoDias": 7
 * }
 * 
 * Body JSON (modo completo com casoId):
 * {
 *   "casoId": "abc123"
 * }
 * 
 * Resposta de sucesso:
 * {
 *   "ok": true,
 *   "resumo": "texto gerado pelo Gemini",
 *   "mensagemSugerida": "mensagem opcional para cliente"
 * }
 * 
 * Resposta de erro:
 * {
 *   "ok": false,
 *   "error": "mensagem simples em português"
 * }
 */
router.post('/sugerir-resumo', verifyAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { casoId, tipo, descricao, prazoDias } = req.body;
    const cnpj = req.user!.cnpj;

    let tipoFinal: string;
    let descricaoFinal: string;
    let prazoDiasFinal: number;
    let anacResumo;

    // MVP 2.0: Se casoId fornecido, busca caso completo e contexto ANAC
    if (casoId) {
      const repo = getRepository();
      const caso = await repo.getCaseById(casoId);
      
      if (!caso) {
        res.status(404).json({
          ok: false,
          error: 'Caso não encontrado',
        });
        return;
      }

      // Verifica permissão
      if (caso.cnpj !== cnpj) {
        res.status(403).json({
          ok: false,
          error: 'Sem permissão para acessar este caso',
        });
        return;
      }

      // Usa dados do caso
      tipoFinal = caso.tipo;
      descricaoFinal = caso.timelineIncidente || caso.notas || 'Sem descrição detalhada';
      
      // Calcula prazo em dias: se há prazos ANAC calculados, usa o primeiro; senão, fallback
      const anacTemp = interpretarCasoANAC(caso);
      if (anacTemp.prazosImportantes.length > 0 && anacTemp.prazosImportantes[0].diasRestantes !== undefined) {
        prazoDiasFinal = anacTemp.prazosImportantes[0].diasRestantes;
        if (prazoDiasFinal < 0) prazoDiasFinal = 0;
      } else {
        prazoDiasFinal = 7; // Fallback
      }

      // Calcula interpretação ANAC
      anacResumo = interpretarCasoANAC(caso);
    } else {
      // Modo simples (compatibilidade com versão anterior)
      if (!tipo || typeof tipo !== 'string') {
        res.status(400).json({
          ok: false,
          error: 'Campo "tipo" é obrigatório e deve ser uma string, ou forneça "casoId"',
        });
        return;
      }

      if (!descricao || typeof descricao !== 'string') {
        res.status(400).json({
          ok: false,
          error: 'Campo "descricao" é obrigatório e deve ser uma string, ou forneça "casoId"',
        });
        return;
      }

      if (prazoDias === undefined || typeof prazoDias !== 'number' || prazoDias < 0) {
        res.status(400).json({
          ok: false,
          error: 'Campo "prazoDias" é obrigatório e deve ser um número positivo, ou forneça "casoId"',
        });
        return;
      }

      tipoFinal = tipo;
      descricaoFinal = descricao;
      prazoDiasFinal = prazoDias;
    }

    // Chama o serviço de IA com tratamento seguro de erros
    let resumo: string;
    let mensagemSugerida: string | undefined;

    try {
      resumo = await sugerirResumoCaso({
        tipo: tipoFinal,
        descricao: descricaoFinal,
        prazoDias: prazoDiasFinal,
        anacResumo,
      });

      // Gera mensagem sugerida opcional (versão mais curta)
      if (anacResumo && anacResumo.direitosBasicos.length > 0) {
        mensagemSugerida = `Informamos que conforme Resolução 400 da ANAC, você tem direito a: ${anacResumo.direitosBasicos[0]}. Estamos trabalhando para resolver seu caso.`;
      }
    } catch (error: unknown) {
      // Log completo no servidor
      console.error('Erro ao gerar resumo com Vertex AI:', error);
      console.error('Detalhes:', {
        tipo: tipoFinal,
        casoId,
        cnpj,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Mensagem amigável para o frontend
      let mensagemErro = 'Não foi possível gerar resumo com IA no momento. O caso continua funcionando normalmente.';
      
      if (error instanceof Error) {
        if (error.message.includes('PERMISSION_DENIED') || error.message.includes('permissão')) {
          mensagemErro = 'Serviço de IA temporariamente indisponível. O caso foi salvo normalmente.';
        } else if (error.message.includes('QUOTA_EXCEEDED') || error.message.includes('Cota')) {
          mensagemErro = 'Limite de uso de IA atingido. O caso foi salvo normalmente.';
        }
      }

      // Retorna erro mas não quebra o fluxo
      res.status(200).json({
        ok: true,
        data: {
          resumo: null,
          mensagemSugerida: null,
          erroIA: mensagemErro,
        },
      });
      return;
    }

    res.status(200).json({
      ok: true,
      data: {
        resumo,
        mensagemSugerida,
      },
    });
  } catch (error: unknown) {
    console.error('Erro geral ao processar requisição de IA:', error);
    
    let mensagemErro = 'Erro ao processar requisição';
    
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

