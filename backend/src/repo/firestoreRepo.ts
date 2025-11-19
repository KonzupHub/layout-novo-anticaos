import { Firestore } from '@google-cloud/firestore';
import type { IRepository } from './repo.js';
import type { Agency, User, Case, WaitlistEntry, CreateCaseDto, UpdateCaseDto } from '../types/shared.js';

let firestore: Firestore | null = null;

function getFirestore(): Firestore {
  if (!firestore) {
    firestore = new Firestore({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT,
    });
  }
  return firestore;
}

export class FirestoreRepository implements IRepository {
  // Agencies
  async createAgency(cnpj: string, nome: string, cidade: string): Promise<Agency> {
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

  async getAgency(cnpj: string): Promise<Agency | null> {
    const db = getFirestore();
    const doc = await db.collection('agencies').doc(cnpj).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return doc.data() as Agency;
  }

  // Users
  async createUser(uid: string, cnpj: string, email: string, nome: string, role?: string): Promise<User> {
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

  async getUserByUid(uid: string): Promise<User | null> {
    const db = getFirestore();
    const doc = await db.collection('users').doc(uid).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return doc.data() as User;
  }

  // Cases
  async createCase(cnpj: string, caseData: CreateCaseDto): Promise<Case> {
    const db = getFirestore();
    const casesRef = db.collection('cases');
    
    const now = new Date().toISOString();
    
    // Remove campos undefined para evitar erro do Firestore
    // Firestore não aceita undefined como valor
    const cleanCaseData = Object.fromEntries(
      Object.entries(caseData).filter(([_, value]) => value !== undefined)
    ) as CreateCaseDto;
    
    const newCase: Omit<Case, 'id'> = {
      cnpj,
      ...cleanCaseData,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await casesRef.add(newCase);
    
    return {
      id: docRef.id,
      ...newCase,
    };
  }

  async getCasesByCnpj(
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

  async getCaseById(id: string): Promise<Case | null> {
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

  async updateCase(id: string, updates: UpdateCaseDto): Promise<Case | null> {
    const db = getFirestore();
    const caseRef = db.collection('cases').doc(id);
    
    // Remove campos undefined para evitar erro do Firestore
    // Firestore não aceita undefined como valor
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    ) as UpdateCaseDto;
    
    const updateData = {
      ...cleanUpdates,
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
  async addToWaitlist(email: string): Promise<WaitlistEntry> {
    const db = getFirestore();
    const waitlistRef = db.collection('waitlist');
    
    const entry: WaitlistEntry = {
      email: email.toLowerCase().trim(),
      createdAt: new Date().toISOString(),
    };
    
    await waitlistRef.add(entry);
    return entry;
  }
}

