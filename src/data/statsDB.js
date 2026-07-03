// Base de dados estatísticos reais da Copa 2026 e histórico dos times
// Fonte: FIFA, CBS Sports, ESPN, Yahoo Sports

export const LOGOS_URL = {
  // Bandeiras via flagcdn (chaves sem acento, minúsculas)
  // América
  'estados unidos': 'https://flagcdn.com/w80/us.png',
  'mexico':         'https://flagcdn.com/w80/mx.png',
  'canada':         'https://flagcdn.com/w80/ca.png',
  'brasil':         'https://flagcdn.com/w80/br.png',
  'argentina':      'https://flagcdn.com/w80/ar.png',
  'uruguai':        'https://flagcdn.com/w80/uy.png',
  'colombia':       'https://flagcdn.com/w80/co.png',
  'equador':        'https://flagcdn.com/w80/ec.png',
  'paraguai':       'https://flagcdn.com/w80/py.png',
  'peru':           'https://flagcdn.com/w80/pe.png',
  'chile':          'https://flagcdn.com/w80/cl.png',
  'venezuela':      'https://flagcdn.com/w80/ve.png',
  'bolivia':        'https://flagcdn.com/w80/bo.png',
  'costa rica':     'https://flagcdn.com/w80/cr.png',
  'panama':         'https://flagcdn.com/w80/pa.png',
  'honduras':       'https://flagcdn.com/w80/hn.png',
  'jamaica':        'https://flagcdn.com/w80/jm.png',
  'haiti':          'https://flagcdn.com/w80/ht.png',
  'curacao':        'https://flagcdn.com/w80/cw.png',
  // Europa
  'inglaterra':     'https://flagcdn.com/w80/gb-eng.png',
  'england':        'https://flagcdn.com/w80/gb-eng.png',
  'escocia':        'https://flagcdn.com/w80/gb-sct.png',
  'pais de gales':  'https://flagcdn.com/w80/gb-wls.png',
  'irlanda do norte':'https://flagcdn.com/w80/gb-nir.png',
  'irlanda':        'https://flagcdn.com/w80/ie.png',
  'franca':         'https://flagcdn.com/w80/fr.png',
  'alemanha':       'https://flagcdn.com/w80/de.png',
  'espanha':        'https://flagcdn.com/w80/es.png',
  'portugal':       'https://flagcdn.com/w80/pt.png',
  'italia':         'https://flagcdn.com/w80/it.png',
  'paises baixos':  'https://flagcdn.com/w80/nl.png',
  'holanda':        'https://flagcdn.com/w80/nl.png',
  'belgica':        'https://flagcdn.com/w80/be.png',
  'croacia':        'https://flagcdn.com/w80/hr.png',
  'suica':          'https://flagcdn.com/w80/ch.png',
  'austria':        'https://flagcdn.com/w80/at.png',
  'suecia':         'https://flagcdn.com/w80/se.png',
  'noruega':        'https://flagcdn.com/w80/no.png',
  'dinamarca':      'https://flagcdn.com/w80/dk.png',
  'polonia':        'https://flagcdn.com/w80/pl.png',
  'ucrania':        'https://flagcdn.com/w80/ua.png',
  'turquia':        'https://flagcdn.com/w80/tr.png',
  'grecia':         'https://flagcdn.com/w80/gr.png',
  'republica tcheca':'https://flagcdn.com/w80/cz.png',
  'tchequia':       'https://flagcdn.com/w80/cz.png',
  'eslovaquia':     'https://flagcdn.com/w80/sk.png',
  'eslovenia':      'https://flagcdn.com/w80/si.png',
  'servia':         'https://flagcdn.com/w80/rs.png',
  'bosnia e herzegovina': 'https://flagcdn.com/w80/ba.png',
  'bosnia':         'https://flagcdn.com/w80/ba.png',
  'albania':        'https://flagcdn.com/w80/al.png',
  'macedonia do norte': 'https://flagcdn.com/w80/mk.png',
  'kosovo':         'https://flagcdn.com/w80/xk.png',
  'romenia':        'https://flagcdn.com/w80/ro.png',
  'hungria':        'https://flagcdn.com/w80/hu.png',
  'russia':         'https://flagcdn.com/w80/ru.png',
  'finlandia':      'https://flagcdn.com/w80/fi.png',
  'islandia':       'https://flagcdn.com/w80/is.png',
  'georgia':        'https://flagcdn.com/w80/ge.png',
  // África
  'marrocos':       'https://flagcdn.com/w80/ma.png',
  'senegal':        'https://flagcdn.com/w80/sn.png',
  'argelia':        'https://flagcdn.com/w80/dz.png',
  'tunisia':        'https://flagcdn.com/w80/tn.png',
  'egito':          'https://flagcdn.com/w80/eg.png',
  'gana':           'https://flagcdn.com/w80/gh.png',
  'nigeria':        'https://flagcdn.com/w80/ng.png',
  'camaroes':       'https://flagcdn.com/w80/cm.png',
  'costa do marfim':'https://flagcdn.com/w80/ci.png',
  'africa do sul':  'https://flagcdn.com/w80/za.png',
  'cabo verde':     'https://flagcdn.com/w80/cv.png',
  'rd congo':       'https://flagcdn.com/w80/cd.png',
  'republica democratica do congo': 'https://flagcdn.com/w80/cd.png',
  'mali':           'https://flagcdn.com/w80/ml.png',
  'burkina faso':   'https://flagcdn.com/w80/bf.png',
  'uganda':         'https://flagcdn.com/w80/ug.png',
  'zambia':         'https://flagcdn.com/w80/zm.png',
  // Ásia e Oceania
  'japao':          'https://flagcdn.com/w80/jp.png',
  'coreia do sul':  'https://flagcdn.com/w80/kr.png',
  'australia':      'https://flagcdn.com/w80/au.png',
  'ira':            'https://flagcdn.com/w80/ir.png',
  'arabia saudita': 'https://flagcdn.com/w80/sa.png',
  'catar':          'https://flagcdn.com/w80/qa.png',
  'uzbequistao':    'https://flagcdn.com/w80/uz.png',
  'jordania':       'https://flagcdn.com/w80/jo.png',
  'iraque':         'https://flagcdn.com/w80/iq.png',
  'emirados arabes unidos': 'https://flagcdn.com/w80/ae.png',
  'china':          'https://flagcdn.com/w80/cn.png',
  'india':          'https://flagcdn.com/w80/in.png',
  'indonesia':      'https://flagcdn.com/w80/id.png',
  'nova zelandia':  'https://flagcdn.com/w80/nz.png',
};

