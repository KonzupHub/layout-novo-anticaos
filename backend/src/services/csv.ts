import { parse } from 'fast-csv';
import { getRepository } from '../repo/index.js';
import type { Case } from '../types/shared.js';

export interface CSVRow {
  passageiro?: string;
  localizador?: string;
  voo?: string;
  fornecedor?: string;
  tipo?: string;
  prazo?: string;
  [key: string]: any;
}

export interface CSVAnalysisResult {
  pendencias: Array<{
    localizador: string;
    motivo: string;
    dadosCSV?: CSVRow;
    dadosSistema?: Case;
  }>;
  totais: {
    linhasProcessadas: number;
    divergenciasEncontradas: number;
    casosNaoEncontrados: number;
    casosComDivergencia: number;
  };
}

export async function parseCSV(buffer: Buffer, cnpj: string): Promise<CSVAnalysisResult> {
  return new Promise((resolve, reject) => {
    const rows: CSVRow[] = [];
    const pendencias: CSVAnalysisResult['pendencias'] = [];
    let linhasProcessadas = 0;

    const stream = parse({
      headers: true,
    })
      .on('error', (error) => reject(error))
      .on('data', (row: CSVRow) => {
        rows.push(row);
        linhasProcessadas++;
      })
      .on('end', async () => {
        try {
          // Busca todos os casos do CNPJ para comparação
          const repo = getRepository();
          const casos = await repo.getCasesByCnpj(cnpj);
          const casosPorLocalizador = new Map<string, Case>();
          
          casos.forEach((caso) => {
            casosPorLocalizador.set(caso.localizador.toLowerCase().trim(), caso);
          });

          // Analisa cada linha do CSV
          for (const row of rows) {
            const localizador = row.localizador?.toString().toLowerCase().trim();
            
            if (!localizador) {
              pendencias.push({
                localizador: row.localizador?.toString() || 'N/A',
                motivo: 'Localizador não informado no CSV',
                dadosCSV: row,
              });
              continue;
            }

            const casoNoSistema = casosPorLocalizador.get(localizador);

            if (!casoNoSistema) {
              // Caso não encontrado no sistema
              pendencias.push({
                localizador: row.localizador?.toString() || '',
                motivo: 'Caso não encontrado no sistema',
                dadosCSV: row,
              });
              continue;
            }

            // Verifica divergências
            const divergencias: string[] = [];

            if (row.passageiro && row.passageiro.toString().trim() !== casoNoSistema.passageiro.trim()) {
              divergencias.push(`Passageiro: CSV="${row.passageiro}" Sistema="${casoNoSistema.passageiro}"`);
            }

            if (row.fornecedor && row.fornecedor.toString().trim() !== casoNoSistema.fornecedor.trim()) {
              divergencias.push(`Fornecedor: CSV="${row.fornecedor}" Sistema="${casoNoSistema.fornecedor}"`);
            }

            if (row.tipo && row.tipo.toString().trim() !== casoNoSistema.tipo.trim()) {
              divergencias.push(`Tipo: CSV="${row.tipo}" Sistema="${casoNoSistema.tipo}"`);
            }

            if (divergencias.length > 0) {
              pendencias.push({
                localizador: row.localizador?.toString() || '',
                motivo: 'Divergências encontradas: ' + divergencias.join('; '),
                dadosCSV: row,
                dadosSistema: casoNoSistema,
              });
            }
          }

          const casosNaoEncontrados = pendencias.filter((p) => p.motivo.includes('não encontrado')).length;
          const casosComDivergencia = pendencias.filter((p) => p.motivo.includes('Divergências')).length;

          resolve({
            pendencias,
            totais: {
              linhasProcessadas,
              divergenciasEncontradas: pendencias.length,
              casosNaoEncontrados,
              casosComDivergencia,
            },
          });
        } catch (error) {
          reject(error);
        }
      });

    stream.write(buffer);
    stream.end();
  });
}
