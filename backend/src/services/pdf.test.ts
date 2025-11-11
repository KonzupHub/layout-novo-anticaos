import { describe, it, expect } from 'vitest';
import { generateCaseReport } from './pdf.js';
import type { Case } from '../types/shared.js';

describe('PDF Service', () => {
  it('deve gerar um PDF válido para um caso', async () => {
    const caso: Case = {
      id: 'test-123',
      cnpj: '12.345.678/0001-90',
      passageiro: 'João Silva',
      localizador: 'ABC123',
      fornecedor: 'LATAM',
      tipo: 'atraso',
      prazo: 'Hoje, 18h',
      status: 'em_andamento',
      responsavel: {
        nome: 'Maria Santos',
        avatar: 'MS',
      },
      notas: 'Caso de teste para geração de PDF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const pdfDoc = await generateCaseReport(caso);
    expect(pdfDoc).toBeDefined();
    
    const pdfBytes = await pdfDoc.save();
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  it('deve gerar PDF mesmo sem observações', async () => {
    const caso: Case = {
      id: 'test-456',
      cnpj: '12.345.678/0001-90',
      passageiro: 'Maria Silva',
      localizador: 'XYZ789',
      fornecedor: 'GOL',
      tipo: 'cancelamento',
      prazo: 'Amanhã, 10h',
      status: 'aguardando_resposta',
      responsavel: {
        nome: 'João Santos',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const pdfDoc = await generateCaseReport(caso);
    expect(pdfDoc).toBeDefined();
    
    const pdfBytes = await pdfDoc.save();
    expect(pdfBytes.length).toBeGreaterThan(0);
  });
});
