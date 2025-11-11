export interface Case {
  id: string;
  passageiro: string;
  localizador: string;
  voo: string;
  fornecedor: string;
  tipo: 'atraso' | 'cancelamento' | 'overbooking' | 'mudanca_voo';
  prazo: string;
  status: 'em_andamento' | 'aguardando_resposta' | 'documentacao_pendente';
  responsavel: {
    nome: string;
    avatar: string;
  };
}

export const mockCases: Case[] = [
  {
    id: '1',
    passageiro: 'Maria Silva',
    localizador: 'ABC123',
    voo: 'LA4501',
    fornecedor: 'LATAM',
    tipo: 'atraso',
    prazo: 'Hoje, 18h',
    status: 'em_andamento',
    responsavel: { nome: 'João', avatar: 'J' }
  },
  {
    id: '2',
    passageiro: 'Carlos Santos',
    localizador: 'XYZ789',
    voo: 'G34405',
    fornecedor: 'GOL',
    tipo: 'cancelamento',
    prazo: 'Amanhã, 10h',
    status: 'aguardando_resposta',
    responsavel: { nome: 'Ana', avatar: 'A' }
  },
  {
    id: '3',
    passageiro: 'Juliana Costa',
    localizador: 'DEF456',
    voo: 'AD2150',
    fornecedor: 'Azul',
    tipo: 'overbooking',
    prazo: 'Em 3 dias',
    status: 'documentacao_pendente',
    responsavel: { nome: 'João', avatar: 'J' }
  }
];

export const getTipoBadge = (tipo: Case['tipo']) => {
  const badges = {
    atraso: { label: 'Atraso > 4h', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    cancelamento: { label: 'Cancelamento', color: 'bg-red-100 text-red-800 border-red-200' },
    overbooking: { label: 'Overbooking', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    mudanca_voo: { label: 'Mudança de voo', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  };
  return badges[tipo];
};

export const getStatusBadge = (status: Case['status']) => {
  const badges = {
    em_andamento: { label: 'Em andamento', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    aguardando_resposta: { label: 'Aguardando resposta', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    documentacao_pendente: { label: 'Documentação pendente', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  };
  return badges[status];
};
