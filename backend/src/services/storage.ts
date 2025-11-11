import { Storage } from '@google-cloud/storage';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let storage: Storage | null = null;

function getStorage(): Storage {
  if (!storage) {
    storage = new Storage({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT,
    });
  }
  return storage;
}

async function ensureTmpDir(): Promise<string> {
  const tmpDir = path.join(__dirname, '../../.tmp');
  try {
    await fs.mkdir(tmpDir, { recursive: true });
  } catch (error) {
    // Diretório já existe ou erro ao criar
  }
  return tmpDir;
}

export async function uploadPDF(buffer: Uint8Array, filename: string): Promise<void> {
  const isStubMode = process.env.LOCAL_STUB === 'true';

  if (isStubMode) {
    // Modo stub: salva em .tmp
    const tmpDir = await ensureTmpDir();
    const filePath = path.join(tmpDir, path.basename(filename));
    await fs.writeFile(filePath, Buffer.from(buffer));
    console.log(`📁 PDF salvo em modo STUB: ${filePath}`);
    return;
  }

  // Modo normal: usa Cloud Storage
  const bucketName = process.env.GCS_BUCKET;
  if (!bucketName) {
    throw new Error('GCS_BUCKET não configurado');
  }

  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  await file.save(Buffer.from(buffer), {
    contentType: 'application/pdf',
    metadata: {
      cacheControl: 'public, max-age=3600',
    },
  });
}

export async function getSignedUrl(filename: string, expiresInMinutes: number = 60): Promise<string> {
  const isStubMode = process.env.LOCAL_STUB === 'true';

  if (isStubMode) {
    // Modo stub: retorna caminho local
    const tmpDir = await ensureTmpDir();
    const filePath = path.join(tmpDir, path.basename(filename));
    // Retorna URL local para desenvolvimento
    const port = process.env.PORT || 8080;
    return `http://localhost:${port}/api/files/${path.basename(filename)}`;
  }

  // Modo normal: usa Cloud Storage
  const bucketName = process.env.GCS_BUCKET;
  if (!bucketName) {
    throw new Error('GCS_BUCKET não configurado');
  }

  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });

  return url;
}
