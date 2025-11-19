export type CaseType = 'atraso' | 'cancelamento' | 'overbooking' | 'mudanca_voo' | 'extravio';
export type CaseStatus = 'em_andamento' | 'aguardando_resposta' | 'documentacao_pendente' | 'encerrado';

export interface Case {
  id: string;
  cnpj: string;
  passageiro: string;
  localizador: string;
  fornecedor: string;
  tipo: CaseType;
  prazo: string;
  status: CaseStatus;
  responsavel: {
    nome: string;
    avatar?: string;
  };
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agency {
  cnpj: string;
  nome: string;
  cidade: string;
  createdAt: string;
}

export interface User {
  uid: string;
  cnpj: string;
  email: string;
  nome: string;
  role?: string;
  createdAt: string;
}

export interface WaitlistEntry {
  email: string;
  createdAt: string;
}

export interface CreateCaseDto {
  passageiro: string;
  localizador: string;
  fornecedor: string;
  tipo: CaseType;
  prazo: string;
  status: CaseStatus;
  responsavel: {
    nome: string;
    avatar?: string;
  };
  notas?: string;
}

export interface UpdateCaseDto {
  status?: CaseStatus;
  responsavel?: {
    nome: string;
    avatar?: string;
  };
  notas?: string;
  prazo?: string;
}
