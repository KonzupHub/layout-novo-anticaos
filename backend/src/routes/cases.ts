import { Router, Request, Response } from 'express';
import { AuthenticatedRequest, verifyAuth } from '../middleware/auth.js';
import { getRepository } from '../repo/index.js';
import { generateCaseReport } from '../services/pdf.js';
import { uploadPDF, getSignedUrl } from '../services/storage.js';
import type { Case, CreateCaseDto, UpdateCaseDto } from '../types/shared.js';

const router = Router();

// Rota pública para casos de exemplo (não requer autenticação)
router.get('/examples', async (req: Request, res: Response) => {
  try {
    // Casos de exemplo estáticos para landing page
    const exampleCases: Case[] = [
      {
        id: 'example-1',
        cnpj: '00000000000000',
        passageiro: 'Maria Silva',
        localizador: 'ABC123',
        fornecedor: 'LATAM',
        tipo: 'atraso',
        prazo: 'Hoje, 18h',
        status: 'em_andamento',
        responsavel: {
          nome: 'João Santos',
          avatar: 'JS',
        },
        notas: 'Voo atrasado mais de 4 horas. Cliente aguardando reacomodação.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'example-2',
        cnpj: '00000000000000',
        passageiro: 'Pedro Costa',
        localizador: 'XYZ789',
        fornecedor: 'GOL',
        tipo: 'cancelamento',
        prazo: 'Amanhã, 10h',
        status: 'aguardando_resposta',
        responsavel: {
          nome: 'Ana Lima',
          avatar: 'AL',
        },
        notas: 'Voo cancelado. Cliente precisa de reembolso ou reacomodação urgente.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'example-3',
        cnpj: '00000000000000',
        passageiro: 'José Oliveira',
        localizador: 'DEF456',
        fornecedor: 'AZUL',
        tipo: 'overbooking',
        prazo: 'Hoje, 20h',
        status: 'documentacao_pendente',
        responsavel: {
          nome: 'Carlos Mendes',
          avatar: 'CM',
        },
        notas: 'Overbooking confirmado. Documentação para compensação pendente.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    res.status(200).json({
      ok: true,
      data: exampleCases,
    });
  } catch (error: any) {
    console.error('Erro ao retornar casos de exemplo:', error);
    res.status(500).json({
      ok: false,
      error: 'Erro ao processar solicitação',
      details: error.message,
    });
  }
});

// Todas as outras rotas de casos requerem autenticação
router.use(verifyAuth);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, tipo, ate } = req.query;
    const cnpj = req.user!.cnpj;

    const filters: any = {};
    if (status) filters.status = status as string;
    if (tipo) filters.tipo = tipo as string;
    if (ate) filters.ate = ate as string;

    const repo = getRepository();
    const cases = await repo.getCasesByCnpj(cnpj, filters);

    res.status(200).json({
      ok: true,
      data: cases,
    });
  } catch (error: any) {
    console.error('Erro ao listar casos:', error);
    res.status(500).json({
      ok: false,
      error: 'Erro ao listar casos',
      details: error.message,
    });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const cnpj = req.user!.cnpj;
    const {
      passageiro,
      localizador,
      fornecedor,
      tipo,
      prazo,
      status,
      responsavel,
      notas,
    } = req.body;

    // Validação de campos obrigatórios
    if (!passageiro || !localizador || !fornecedor || !tipo || !prazo || !status || !responsavel?.nome) {
      res.status(400).json({
        ok: false,
        error: 'Campos obrigatórios: passageiro, localizador, fornecedor, tipo, prazo, status, responsavel.nome',
      });
      return;
    }

    const caseData: CreateCaseDto = {
      passageiro,
      localizador,
      fornecedor,
      tipo,
      prazo,
      status,
      responsavel,
      notas,
    };

    const repo = getRepository();
    const newCase = await repo.createCase(cnpj, caseData);

    res.status(201).json({
      ok: true,
      data: newCase,
    });
  } catch (error: any) {
    console.error('Erro ao criar caso:', error);
    res.status(500).json({
      ok: false,
      error: 'Erro ao criar caso',
      details: error.message,
    });
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const cnpj = req.user!.cnpj;
    const { status, responsavel, notas, prazo } = req.body;

    const repo = getRepository();
    
    // Verifica se o caso existe e pertence ao CNPJ do usuário
    const existingCase = await repo.getCaseById(id);
    if (!existingCase) {
      res.status(404).json({
        ok: false,
        error: 'Caso não encontrado',
      });
      return;
    }

    if (existingCase.cnpj !== cnpj) {
      res.status(403).json({
        ok: false,
        error: 'Sem permissão para atualizar este caso',
      });
      return;
    }

    // Valida campos permitidos
    const updates: UpdateCaseDto = {};
    if (status !== undefined) updates.status = status;
    if (responsavel !== undefined) updates.responsavel = responsavel;
    if (notas !== undefined) updates.notas = notas;
    if (prazo !== undefined) updates.prazo = prazo;

    const updatedCase = await repo.updateCase(id, updates);

    res.status(200).json({
      ok: true,
      data: updatedCase,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar caso:', error);
    res.status(500).json({
      ok: false,
      error: 'Erro ao atualizar caso',
      details: error.message,
    });
  }
});

router.post('/:id/pdf', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const cnpj = req.user!.cnpj;

    const repo = getRepository();
    
    // Busca o caso
    const caso = await repo.getCaseById(id);
    if (!caso) {
      res.status(404).json({
        ok: false,
        error: 'Caso não encontrado',
      });
      return;
    }

    // Verifica se o caso pertence ao CNPJ do usuário
    if (caso.cnpj !== cnpj) {
      res.status(403).json({
        ok: false,
        error: 'Sem permissão para gerar PDF deste caso',
      });
      return;
    }

    // Busca dados da agência para incluir no PDF
    const agencia = await repo.getAgency(cnpj);

    // Gera o PDF com os dados da agência
    const pdfDoc = await generateCaseReport(caso, agencia);
    const pdfBytes = await pdfDoc.save();

    // Faz upload no Cloud Storage
    const filename = `casos/${cnpj}/${id}-${Date.now()}.pdf`;
    await uploadPDF(pdfBytes, filename);

    // Gera URL assinada
    const signedUrl = await getSignedUrl(filename);

    res.status(200).json({
      ok: true,
      data: {
        url: signedUrl,
        filename,
      },
    });
  } catch (error: any) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({
      ok: false,
      error: 'Erro ao gerar PDF do caso',
      details: error.message,
    });
  }
});

export default router;
