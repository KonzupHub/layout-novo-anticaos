import type { IRepository } from './repo.js';
import type { Agency, User, Case, WaitlistEntry, CreateCaseDto, UpdateCaseDto } from '../types/shared.js';

export class MemoryRepository implements IRepository {
  private agencies: Map<string, Agency> = new Map();
  private users: Map<string, User> = new Map();
  private cases: Map<string, Case> = new Map();
  private waitlist: WaitlistEntry[] = [];
  private caseIdCounter = 1;

  // Agencies
  async createAgency(cnpj: string, nome: string, cidade: string): Promise<Agency> {
    const agency: Agency = {
      cnpj,
      nome,
      cidade,
      createdAt: new Date().toISOString(),
    };
    this.agencies.set(cnpj, agency);
    return agency;
  }

  async getAgency(cnpj: string): Promise<Agency | null> {
    return this.agencies.get(cnpj) || null;
  }

  // Users
  async createUser(uid: string, cnpj: string, email: string, nome: string, role?: string): Promise<User> {
    const user: User = {
      uid,
      cnpj,
      email,
      nome,
      role: (role as 'admin' | 'user') || 'user',
      createdAt: new Date().toISOString(),
    };
    this.users.set(uid, user);
    return user;
  }

  async getUserByUid(uid: string): Promise<User | null> {
    return this.users.get(uid) || null;
  }

  // Cases
  async createCase(cnpj: string, caseData: CreateCaseDto): Promise<Case> {
    const id = `case-${this.caseIdCounter++}`;
    const now = new Date().toISOString();
    const newCase: Case = {
      id,
      cnpj,
      ...caseData,
      createdAt: now,
      updatedAt: now,
    };
    this.cases.set(id, newCase);
    return newCase;
  }

  async getCasesByCnpj(
    cnpj: string,
    filters?: { status?: string; tipo?: string; ate?: string }
  ): Promise<Case[]> {
    let cases = Array.from(this.cases.values()).filter((c) => c.cnpj === cnpj);

    if (filters?.status) {
      cases = cases.filter((c) => c.status === filters.status);
    }

    if (filters?.tipo) {
      cases = cases.filter((c) => c.tipo === filters.tipo);
    }

    if (filters?.ate) {
      const ateDate = new Date(filters.ate);
      cases = cases.filter((c) => {
        // Simplificado: verifica se o prazo contém a data ou é antes
        return new Date(c.createdAt) <= ateDate;
      });
    }

    return cases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCaseById(id: string): Promise<Case | null> {
    return this.cases.get(id) || null;
  }

  async updateCase(id: string, updates: UpdateCaseDto): Promise<Case | null> {
    const existingCase = this.cases.get(id);
    if (!existingCase) {
      return null;
    }

    const updatedCase: Case = {
      ...existingCase,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.cases.set(id, updatedCase);
    return updatedCase;
  }

  // Waitlist
  async addToWaitlist(email: string): Promise<WaitlistEntry> {
    const entry: WaitlistEntry = {
      email: email.toLowerCase().trim(),
      createdAt: new Date().toISOString(),
    };
    this.waitlist.push(entry);
    return entry;
  }
}

