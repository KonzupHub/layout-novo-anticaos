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
    // No Cloud Run, usa Application Default Credentials
    // Em ambiente local, usa GOOGLE_APPLICATION_CREDENTIALS
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT,
    });
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
