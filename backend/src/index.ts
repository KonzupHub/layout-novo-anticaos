import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeFirebaseAdmin } from './services/firebase-admin.js';
import waitlistRouter from './routes/waitlist.js';
import earlyAccessRouter from './routes/early-access.js';
import authRouter from './routes/auth.js';
import casesRouter from './routes/cases.js';
import uploadRouter from './routes/upload.js';
import iaRouter from './routes/ia.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializa Firebase Admin
initializeFirebaseAdmin();

const app = express();
const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Função para processar múltiplas origens
const getCorsOrigins = (): string | string[] => {
  if (!CORS_ORIGIN) {
    // Fallback padrão: permite localhost e domínios de produção conhecidos
    return [
      'http://localhost:5173',
      'https://ordem.konzuphub.com',
      'https://anti-caos-konzup.pages.dev',
    ];
  }
  
  // Se contém vírgula, retorna array de origens
  if (CORS_ORIGIN.includes(',')) {
    return CORS_ORIGIN.split(',').map(origin => origin.trim());
  }
  
  return CORS_ORIGIN;
};

// Função para verificar se a origem é permitida
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = getCorsOrigins();
    
    // Permite requisições sem origin (ex: Postman, curl)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Se allowedOrigins é array, verifica se origin está na lista
    if (Array.isArray(allowedOrigins)) {
      // Permite domínios de preview da Cloudflare Pages (terminam com .pages.dev)
      const isCloudflarePreview = origin.endsWith('.pages.dev');
      const isAllowed = allowedOrigins.includes(origin) || isCloudflarePreview;
      callback(null, isAllowed);
      return;
    }
    
    // Se allowedOrigins é string única, verifica se é a origem ou se é um dos domínios de produção
    if (typeof allowedOrigins === 'string') {
      // Lista de domínios de produção que sempre devem ser permitidos
      const productionOrigins = [
        'https://ordem.konzuphub.com',
        'https://anti-caos-konzup.pages.dev',
      ];
      const isCloudflarePreview = origin.endsWith('.pages.dev');
      const isAllowed = origin === allowedOrigins || productionOrigins.includes(origin) || isCloudflarePreview;
      callback(null, isAllowed);
      return;
    }
    
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'content-type', 'Authorization', 'authorization', 'X-Requested-With', 'x-requested-with', 'Origin', 'Accept', 'Referer'],
  exposedHeaders: ['Content-Type'],
  maxAge: 86400, // 24 horas
  optionsSuccessStatus: 204,
};

// Middlewares
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging básico
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/api/waitlist', waitlistRouter);
app.use('/api/early-access', earlyAccessRouter);
app.use('/api/auth', authRouter);
app.use('/api/cases', casesRouter);
app.use('/api/upload-csv', uploadRouter);
app.use('/api/ia', iaRouter);

// Rota para servir arquivos em modo stub
if (process.env.LOCAL_STUB === 'true') {
  const tmpDir = path.join(__dirname, '../.tmp');
  app.get('/api/files/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(tmpDir, filename);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Erro ao servir arquivo:', err);
        res.status(404).json({ ok: false, error: 'Arquivo não encontrado' });
      }
    });
  });
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  const isStubMode = process.env.LOCAL_STUB === 'true';
  res.status(200).json({
    ok: true,
    stub: isStubMode,
    message: isStubMode ? 'Modo STUB ativo - Desenvolvimento apenas' : undefined,
  });
});

// Tratamento de erros global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    ok: false,
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Rota 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: 'Rota não encontrada',
  });
});

// Inicia servidor
app.listen(PORT, () => {
  const isStubMode = process.env.LOCAL_STUB === 'true';
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🌐 CORS origin: ${CORS_ORIGIN}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  
  if (isStubMode) {
    console.log(`\n⚠️  ════════════════════════════════════════════════════════════`);
    console.log(`   MODO STUB ATIVO - DESENVOLVIMENTO APENAS`);
    console.log(`   ⚠️  NÃO USE EM PRODUÇÃO`);
    console.log(`   - Dados em memória (perdidos ao reiniciar)`);
    console.log(`   - Autenticação mockada`);
    console.log(`   - PDFs salvos em backend/.tmp`);
    console.log(`   ════════════════════════════════════════════════════════════\n`);
  }
});