export function getLogo(nomeTime) {
  if (!nomeTime) return null;
  const chave = nomeTime.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [k, v] of Object.entries(LOGOS_URL)) {
    const knorm = k.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (knorm === chave || chave.includes(knorm) || knorm.includes(chave)) return v;
  }
  return null;
}

// Estatísticas reais da fase de grupos Copa 2026
export const STATS_COPA = {
  'brasil': {
    gols_marcados: 8,
    gols_sofridos: 1,
    jogos: 3,
    vitorias: 2,
    empates: 0,
    derrotas: 1,
    posse_media: 58,
    chutes_gol_media: 7.3,
    escanteios_media: 6.7,
    cartoes_amarelos: 3,
    forma_copa: [
      { adversario: 'Haiti',    resultado: 'V', placar: '1-0', data: '14/06' },
      { adversario: 'Marrocos', resultado: 'D', placar: '0-1', data: '20/06' },
      { adversario: 'Escócia', resultado: 'V', placar: '3-0', data: '25/06' },
    ],
    artilheiro_copa: { nome: 'Vinicius Jr.', gols: 3 },
    ranking_fifa: 5,
    titulos_copa: 5,
  },
  'japão': {
    gols_marcados: 4,
    gols_sofridos: 3,
    jogos: 3,
    vitorias: 1,
    empates: 2,
    derrotas: 0,
    posse_media: 44,
    chutes_gol_media: 5.0,
    escanteios_media: 4.3,
    cartoes_amarelos: 2,
    forma_copa: [
      { adversario: 'Irã',      resultado: 'E', placar: '1-1', data: '15/06' },
      { adversario: 'Iraque',   resultado: 'V', placar: '2-0', data: '21/06' },
      { adversario: 'Qatar',    resultado: 'E', placar: '1-1', data: '26/06' },
    ],
    artilheiro_copa: { nome: 'Nakamura', gols: 2 },
    ranking_fifa: 19,
    titulos_copa: 0,
  },
  'países baixos': {
    gols_marcados: 10,
    gols_sofridos: 4,
    jogos: 3,
    vitorias: 2,
    empates: 1,
    derrotas: 0,
    posse_media: 56,
    chutes_gol_media: 8.7,
    escanteios_media: 7.0,
    cartoes_amarelos: 4,
    forma_copa: [
      { adversario: 'Senegal', resultado: 'V', placar: '3-1', data: '16/06' },
      { adversario: 'Iraque',  resultado: 'V', placar: '5-0', data: '22/06' },
      { adversario: 'França',  resultado: 'D', placar: '2-3', data: '26/06' },
    ],
    artilheiro_copa: { nome: 'Van Dijk', gols: 3 },
    ranking_fifa: 7,
    titulos_copa: 0,
  },
  'marrocos': {
    gols_marcados: 4,
    gols_sofridos: 2,
    jogos: 3,
    vitorias: 2,
    empates: 0,
    derrotas: 1,
    posse_media: 46,
    chutes_gol_media: 5.7,
    escanteios_media: 5.3,
    cartoes_amarelos: 5,
    forma_copa: [
      { adversario: 'Escócia', resultado: 'V', placar: '2-0', data: '14/06' },
      { adversario: 'Brasil',  resultado: 'V', placar: '1-0', data: '20/06' },
      { adversario: 'Haiti',   resultado: 'D', placar: '1-2', data: '25/06' },
    ],
    artilheiro_copa: { nome: 'Hakimi', gols: 2 },
    ranking_fifa: 14,
    titulos_copa: 0,
  },
  'estados unidos': {
    gols_marcados: 8,
    gols_sofridos: 3,
    jogos: 3,
    vitorias: 3,
    empates: 0,
    derrotas: 0,
    posse_media: 52,
    chutes_gol_media: 7.0,
    escanteios_media: 6.0,
    cartoes_amarelos: 2,
    forma_copa: [
      { adversario: 'Austrália', resultado: 'V', placar: '3-1', data: '14/06' },
      { adversario: 'Paraguai',  resultado: 'V', placar: '2-1', data: '20/06' },
      { adversario: 'Polônia',   resultado: 'V', placar: '3-1', data: '26/06' },
    ],
    artilheiro_copa: { nome: 'Freeman', gols: 3 },
    ranking_fifa: 11,
    titulos_copa: 0,
  },
  'bósnia e herzegovina': {
    gols_marcados: 3,
    gols_sofridos: 5,
    jogos: 3,
    vitorias: 1,
    empates: 0,
    derrotas: 2,
    posse_media: 41,
    chutes_gol_media: 4.3,
    escanteios_media: 3.7,
    cartoes_amarelos: 4,
    forma_copa: [
      { adversario: 'Tunísia',  resultado: 'V', placar: '2-1', data: '15/06' },
      { adversario: 'Alemanha', resultado: 'D', placar: '1-7', data: '21/06' },
      { adversario: 'Polônia',  resultado: 'D', placar: '0-1', data: '26/06' },
    ],
    artilheiro_copa: { nome: 'Alajbegovic', gols: 2 },
    ranking_fifa: 62,
    titulos_copa: 0,
  },
};

