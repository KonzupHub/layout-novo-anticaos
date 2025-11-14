import admin from 'firebase-admin';

let initialized = false;

export function initializeFirebaseAdmin(): void {
  const isStubMode = process.env.LOCAL_STUB === 'true';
  
  if (isStubMode) {
    console.log('⚠️  Firebase Admin desabilitado em modo STUB');
    initialized = true;
    return;
  }

  if (initialized) {
    return;
  }

  if (!admin.apps.length) {
    // Application Default Credentials funciona automaticamente:
    // - No Cloud Run: usa a service account do serviço automaticamente
    // - Em ambiente local: usa GOOGLE_APPLICATION_CREDENTIALS se existir,
    //   caso contrário tenta as credenciais padrão do ambiente (gcloud auth)
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
    
    if (!projectId) {
      throw new Error('FIREBASE_PROJECT_ID ou GCLOUD_PROJECT deve estar definido');
    }
    
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
    
    console.log(`✅ Firebase Admin inicializado para projeto: ${projectId}`);
  }

  initialized = true;
}

export function getAuth() {
  const isStubMode = process.env.LOCAL_STUB === 'true';
  
  if (isStubMode) {
    throw new Error('Firebase Admin não está disponível em modo STUB. Use autenticação mockada.');
  }
  
  if (!admin.apps.length) {
    throw new Error('Firebase Admin não foi inicializado. Chame initializeFirebaseAdmin() primeiro.');
  }
  
  return admin.auth();
}
