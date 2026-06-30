// Estrutura do mata-mata da Copa do Mundo 2026
// 48 times -> 32 nas oitavas (R32) -> oitavas (R16) -> quartas (QF) -> semis (SF) -> final

// Confrontos das oitavas de final (R16) - 16 jogos, 8 de cada lado da chave
export const OITAVAS = [
  { id: 'r16-1',  casa: 'Estados Unidos', fora: 'Bósnia e Herzegovina', data: '02/07/2026', hora: '00:00', lado: 'A' },
  { id: 'r16-2',  casa: 'Brasil',         fora: 'Japão',                 data: '29/06/2026', hora: '17:00', lado: 'A' },
  { id: 'r16-3',  casa: 'Países Baixos',  fora: 'Marrocos',              data: '30/06/2026', hora: '01:00', lado: 'A' },
  { id: 'r16-4',  casa: 'Argentina',      fora: 'Austrália',             data: '29/06/2026', hora: '14:00', lado: 'A' },
  { id: 'r16-5',  casa: 'França',         fora: 'Suécia',                data: '30/06/2026', hora: '18:00', lado: 'B' },
  { id: 'r16-6',  casa: 'Costa do Marfim',fora: 'Noruega',               data: '30/06/2026', hora: '17:00', lado: 'B' },
  { id: 'r16-7',  casa: 'Inglaterra',     fora: 'RD Congo',              data: '01/07/2026', hora: '16:00', lado: 'B' },
  { id: 'r16-8',  casa: 'México',         fora: 'Equador',               data: '01/07/2026', hora: '01:00', lado: 'B' },
  { id: 'r16-9',  casa: 'Espanha',        fora: 'Áustria',               data: '02/07/2026', hora: '14:00', lado: 'C' },
  { id: 'r16-10', casa: 'Portugal',       fora: 'Croácia',               data: '02/07/2026', hora: '17:00', lado: 'C' },
  { id: 'r16-11', casa: 'Alemanha',       fora: 'Suíça',                 data: '01/07/2026', hora: '13:00', lado: 'C' },
  { id: 'r16-12', casa: 'Bélgica',        fora: 'Senegal',               data: '01/07/2026', hora: '20:00', lado: 'C' },
  { id: 'r16-13', casa: 'Colômbia',       fora: 'Gana',                  data: '03/07/2026', hora: '13:00', lado: 'D' },
  { id: 'r16-14', casa: 'Itália',         fora: 'Paraguai',              data: '03/07/2026', hora: '17:00', lado: 'D' },
  { id: 'r16-15', casa: 'Uruguai',        fora: 'Canadá',                data: '03/07/2026', hora: '20:00', lado: 'D' },
  { id: 'r16-16', casa: 'Egito',          fora: 'Coreia do Sul',         data: '02/07/2026', hora: '20:00', lado: 'D' },
];

// Próximas fases (preenchidas conforme resultado, vazias = "a definir")
export const QUARTAS = [
  { id: 'qf-1', casa: null, fora: null, origem: ['r16-1', 'r16-2'], data: '05/07/2026', lado: 'A' },
  { id: 'qf-2', casa: null, fora: null, origem: ['r16-3', 'r16-4'], data: '06/07/2026', lado: 'A' },
  { id: 'qf-3', casa: null, fora: null, origem: ['r16-5', 'r16-6'], data: '05/07/2026', lado: 'B' },
  { id: 'qf-4', casa: null, fora: null, origem: ['r16-7', 'r16-8'], data: '06/07/2026', lado: 'B' },
  { id: 'qf-5', casa: null, fora: null, origem: ['r16-9', 'r16-10'], data: '07/07/2026', lado: 'C' },
  { id: 'qf-6', casa: null, fora: null, origem: ['r16-11', 'r16-12'], data: '08/07/2026', lado: 'C' },
  { id: 'qf-7', casa: null, fora: null, origem: ['r16-13', 'r16-14'], data: '07/07/2026', lado: 'D' },
  { id: 'qf-8', casa: null, fora: null, origem: ['r16-15', 'r16-16'], data: '08/07/2026', lado: 'D' },
];

export const SEMIS = [
  { id: 'sf-1', casa: null, fora: null, origem: ['qf-1', 'qf-2', 'qf-3', 'qf-4'], data: '11/07/2026', lado: 'AB' },
  { id: 'sf-2', casa: null, fora: null, origem: ['qf-5', 'qf-6', 'qf-7', 'qf-8'], data: '12/07/2026', lado: 'CD' },
];

export const FINAL = { id: 'final', casa: null, fora: null, data: '19/07/2026', hora: '15:00' };
export const TERCEIRO = { id: 'terceiro', casa: null, fora: null, data: '18/07/2026', hora: '14:00' };

// Helper: pega odds/score de um jogo do bracket cruzando com a lista de jogos vinda da API
export function enriquecerComJogos(confrontos, jogosApi) {
  return confrontos.map(c => {
    const match = (jogosApi || []).find(j =>
      (j.casa?.nome === c.casa && j.fora?.nome === c.fora) ||
      (j.casa?.nome === c.fora && j.fora?.nome === c.casa)
    );
    return { ...c, jogoCompleto: match || null };
  });
}
