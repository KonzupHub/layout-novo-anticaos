import { MemoryRepository } from './memoryRepo.js';
import { FirestoreRepository } from './firestoreRepo.js';
import type { IRepository } from './repo.js';

let repo: IRepository | null = null;

export function getRepository(): IRepository {
  if (repo) {
    return repo;
  }

  const isStubMode = process.env.LOCAL_STUB === 'true';

  if (isStubMode) {
    console.log('⚠️  MODO STUB ATIVO - Usando repositório em memória (desenvolvimento apenas)');
    repo = new MemoryRepository();
  } else {
    repo = new FirestoreRepository();
  }

  return repo;
}

export { type IRepository };

