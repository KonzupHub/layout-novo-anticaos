import { Router, Response } from 'express';
import multer from 'multer';
import { AuthenticatedRequest, verifyAuth } from '../middleware/auth.js';
import { parseCSV } from '../services/csv.js';

const router = Router();
router.use(verifyAuth);

// Configuração do multer para upload de arquivos em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos CSV são permitidos'));
    }
  },
});

router.post('/', upload.single('file'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({
        ok: false,
        error: 'Arquivo CSV não fornecido',
      });
      return;
    }

    const cnpj = req.user!.cnpj;
    const buffer = req.file.buffer;

    // Processa o CSV
    const resultado = await parseCSV(buffer, cnpj);

    res.status(200).json({
      ok: true,
      data: resultado,
    });
  } catch (error: any) {
    console.error('Erro ao processar CSV:', error);
    res.status(500).json({
      ok: false,
      error: 'Erro ao processar arquivo CSV',
      details: error.message,
    });
  }
});

export default router;
