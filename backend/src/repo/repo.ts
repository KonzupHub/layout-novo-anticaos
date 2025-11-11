import type { Agency, User, Case, WaitlistEntry, CreateCaseDto, UpdateCaseDto } from '../types/shared.js';

export interface IRepository {
  // Agencies
  createAgency(cnpj: string, nome: string, cidade: string): Promise<Agency>;
  getAgency(cnpj: string): Promise<Agency | null>;

  // Users
  createUser(uid: string, cnpj: string, email: string, nome: string, role?: string): Promise<User>;
  getUserByUid(uid: string): Promise<User | null>;

  // Cases
  createCase(cnpj: string, caseData: CreateCaseDto): Promise<Case>;
  getCasesByCnpj(cnpj: string, filters?: { status?: string; tipo?: string; ate?: string }): Promise<Case[]>;
  getCaseById(id: string): Promise<Case | null>;
  updateCase(id: string, updates: UpdateCaseDto): Promise<Case | null>;

  // Waitlist
  addToWaitlist(email: string): Promise<WaitlistEntry>;
}