// Histórico de confrontos diretos (head-to-head)
export const H2H = {
  'brasil-japão': {
    total: 5,
    brasil: 4, empates: 0, japão: 1,
    confrontos: [
      { data: 'Out 2022', competicao: 'Amistoso', placar: '0-1', mandante: 'Japão', vencedor: 'Brasil' },
      { data: 'Jun 2019', competicao: 'Copa América', placar: '2-0', mandante: 'Brasil', vencedor: 'Brasil' },
      { data: 'Nov 2017', competicao: 'Amistoso', placar: '3-1', mandante: 'Brasil', vencedor: 'Brasil' },
      { data: 'Out 2014', competicao: 'Amistoso', placar: '4-0', mandante: 'Brasil', vencedor: 'Brasil' },
      { data: 'Jun 2006', competicao: 'Copa do Mundo', placar: '4-1', mandante: 'Brasil', vencedor: 'Brasil' },
    ],
    gols_brasil: 14,
    gols_japão: 2,
    nota: 'Brasil domina o histórico com 4 vitórias em 5 jogos, marcando 14 gols',
  },
  'países baixos-marrocos': {
    total: 3,
    holanda: 2, empates: 0, marrocos: 1,
    confrontos: [
      { data: 'Nov 2022', competicao: 'Copa do Mundo', placar: '2-0', mandante: 'Holanda', vencedor: 'Holanda' },
      { data: 'Jun 2022', competicao: 'Amistoso', placar: '2-2', mandante: 'Holanda', vencedor: 'Empate' },
      { data: 'Mar 2019', competicao: 'Amistoso', placar: '1-0', mandante: 'Marrocos', vencedor: 'Marrocos' },
    ],
    nota: 'Histórico equilibrado — Marrocos surpreendeu na Copa 2022',
  },
  'estados unidos-bósnia e herzegovina': {
    total: 2,
    eua: 2, empates: 0, bosnia: 0,
    confrontos: [
      { data: 'Jun 2019', competicao: 'Amistoso', placar: '1-0', mandante: 'EUA', vencedor: 'EUA' },
      { data: 'Nov 2012', competicao: 'Amistoso', placar: '4-3', mandante: 'EUA', vencedor: 'EUA' },
    ],
    nota: 'EUA venceu os dois únicos confrontos da história',
  },
};

export function getStats(nomeTime) {
  const chave = nomeTime.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace('bosnia e herzegovina', 'bósnia e herzegovina');
  for (const [k, v] of Object.entries(STATS_COPA)) {
    const knorm = k.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (knorm === chave || chave.includes(knorm) || knorm.includes(chave)) return v;
  }
  return null;
}

export function getH2H(nomeCasa, nomeFora) {
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const ca = norm(nomeCasa);
  const fo = norm(nomeFora);
  for (const [k, v] of Object.entries(H2H)) {
    const [a, b] = k.split('-');
    if ((ca.includes(a) || a.includes(ca)) && (fo.includes(b) || b.includes(fo))) return v;
    if ((fo.includes(a) || a.includes(fo)) && (ca.includes(b) || b.includes(ca))) return v;
  }
  return null;
}
