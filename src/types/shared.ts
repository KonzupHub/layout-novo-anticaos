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
  // Campos adicionais MVP 2.0
  numeroVoo?: string;
  dataVoo?: string;
  horarioPrevisto?: string;
  horarioReal?: string;
  origem?: string;
  destino?: string;
  canalVenda?: string;
  consolidadora?: string;
  timelineIncidente?: string;
  resumoIa?: string;
  mensagemSugerida?: string;
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
  // Campos adicionais MVP 2.0
  numeroVoo?: string;
  dataVoo?: string;
  horarioPrevisto?: string;
  horarioReal?: string;
  origem?: string;
  destino?: string;
  canalVenda?: string;
  consolidadora?: string;
  timelineIncidente?: string;
}

export interface UpdateCaseDto {
  status?: CaseStatus;
  responsavel?: {
    nome: string;
    avatar?: string;
  };
  notas?: string;
  prazo?: string;
  // Campos adicionais MVP 2.0
  numeroVoo?: string;
  dataVoo?: string;
  horarioPrevisto?: string;
  horarioReal?: string;
  origem?: string;
  destino?: string;
  canalVenda?: string;
  consolidadora?: string;
  timelineIncidente?: string;
  resumoIa?: string;
  mensagemSugerida?: string;
}

export interface SignupDto {
  email: string;
  senha: string;
  cnpj: string;
  nomeAgencia: string;
  cidade: string;
  nome: string;
}

// MVP 2.0: Tipos para interpretação ANAC
export interface PrazoANAC {
  descricao: string;
  prazoDias: number;
  prazoLimite?: string;
  status: 'dentro_prazo' | 'proximo_vencer' | 'vencido';
  diasRestantes?: number;
}

export interface AnacResumo {
  categoriaIncidente: string;
  direitosBasicos: string[];
  prazosImportantes: PrazoANAC[];
  alertasOperacionais: string[];
}
