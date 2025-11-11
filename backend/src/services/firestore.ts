import { Firestore } from '@google-cloud/firestore';
import type { Agency, User, Case, WaitlistEntry, CreateCaseDto, UpdateCaseDto } from '../types/shared.js';

let firestore: Firestore | null = null;

export function getFirestore(): Firestore {
  if (!firestore) {
    firestore = new Firestore({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT,
    });
  }
  return firestore;
}

// Agencies
export async function createAgency(cnpj: string, nome: string, cidade: string): Promise<Agency> {
  const db = getFirestore();
  const agencyRef = db.collection('agencies').doc(cnpj);
  
  const agency: Agency = {
    cnpj,
    nome,
    cidade,
    createdAt: new Date().toISOString(),
  };
  
  await agencyRef.set(agency);
  return agency;
}

export async function getAgency(cnpj: string): Promise<Agency | null> {
  const db = getFirestore();
  const doc = await db.collection('agencies').doc(cnpj).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return doc.data() as Agency;
}

// Users
export async function createUser(uid: string, cnpj: string, email: string, nome: string, role?: string): Promise<User> {
  const db = getFirestore();
  const userRef = db.collection('users').doc(uid);
  
  const user: User = {
    uid,
    cnpj,
    email,
    nome,
    role,
    createdAt: new Date().toISOString(),
  };
  
  await userRef.set(user);
  return user;
}

export async function getUserByUid(uid: string): Promise<User | null> {
  const db = getFirestore();
  const doc = await db.collection('users').doc(uid).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return doc.data() as User;
}

// Cases
export async function createCase(cnpj: string, caseData: CreateCaseDto): Promise<Case> {
  const db = getFirestore();
  const casesRef = db.collection('cases');
  
  const now = new Date().toISOString();
  const newCase: Omit<Case, 'id'> = {
    cnpj,
    ...caseData,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await casesRef.add(newCase);
  
  return {
    id: docRef.id,
    ...newCase,
  };
}

export async function getCasesByCnpj(
  cnpj: string,
  filters?: { status?: string; tipo?: string; ate?: string }
): Promise<Case[]> {
  const db = getFirestore();
  let query: FirebaseFirestore.Query = db.collection('cases').where('cnpj', '==', cnpj);
  
  if (filters?.status) {
    query = query.where('status', '==', filters.status);
  }
  
  if (filters?.tipo) {
    query = query.where('tipo', '==', filters.tipo);
  }
  
  if (filters?.ate) {
    const ateDate = new Date(filters.ate);
    query = query.where('prazo', '<=', ateDate.toISOString());
  }
  
  const snapshot = await query.orderBy('createdAt', 'desc').get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Case[];
}

export async function getCaseById(id: string): Promise<Case | null> {
  const db = getFirestore();
  const doc = await db.collection('cases').doc(id).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return {
    id: doc.id,
    ...doc.data(),
  } as Case;
}

export async function updateCase(id: string, updates: UpdateCaseDto): Promise<Case | null> {
  const db = getFirestore();
  const caseRef = db.collection('cases').doc(id);
  
  const updateData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await caseRef.update(updateData);
  
  const updatedDoc = await caseRef.get();
  if (!updatedDoc.exists) {
    return null;
  }
  
  return {
    id: updatedDoc.id,
    ...updatedDoc.data(),
  } as Case;
}

// Waitlist
export async function addToWaitlist(email: string): Promise<WaitlistEntry> {
  const db = getFirestore();
  const waitlistRef = db.collection('waitlist');
  
  const entry: WaitlistEntry = {
    email: email.toLowerCase().trim(),
    createdAt: new Date().toISOString(),
  };
  
  await waitlistRef.add(entry);
  return entry;
}
