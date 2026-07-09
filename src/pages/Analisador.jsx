import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getLogo } from '../data/statsDB';
import { fetchConfronto, fetchEvento, fetchAnalise } from '../data/api';
import { SkelTeaser, SkelCard } from '../components/Skeleton';

const STYLES = `
.ana-wrap { max-width: 860px; margin: 0 auto; padding: 20px 16px 48px; }
.ana-back { background: none; border: none; color: #00e5a0; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; margin-bottom: 20px; padding: 0; }
.ana-header { background: var(--bg2); border: 1px solid var(--border); border-radius: 18px; padding: 22px 22px 18px; margin-bottom: 20px; overflow: hidden; }
.ana-header-meta { font-size: 11px; color: var(--text3); margin-bottom: 16px; }
.ana-teams { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 18px; }
.ana-team-block { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.ana-team-block-right { flex-direction: row-reverse; text-align: right; }
.ana-team-flag { width: 50px; height: 50px; border-radius: 10px; object-fit: cover; border: 2px solid rgba(255,255,255,.1); flex-shrink: 0; }
.ana-team-flag-ph { width: 50px; height: 50px; border-radius: 10px; border: 2px solid var(--border); background: var(--bg4); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: var(--text3); flex-shrink: 0; }
.ana-team-name { font-family: var(--font-display); font-weight: 800; color: var(--text); line-height: 1.1; }
.ana-team-sub  { font-size: 11px; color: var(--text3); margin-top: 3px; }
.ana-odds-mid  { display: flex; gap: 6px; flex-shrink: 0; }
.ana-odd-c     { text-align: center; }
.ana-odd-v     { font-family: var(--font-mono); font-weight: 700; line-height: 1; }
.ana-odd-l     { font-size: 9px; color: var(--text3); margin-top: 2px; text-transform: uppercase; letter-spacing: .05em; }
.ana-prob-bar  { margin-top: 10px; }
.ana-prob-track { display: flex; border-radius: 5px; overflow: hidden; height: 8px; }
.ana-prob-pcts  { display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; font-weight: 600; }
.ana-tabs { display: flex; gap: 4px; margin-bottom: 20px; flex-wrap: wrap; }
.ana-tab { padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid var(--border); cursor: pointer; transition: all .15s; background: var(--bg2); color: var(--text2); white-space: nowrap; }
.ana-tab.active { background: #00e5a0; color: #000; border-color: transparent; }
.ana-divider { font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: .12em; padding-bottom: 10px; border-bottom: 1px solid var(--border); margin-bottom: 14px; margin-top: 4px; }
.ana-sug-tip { background: rgba(0,229,160,.05); border: 1px solid rgba(0,229,160,.15); border-radius: 12px; padding: 13px 16px; margin-bottom: 18px; font-size: 13px; color: var(--text2); line-height: 1.6; }
.ana-sug-cards { display: flex; flex-direction: column; gap: 10px; }
.ana-sug-card { border-radius: 12px; padding: 15px 16px; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.ana-sug-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 6px; }
.ana-sug-name  { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.ana-sug-sub   { font-size: 12px; color: var(--text3); line-height: 1.5; }
.ana-sug-odd   { font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: var(--text); line-height: 1; }
.ana-sug-ev    { font-size: 12px; font-weight: 700; margin-top: 3px; }
.ana-warn { margin-top: 20px; padding: 13px 16px; background: var(--bg2); border-radius: 12px; border: 1px solid var(--border); font-size: 12px; color: var(--text3); line-height: 1.6; }
.ana-empty { text-align: center; padding: 48px 20px; background: var(--bg2); border-radius: 16px; border: 1px solid var(--border); }
.ana-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ana-stat-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 16px; }
.ana-stat-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.ana-stat-nums { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 14px; }
.ana-stat-num { text-align: center; background: var(--bg3); border-radius: 8px; padding: 10px 4px; }
.ana-stat-num-val { font-family: var(--font-mono); font-size: 20px; font-weight: 800; }
.ana-stat-num-lbl { font-size: 9px; color: var(--text3); margin-top: 3px; line-height: 1.3; }
.ana-bar-row { margin-bottom: 10px; }
.ana-bar-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--text2); margin-bottom: 4px; }
.ana-bar-val { font-weight: 600; color: var(--text); font-family: var(--font-mono); }
.ana-bar-track { height: 5px; background: var(--bg4); border-radius: 3px; overflow: hidden; }
.ana-bar-fill { height: 100%; border-radius: 3px; transition: width .6s ease; }
.ana-artilheiro { margin-top: 12px; padding: 10px 12px; background: var(--bg3); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
.ana-artilheiro-label { font-size: 9px; color: var(--text3); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 2px; }
.ana-artilheiro-nome  { font-size: 13px; font-weight: 600; color: var(--text); }
.ana-forma-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 8px; margin-bottom: 6px; }
.ana-forma-left { display: flex; align-items: center; gap: 8px; }
.ana-forma-dot  { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.ana-forma-adv  { font-size: 13px; font-weight: 600; color: var(--text); }
.ana-forma-data { font-size: 11px; color: var(--text3); }
.ana-forma-right { display: flex; align-items: center; gap: 10px; }
.ana-forma-placar { font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--text); }
.ana-forma-result { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; min-width: 50px; text-align: right; }
.ana-ctx-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.ana-ctx-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 14px; text-align: center; }
.ana-ctx-val { font-family: var(--font-mono); font-size: 24px; font-weight: 800; }
.ana-ctx-lbl { font-size: 11px; font-weight: 600; color: var(--text); margin-top: 5px; }
.ana-ctx-sub { font-size: 10px; color: var(--text3); margin-top: 2px; }
.ana-h2h-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; }
.ana-h2h-nums { display: grid; grid-template-columns: repeat(3,1fr); text-align: center; margin-bottom: 16px; }
.ana-h2h-num  { font-family: var(--font-mono); font-size: 30px; font-weight: 800; }
.ana-h2h-sub  { font-size: 11px; color: var(--text3); margin-top: 3px; }
.ana-h2h-nota { background: var(--bg3); border-radius: 8px; padding: 9px 12px; font-size: 12px; color: var(--text2); margin-bottom: 14px; line-height: 1.5; }
.ana-h2h-row  { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 12px; gap: 8px; }
.ana-mercados { display: flex; flex-direction: column; gap: 20px; }
.ana-mkt-row  { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); gap: 8px; }
.ana-mkt-name { font-size: 13px; color: var(--text); font-weight: 500; }
.ana-mkt-sub  { font-size: 11px; color: var(--text3); margin-top: 2px; }
.ana-mkt-odd  { font-family: var(--font-mono); font-size: 15px; font-weight: 600; color: var(--text); text-align: right; flex-shrink: 0; }
.ana-mkt-ev   { font-size: 11px; font-weight: 700; margin-top: 2px; text-align: right; }
.ana-placares-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.ana-placar-titulo { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; }
.ana-placar-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); }
.ana-placar-nome { font-size: 13px; font-weight: 600; color: var(--text2); }
.ana-placar-val  { font-family: var(--font-mono); font-size: 13px; color: var(--text); }

@media (max-width: 640px) {
  .ana-wrap { padding: 16px 12px 48px; }
  .ana-header { padding: 16px 14px; border-radius: 14px; }
  .ana-team-flag, .ana-team-flag-ph { width: 38px !important; height: 38px !important; }
  .ana-team-name { font-size: 16px !important; }
  .ana-team-sub  { font-size: 10px; }
  .ana-stats-grid { grid-template-columns: 1fr; }
  .ana-ctx-grid   { grid-template-columns: repeat(3,1fr); }
  .ana-ctx-val    { font-size: 20px !important; }
  .ana-placares-grid { grid-template-columns: 1fr; gap: 24px; }
  .ana-tab { padding: 7px 12px; font-size: 12px; }
  .ana-odd-v { font-size: 13px !important; }
  .ana-odds-mid { gap: 4px; }
  .ana-h2h-row { flex-wrap: wrap; }
  .ana-sug-card { flex-direction: column; gap: 8px; }
  .ana-sug-odd { font-size: 20px !important; }
}
@media (max-width: 400px) {
  .ana-teams { gap: 4px; }
  .ana-team-name { font-size: 14px !important; }
  .ana-team-block { gap: 8px; }
  .ana-ctx-grid { grid-template-columns: 1fr; }
}
`;

const fmt = v => (!v && v !== 0 ? '—' : parseFloat(v).toFixed(2));
const pct = v => (!v ? null : (100/v).toFixed(1)+'%');
const evC = ev => ev > 5 ? '#00e5a0' : ev > 0 ? '#ffb830' : '#6b7280';
const evL = ev => ev > 10 ? 'Oportunidade forte' : ev > 5 ? 'Boa oportunidade' : ev > 0 ? 'Leve vantagem' : 'Sem valor';

function FlagImg({ nome }) {
  const logo = getLogo(nome);
  if (!logo) return <div className="ana-team-flag-ph" style={{ width:50, height:50 }}>{nome?.charAt(0)||'?'}</div>;
  return <img src={logo} alt={nome} className="ana-team-flag" onError={e=>{e.target.style.display='none';}}/>;
}

function StatBar({ label, val, valRaw, max=100, cor='#00e5a0' }) {
  const w = Math.min(100, (valRaw/max)*100);
  return (
    <div className="ana-bar-row">
      <div className="ana-bar-meta">
        <span>{label}</span>
        <span className="ana-bar-val">{val}</span>
      </div>
      <div className="ana-bar-track">
        <div className="ana-bar-fill" style={{ width:w+'%', background:cor }}/>
      </div>
    </div>
  );
}

function MktRow({ label, sub, odd, ev }) {
  if (!odd || odd <= 1) return null;
  return (
    <div className="ana-mkt-row">
      <div style={{ flex:1, minWidth:0 }}>
        <div className="ana-mkt-name">{label}</div>
        {sub && <div className="ana-mkt-sub">{sub}</div>}
      </div>
      <div>
        <div className="ana-mkt-odd">{fmt(odd)}</div>
        {ev !== undefined && <div className="ana-mkt-ev" style={{ color:evC(ev) }}>{ev>0?'+':''}{ev?.toFixed(1)}% EV</div>}
      </div>
    </div>
  );
}

/* ─── Estatísticas reais (ESPN) ─────────────────────────────────── */
function fmtDataISO(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

const COR_RES = { V: '#00e5a0', E: '#c6d1e6', D: '#ff4d6d' };
const TXT_RES = { V: 'VITÓRIA', E: 'EMPATE', D: 'DERROTA' };

function golsDoTime(det, espnId) {
  if (!det?.gols) return [];
  return det.gols.filter(g => g.timeId === String(espnId) && g.jogador);
}

function LinhaJogoReal({ j, espnId }) {
  const cor = COR_RES[j.resultado];
  const gols = golsDoTime(j.detalhes, espnId);
  const amarelos  = (j.detalhes?.cartoes || []).filter(c => c.tipo === 'amarelo').length;
  const vermelhos = (j.detalhes?.cartoes || []).filter(c => c.tipo === 'vermelho').length;
  return (
    <div style={{ background:'var(--bg2, #0f1520)', border:`1px solid ${cor}22`, borderLeft:`3px solid ${cor}`, borderRadius:10, padding:'9px 12px', marginBottom:6 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:12, fontWeight:700, color:'var(--text, #f0f4ff)', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          vs {j.adversario} <span style={{ color:'var(--text3, #9aabc7)', fontWeight:500, fontSize:11 }}>{fmtDataISO(j.data)}</span>
        </span>
        <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:13, color:'var(--text, #f0f4ff)' }}>{j.golsPro}-{j.golsContra}</span>
        <span style={{ fontSize:10, fontWeight:800, letterSpacing:'.06em', color:cor, minWidth:56, textAlign:'right' }}>{TXT_RES[j.resultado]}</span>
      </div>
      {(gols.length > 0 || amarelos > 0 || vermelhos > 0) && (
        <div style={{ marginTop:5, fontSize:11, color:'var(--text3, #9aabc7)', lineHeight:1.5 }}>
          {gols.length > 0 && <>⚽ {gols.map(g => `${g.jogador}${g.minuto ? ` ${g.minuto}` : ''}`).join(' · ')}</>}
          {(amarelos > 0 || vermelhos > 0) && (
            <span style={{ marginLeft: gols.length > 0 ? 8 : 0 }}>
              {amarelos > 0 && <span style={{ color:'#ffb830' }}>🟨 {amarelos}</span>}
              {vermelhos > 0 && <span style={{ color:'#ff4d6d', marginLeft:6 }}>🟥 {vermelhos}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function LinhaH2H({ j, nomeCasa, confrontoData }) {
  const idCasa = confrontoData?.casa?.espnId;
  const idFora = confrontoData?.fora?.espnId;
  const golsCasa = golsDoTime(j.detalhes, idCasa);
  const golsFora = golsDoTime(j.detalhes, idFora);
  const fC = j.detalhes?.faltas?.[idCasa];
  const fF = j.detalhes?.faltas?.[idFora];
  return (
    <div style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.07)', borderRadius:10, padding:'10px 12px', marginBottom:6 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:11, color:'var(--text3, #9aabc7)', minWidth:56 }}>{fmtDataISO(j.data)}</span>
        <span style={{ fontSize:12, fontWeight:700, color:'var(--text, #f0f4ff)', flex:1 }}>
          {nomeCasa} <span style={{ fontFamily:'var(--font-mono)', color: COR_RES[j.resultado] }}>{j.golsPro} x {j.golsContra}</span> {j.adversario}
        </span>
        <span style={{ fontSize:10, color:'var(--text3, #9aabc7)', textTransform:'capitalize' }}>{(j.competicao || '').replace(/-/g,' ')}</span>
      </div>
      {(golsCasa.length > 0 || golsFora.length > 0) && (
        <div style={{ marginTop:6, display:'flex', gap:12, fontSize:11, lineHeight:1.5 }}>
          <span style={{ flex:1, color:'#00e5a0' }}>{golsCasa.map(g => `${g.jogador} ${g.minuto||''}`.trim()).join(' · ')}</span>
          <span style={{ flex:1, color:'#4d9fff', textAlign:'right' }}>{golsFora.map(g => `${g.jogador} ${g.minuto||''}`.trim()).join(' · ')}</span>
        </div>
      )}
      {(fC || fF) && (
        <div style={{ marginTop:6, fontSize:10, color:'var(--text3, #9aabc7)' }}>
          {fC?.faltas != null && fF?.faltas != null && <>Faltas {fC.faltas} x {fF.faltas}</>}
          {fC?.escanteios != null && fF?.escanteios != null && <> · Escanteios {fC.escanteios} x {fF.escanteios}</>}
          {fC?.posse != null && fF?.posse != null && <> · Posse {fC.posse} x {fF.posse}</>}
        </div>
      )}
    </div>
  );
}

function LinhaEstatistica({ e }) {
  const num = v => {
    const n = parseFloat(String(v ?? '').replace('%', '').replace(',', '.'));
    return Number.isNaN(n) ? 0 : n;
  };
  const c = num(e.casa), f = num(e.fora);
  const total = c + f;
  const pc = total > 0 ? (c / total) * 100 : 50;
  const domCasa = e.menorMelhor ? c <= f : c >= f;
  return (
    <div style={{ padding: '7px 0' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:5 }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:13, fontWeight:700, color: domCasa ? '#00e5a0' : 'var(--text2, #c6d1e6)', minWidth:44 }}>
          {e.casa ?? '–'}{e.sufixo && e.casa != null && !String(e.casa).includes('%') ? e.sufixo : ''}
        </span>
        <span style={{ fontSize:11, color:'var(--text3, #9aabc7)', fontWeight:600 }}>{e.label}</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:13, fontWeight:700, color: !domCasa ? '#4d9fff' : 'var(--text2, #c6d1e6)', minWidth:44, textAlign:'right' }}>
          {e.fora ?? '–'}{e.sufixo && e.fora != null && !String(e.fora).includes('%') ? e.sufixo : ''}
        </span>
      </div>
      <div style={{ display:'flex', gap:3, height:4 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,.05)', borderRadius:2, overflow:'hidden', display:'flex', justifyContent:'flex-end' }}>
          <div style={{ width:`${pc}%`, background: domCasa ? '#00e5a0' : 'rgba(0,229,160,.35)', borderRadius:2 }}/>
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,.05)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ width:`${100 - pc}%`, background: !domCasa ? '#4d9fff' : 'rgba(77,159,255,.35)', borderRadius:2 }}/>
        </div>
      </div>
    </div>
  );
}

function ColunaEscalacao({ titulo, esc, cor }) {
  if (!esc) return null;
  return (
    <div>
      <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:10 }}>
        <span style={{ fontSize:13, fontWeight:800, color:'var(--text, #f0f4ff)' }}>{titulo}</span>
        {esc.formacao && (
          <span style={{ fontSize:11, fontFamily:'var(--font-mono)', fontWeight:700, color:cor, background:`${cor}18`, border:`1px solid ${cor}33`, borderRadius:6, padding:'1px 7px' }}>
            {esc.formacao}
          </span>
        )}
      </div>
      {esc.titulares.map((j, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700, color:cor, minWidth:20, textAlign:'right' }}>{j.numero ?? '–'}</span>
          <span style={{ fontSize:12.5, fontWeight:600, color:'var(--text, #f0f4ff)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{j.nome}</span>
          <span style={{ fontSize:10, color:'var(--text3, #9aabc7)', letterSpacing:'.05em' }}>{j.posicao}</span>
        </div>
      ))}
      {esc.banco.length > 0 && (
        <>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--text3, #9aabc7)', margin:'14px 0 6px' }}>Banco</div>
          {esc.banco.map((j, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text3, #9aabc7)', minWidth:20, textAlign:'right' }}>{j.numero ?? '–'}</span>
              <span style={{ fontSize:12, color:'var(--text2, #c6d1e6)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{j.nome}</span>
              <span style={{ fontSize:10, color:'var(--text3, #9aabc7)' }}>{j.posicao}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function Analisador({ jogo, onVoltar }) {
  const { assinante } = useAuth();
  const navigate = useNavigate();
  const [aba, setAba] = useState('sugestoes');
  const [conf, setConf] = useState(null);         // dados reais (ESPN)
  const [confStatus, setConfStatus] = useState('carregando'); // carregando | ok | erro
  const isMob = useIsMobile(640);

  const [evento, setEvento] = useState(null); // local, escalações, banco
  const [analise, setAnalise] = useState(null);
  const [analiseStatus, setAnaliseStatus] = useState('carregando');
  const [bankroll, setBankroll] = useState(() => {
    try { return parseFloat(localStorage.getItem('sinalodds_bankroll')) || 500; }
    catch { return 500; }
  });
  const [pernasCombinada, setPernasCombinada] = useState([]);
  const [modalCombinada, setModalCombinada] = useState(false);

  const salvarBankroll = (v) => {
    setBankroll(v);
    try { localStorage.setItem('sinalodds_bankroll', String(v)); } catch { /* ok */ }
  };

  const togglePerna = (m) => {
    setPernasCombinada(pernas => {
      const jaTem = pernas.find(p => p.id === m.id);
      if (jaTem) return pernas.filter(p => p.id !== m.id);
      return [...pernas, { id: m.id, mercado: m.mercado, odd: m.odd, prob: m.probFinal / 100 }];
    });
  };

  // Jogo rolando/encerrado: abre em Estatísticas (sugestões pré-jogo
  // ficam desatualizadas e são ocultadas)
  useEffect(() => {
    if (jogo && (jogo.statusReal === 'ao-vivo' || jogo.statusReal === 'encerrado') && aba === 'sugestoes') {
      setAba('estatisticas');
    }
  }, [jogo?.id]); // eslint-disable-next-line

  useEffect(() => {
    let ativo = true;
    if (!jogo) return;
    setConfStatus('carregando');
    setEvento(null);
    fetchConfronto(jogo.casa.nome, jogo.fora.nome).then(d => {
      if (!ativo) return;
      if (d && (d.casa || d.fora)) { setConf(d); setConfStatus('ok'); }
      else setConfStatus('erro');
    });
    setAnaliseStatus('carregando');
    setAnalise(null);
    fetchAnalise(jogo.id).then(d => {
      if (!ativo) return;
      if (d?.ok) { setAnalise(d); setAnaliseStatus('ok'); }
      else if (d?.jogoIniciado) setAnaliseStatus('iniciado');
      else setAnaliseStatus(d?.mensagem || 'erro');
    });
    let timer = null;
    if (jogo.eventoId) {
      const carregarEvento = () => fetchEvento(jogo.eventoId, jogo.ligaEspn).then(d => {
        if (!ativo || !d) return;
        setEvento(d);
        // jogo rolando: reconsulta a cada 60s pra placar e lances acompanharem
        if (d.status === 'ao-vivo' && !timer) timer = setInterval(carregarEvento, 30 * 1000);
        if (d.status !== 'ao-vivo' && timer) { clearInterval(timer); timer = null; }
      });
      carregarEvento();
    }
    return () => { ativo = false; if (timer) clearInterval(timer); };
  }, [jogo?.id]);

  if (!jogo) return null;

  const o    = jogo.odds || {};
  // Estado ao vivo: prioriza o /api/evento (TTL 45s), senão o que veio na lista
  const stReal  = evento?.status && evento.status !== 'agendado' ? evento.status : jogo.statusReal;
  const placarR = evento?.placar || jogo.placar;
  const relogio = evento?.relogio || jogo.relogio;
  const aoVivoA = stReal === 'ao-vivo';
  const encerA  = stReal === 'encerrado';
  const vbs  = (jogo.valueBets||[]).sort((a,b)=>(b.ev||0)-(a.ev||0));
  const evM  = {};
  for (const v of vbs) evM[v.mercado] = v.ev;


  // Prob bar
  let pC=50, pE=25, pF=25;
  // Ao vivo: probabilidade lance a lance da ESPN substitui a implícita das odds
  const probLive = (aoVivoA && evento?.probAoVivo) ? evento.probAoVivo : null;
  if (o.resultado?.casa && o.resultado?.fora) {
    const rc=1/o.resultado.casa, re=o.resultado.empate?1/o.resultado.empate:0, rf=1/o.resultado.fora;
    const t=rc+re+rf;
    pC=Math.round(rc/t*100); pE=Math.round(re/t*100); pF=Math.round(rf/t*100);
  }

  const ABAS = [
    { id:'sugestoes',  label:'★ Sugestões' },
    { id:'estatisticas',label:'Estatísticas' },
    ...(evento?.escalacoes ? [{ id:'escalacoes', label:'Escalações' }] : []),
    { id:'mercados',   label:'Mercados' },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="ana-wrap" style={{ padding: isMob ? '14px 12px 48px' : '20px 16px 48px' }}>
        <button className="ana-back" onClick={onVoltar}>← Voltar</button>

        {/* Header */}
        <div className="ana-header">
          <div className="ana-header-meta">
            {jogo.competicao} · {jogo.data} às {jogo.hora}
            {evento?.local?.estadio && (
              <span style={{ color:'var(--text3, #9aabc7)' }}>
                {' '}· 📍 {evento.local.estadio}{evento.local.cidade ? `, ${evento.local.cidade}` : ''}
              </span>
            )}
            {jogo.estadio ? ` · ${jogo.estadio}` : ''}
          </div>

          <div className="ana-teams">
            <div className="ana-team-block">
              <FlagImg nome={jogo.casa.nome}/>
              <div style={{ minWidth:0 }}>
                <div className="ana-team-name" style={{ fontSize: isMob ? 17 : 22 }}>{jogo.casa.nome}</div>
              </div>
            </div>

            {(aoVivoA || encerA) && placarR && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flexShrink:0 }}>
                <span style={{
                  fontSize:10, fontWeight:800, letterSpacing:'.08em', padding:'2px 9px', borderRadius:20,
                  color: aoVivoA ? '#ff4d6d' : 'var(--text2, #c6d1e6)',
                  background: aoVivoA ? 'rgba(255,77,109,.1)' : 'rgba(255,255,255,.05)',
                  border: aoVivoA ? '1px solid rgba(255,77,109,.25)' : '1px solid rgba(255,255,255,.1)',
                  animation: aoVivoA ? 'anapulse 1.6s infinite' : 'none',
                }}>
                  {aoVivoA
                    ? `● AO VIVO${relogio ? ` ${relogio}` : ''}`
                    : `ENCERRADO${placarR.penaltisCasa != null ? ' · PÊN.' : jogo.prorrogacao ? ' · PRORR.' : ''}`}
                </span>
                <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize: isMob?26:32, fontWeight:700, color: aoVivoA ? '#ff4d6d' : 'var(--text, #f0f4ff)' }}>
                    {placarR.casa}
                    {placarR.penaltisCasa != null && (
                      <span style={{ fontSize: isMob?13:15, color:'var(--text2, #c6d1e6)', marginLeft:4 }}>({placarR.penaltisCasa})</span>
                    )}
                  </span>
                  <span style={{ fontSize:14, color:'var(--text3, #9aabc7)', fontWeight:700 }}>x</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize: isMob?26:32, fontWeight:700, color: aoVivoA ? '#ff4d6d' : 'var(--text, #f0f4ff)' }}>
                    {placarR.fora}
                    {placarR.penaltisFora != null && (
                      <span style={{ fontSize: isMob?13:15, color:'var(--text2, #c6d1e6)', marginLeft:4 }}>({placarR.penaltisFora})</span>
                    )}
                  </span>
                </div>
              </div>
            )}
            <div className="ana-odds-mid" style={((aoVivoA || encerA) && placarR) || !assinante ? { display:'none' } : undefined}>
              {o.resultado?.casa && [
                { val:o.resultado.casa,   lbl:'1', cor:'#00e5a0' },
                { val:o.resultado.empate, lbl:'X', cor:'var(--text2)' },
                { val:o.resultado.fora,   lbl:'2', cor:'#4d9fff' },
              ].filter(x=>x.val).map(({val,lbl,cor})=>(
                <div key={lbl} className="ana-odd-c">
                  <div className="ana-odd-v" style={{ fontSize:16, color:cor }}>{fmt(val)}</div>
                  <div className="ana-odd-l">{lbl}</div>
                </div>
              ))}
            </div>

            <div className="ana-team-block ana-team-block-right">
              <div style={{ minWidth:0 }}>
                <div className="ana-team-name" style={{ fontSize: isMob ? 17 : 22, textAlign:'right' }}>{jogo.fora.nome}</div>
              </div>
              <FlagImg nome={jogo.fora.nome}/>
            </div>
          </div>

          {/* Prob bar: escondida pra não assinante em pré-jogo (é dica) */}
          {(assinante || aoVivoA || encerA) && (() => {
            const vC = probLive ? probLive.casa   : pC;
            const vE = probLive ? probLive.empate : pE;
            const vF = probLive ? probLive.fora   : pF;
            return (
              <div className="ana-prob-bar">
                <div className="ana-prob-track">
                  <div style={{ width:vC+'%', background:'linear-gradient(90deg,#00e5a0,#00c88a)', transition:'width .6s ease' }}/>
                  <div style={{ width:vE+'%', background:'var(--bg4)', margin:'0 2px', transition:'width .6s ease' }}/>
                  <div style={{ width:vF+'%', background:'linear-gradient(90deg,#4d9fff,#2979d9)', transition:'width .6s ease' }}/>
                </div>
                <div className="ana-prob-pcts">
                  <span style={{ color:'#00e5a0' }}>{jogo.casa.nome.split(' ')[0]} {vC}%</span>
                  <span style={{ color:'var(--text3)', fontWeight:400, fontSize:10 }}>
                    Emp {vE}%{probLive && <span style={{ color:'#ff4d6d', fontWeight:800, marginLeft:6 }}>· AO VIVO</span>}
                  </span>
                  <span style={{ color:'#4d9fff' }}>{jogo.fora.nome.split(' ')[0]} {vF}%</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Lances ao vivo / do jogo */}
        {(aoVivoA || encerA) && evento && (evento.gols?.length > 0 || evento.cartoes?.length > 0) && (
          <div style={{ background:'var(--bg2, #0f1520)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:'14px 16px', marginBottom:18 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--text3, #9aabc7)', marginBottom:10 }}>
              Lances do jogo
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:12 }}>
              <div>
                {(evento.gols||[]).filter(g => g.timeId === evento.casaId).map((g,i) => (
                  <div key={i} style={{ fontSize:12.5, color:'var(--text, #f0f4ff)', padding:'3px 0' }}>
                    ⚽ {g.jogador || 'Gol'} <span style={{ color:'#00e5a0', fontFamily:'var(--font-mono)', fontSize:11 }}>{g.minuto}</span>
                    {g.penalti && <span style={{ fontSize:10, color:'var(--text3, #9aabc7)' }}> (pên.)</span>}
                    {g.contra && <span style={{ fontSize:10, color:'var(--text3, #9aabc7)' }}> (contra)</span>}
                  </div>
                ))}
                {(evento.cartoes||[]).filter(c => c.timeId === evento.casaId && c.tipo==='vermelho').map((c,i) => (
                  <div key={i} style={{ fontSize:12, color:'var(--text2, #c6d1e6)', padding:'3px 0' }}>
                    🟥 {c.jogador} <span style={{ fontFamily:'var(--font-mono)', fontSize:11 }}>{c.minuto}</span>
                  </div>
                ))}
              </div>
              <div style={{ width:1, background:'rgba(255,255,255,.07)' }}/>
              <div style={{ textAlign:'right' }}>
                {(evento.gols||[]).filter(g => g.timeId === evento.foraId).map((g,i) => (
                  <div key={i} style={{ fontSize:12.5, color:'var(--text, #f0f4ff)', padding:'3px 0' }}>
                    <span style={{ color:'#4d9fff', fontFamily:'var(--font-mono)', fontSize:11 }}>{g.minuto}</span> {g.jogador || 'Gol'} ⚽
                    {g.penalti && <span style={{ fontSize:10, color:'var(--text3, #9aabc7)' }}> (pên.)</span>}
                    {g.contra && <span style={{ fontSize:10, color:'var(--text3, #9aabc7)' }}> (contra)</span>}
                  </div>
                ))}
                {(evento.cartoes||[]).filter(c => c.timeId === evento.foraId && c.tipo==='vermelho').map((c,i) => (
                  <div key={i} style={{ fontSize:12, color:'var(--text2, #c6d1e6)', padding:'3px 0' }}>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:11 }}>{c.minuto}</span> {c.jogador} 🟥
                  </div>
                ))}
              </div>
            </div>
            {(evento.cartoes||[]).filter(c => c.tipo==='amarelo').length > 0 && (
              <div style={{ marginTop:8, fontSize:11, color:'var(--text3, #9aabc7)' }}>
                🟨 {(evento.cartoes||[]).filter(c => c.tipo==='amarelo' && c.timeId===evento.casaId).length} x{' '}
                {(evento.cartoes||[]).filter(c => c.tipo==='amarelo' && c.timeId===evento.foraId).length} amarelos
              </div>
            )}
          </div>
        )}

        {/* Estatísticas da partida (ao vivo / encerrado) */}
        {(aoVivoA || encerA) && evento?.estatisticas?.length > 0 && (
          <div style={{ background:'var(--bg2, #0f1520)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:'14px 16px', marginBottom:18 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--text3, #9aabc7)' }}>
                Estatísticas da partida
              </span>
              {aoVivoA && (
                <span style={{ fontSize:9, fontWeight:800, letterSpacing:'.08em', color:'#ff4d6d', animation:'anapulse 1.6s infinite' }}>● TEMPO REAL</span>
              )}
            </div>
            {evento.estatisticas.map((e, i) => <LinhaEstatistica key={i} e={e} />)}
          </div>
        )}

        {/* Abas */}
        <div className="ana-tabs">
          {ABAS.map(a=>(
            <button key={a.id} className={`ana-tab${aba===a.id?' active':''}`}
              onClick={()=>setAba(a.id)}>{a.label}</button>
          ))}
        </div>

        {/* ── SUGESTÕES ── */}
        {(aoVivoA || encerA) && (aba==='sugestoes' || aba==='mercados') && (
          <div style={{ padding:'16px 18px', background:'rgba(255,184,48,.05)', border:'1px solid rgba(255,184,48,.18)', borderRadius:14, fontSize:13, color:'var(--text2, #c6d1e6)', lineHeight:1.7 }}>
            <strong style={{ color:'#ffb830' }}>{aoVivoA ? 'Jogo em andamento' : 'Jogo encerrado'}</strong> — as sugestões
            e odds exibidas aqui são calculadas no pré-jogo e ficam desatualizadas
            {aoVivoA ? ' com a partida rolando' : ' após o fim da partida'}. Confira as
            estatísticas e os lances em tempo real nas outras abas.
          </div>
        )}

        {!assinante && (aba==='sugestoes' || aba==='estatisticas') && analiseStatus === 'iniciado' && (
          <div style={{ background:'#0f1520', border:'1px solid rgba(255,255,255,.07)', borderRadius:16, padding:'22px 20px', textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:800, color:'var(--text,#f0f4ff)', marginBottom:8 }}>
              Este jogo já começou
            </div>
            <div style={{ fontSize:13, color:'var(--text2,#c6d1e6)', lineHeight:1.7, maxWidth:400, margin:'0 auto 18px' }}>
              Sinais e sugestões só valem <strong>antes da bola rolar</strong> — odds e cenário mudam com a partida em andamento.
              Assine para acessar as análises dos próximos jogos.
            </div>
            <button onClick={() => navigate('/premium')}
              style={{ padding:'12px 28px', borderRadius:12, border:'none', background:'#00e5a0', color:'#000', fontSize:13.5, fontWeight:800, cursor:'pointer' }}>
              Ver planos
            </button>
          </div>
        )}

        {!assinante && (aba==='sugestoes' || aba==='estatisticas') && analiseStatus === 'carregando' && (
          <SkelTeaser/>
        )}

        {!assinante && (aba==='sugestoes' || aba==='estatisticas') && analiseStatus !== 'iniciado' && analiseStatus !== 'carregando' && (() => {
          const t = analise?.teaser ? analise : null;
          const temValor = t?.resumo?.mercadosComValor > 0;

          return (
            <div className='sk-fade-in' style={{ background:'linear-gradient(135deg, rgba(0,229,160,.08), rgba(77,159,255,.04))', border:'1.5px solid rgba(0,229,160,.28)', borderRadius:18, padding:'32px 24px', textAlign:'center' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,229,160,.12)', border:'1px solid rgba(0,229,160,.28)', borderRadius:20, padding:'4px 12px', fontSize:10, fontWeight:800, letterSpacing:'.12em', color:'#00e5a0', marginBottom:18 }}>
                ★ EXCLUSIVO PARA ASSINANTES
              </div>

              {/* Prova macro — só que a análise EXISTE e foi feita */}
              {t?.resumo && (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color:'var(--text,#f0f4ff)', lineHeight:1.3, marginBottom:6, padding:'0 8px' }}>
                    {temValor
                      ? <>Este jogo tem <span style={{ color:'#00e5a0' }}>{t.resumo.mercadosComValor} {t.resumo.mercadosComValor===1?'sinal de valor':'sinais de valor'}</span></>
                      : <>Nenhum valor identificado neste jogo</>}
                  </div>
                  <div style={{ fontSize:12.5, color:'var(--text3,#9aabc7)', maxWidth:400, margin:'0 auto' }}>
                    {temValor
                      ? <>Analisamos {t.resumo.mercadosAnalisados} mercados com base em {t.jogosBase} jogos recentes{t.confrontosDiretos > 0 && <> e {t.confrontosDiretos} confronto{t.confrontosDiretos>1?'s':''} direto{t.confrontosDiretos>1?'s':''}</>}.</>
                      : <>Analisamos {t.resumo.mercadosAnalisados} mercados — as odds estão alinhadas com a frequência real. Não apostar também é uma decisão de valor.</>}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div style={{ margin:'22px auto 0', maxWidth:400 }}>
                <div style={{ fontSize:13.5, color:'var(--text2,#c6d1e6)', lineHeight:1.7, marginBottom:16 }}>
                  Veja quais mercados, com <strong>odds, EV, probabilidade real</strong> e a evidência completa.<br/>
                  Todas as análises por <strong style={{ color:'var(--text,#f0f4ff)' }}>R$ 9,99/mês</strong>.
                </div>
                <button onClick={() => navigate('/premium')}
                  style={{ padding:'14px 32px', borderRadius:12, border:'none', background:'#00e5a0', color:'#000', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 8px 24px rgba(0,229,160,.2)' }}>
                  Assinar e ver as análises →
                </button>
              </div>
            </div>
          );
        })()}

        {assinante && !(aoVivoA || encerA) && aba==='sugestoes' && (
          <div>
            {analiseStatus === 'carregando' && (
              <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text3, #9aabc7)', fontSize:13 }}>
                Analisando mercados com base nos resultados reais…
              </div>
            )}

            {analiseStatus !== 'carregando' && analiseStatus !== 'ok' && (
              <div style={{ padding:'14px 16px', background:'rgba(255,184,48,.05)', border:'1px solid rgba(255,184,48,.18)', borderRadius:12, fontSize:13, color:'var(--text2, #c6d1e6)' }}>
                {typeof analiseStatus === 'string' && analiseStatus !== 'erro'
                  ? analiseStatus
                  : 'Não foi possível montar a análise deste jogo agora.'}
              </div>
            )}

            {analiseStatus === 'ok' && analise && (() => {
              const NIVEIS = {
                forte:  { rotulo: 'VALOR FORTE', cor: '#00e5a0', bg: 'rgba(0,229,160,.07)',  borda: 'rgba(0,229,160,.3)' },
                valor:  { rotulo: 'VALOR',       cor: '#4d9fff', bg: 'rgba(77,159,255,.06)', borda: 'rgba(77,159,255,.28)' },
                neutro: { rotulo: 'NEUTRO',      cor: '#9aabc7', bg: 'transparent',          borda: 'rgba(255,255,255,.08)' },
                evitar: { rotulo: 'SEM VALOR',   cor: '#ff4d6d', bg: 'transparent',          borda: 'rgba(255,255,255,.08)' },
              };
              const comValor = analise.mercados.filter(m => m.nivel==='forte' || m.nivel==='valor');
              const semValor = analise.mercados.filter(m => m.nivel!=='forte' && m.nivel!=='valor');

              const CardMercado = ({ m }) => {
                const nv = NIVEIS[m.nivel];
                const temValor = m.nivel === 'forte' || m.nivel === 'valor';
                const naCombinada = pernasCombinada.find(p => p.id === m.id);
                // Kelly: fração do bankroll sugerida (quarter Kelly, seguro)
                const kellyPct = m.kellyPct ?? 0;
                const stakeSugerido = temValor && kellyPct > 0
                  ? Math.max(5, Math.round(bankroll * kellyPct / 100))
                  : 0;
                const retornoSugerido = stakeSugerido * m.odd;
                const lucroSugerido = retornoSugerido - stakeSugerido;

                return (
                  <div style={{ background: nv.bg, border:`1px solid ${nv.borda}`, borderRadius:14, padding:'14px 16px', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.1em', color:nv.cor, marginBottom:4 }}>{nv.rotulo}</div>
                        <div style={{ fontSize:15, fontWeight:700, color:'var(--text, #f0f4ff)' }}>{m.mercado}</div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:700, color:'var(--text, #f0f4ff)' }}>{m.odd.toFixed(2)}</div>
                        <div style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700, color: m.ev >= 0 ? '#00e5a0' : '#ff4d6d' }}>
                          {m.ev >= 0 ? '+' : ''}{m.ev}% EV
                        </div>
                      </div>
                    </div>

                    {/* Nossa estimativa vs preço da casa */}
                    <div style={{ display:'flex', gap:14, marginTop:10, fontSize:11, color:'var(--text3, #9aabc7)', flexWrap:'wrap' }}>
                      <span>Nossa estimativa: <strong style={{ color:'var(--text, #f0f4ff)', fontFamily:'var(--font-mono)' }}>{m.probFinal}%</strong></span>
                      <span>Preço da casa: <strong style={{ color:'var(--text2, #c6d1e6)', fontFamily:'var(--font-mono)' }}>{m.probJusta}%</strong></span>
                      {m.probEmpirica != null && (
                        <span>Frequência real: <strong style={{ color:'var(--text2, #c6d1e6)', fontFamily:'var(--font-mono)' }}>{m.probEmpirica}%</strong> ({m.amostra} jogos)</span>
                      )}
                    </div>

                    {/* Evidência verificável */}
                    <div style={{ marginTop:8, fontSize:12, color:'var(--text2, #c6d1e6)', lineHeight:1.6 }}>
                      📊 {m.evidencia}
                      {m.h2h && <span style={{ color:'var(--text3, #9aabc7)' }}> · {m.h2h.texto}</span>}
                    </div>

                    {/* Simulador de retorno + Kelly (só pra sinais com valor) */}
                    {temValor && stakeSugerido > 0 && (
                      <div style={{ marginTop:12, padding:'10px 12px', background:'rgba(0,0,0,.25)', border:`1px dashed ${nv.borda}`, borderRadius:10, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap', fontSize:12 }}>
                        <div>
                          <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', color:'var(--text3,#9aabc7)', textTransform:'uppercase', marginBottom:2 }}>Stake sugerido</div>
                          <div style={{ fontFamily:'var(--font-mono)', fontSize:15, fontWeight:700, color:nv.cor }}>R$ {stakeSugerido}</div>
                          <div style={{ fontSize:10, color:'var(--text3,#9aabc7)', marginTop:2 }}>{kellyPct.toFixed(2)}% do bankroll (Kelly)</div>
                        </div>
                        <div style={{ borderLeft:'1px solid rgba(255,255,255,.08)', paddingLeft:16 }}>
                          <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.1em', color:'var(--text3,#9aabc7)', textTransform:'uppercase', marginBottom:2 }}>Se acertar</div>
                          <div style={{ fontFamily:'var(--font-mono)', fontSize:15, fontWeight:700, color:'var(--text,#f0f4ff)' }}>R$ {retornoSugerido.toFixed(0)}</div>
                          <div style={{ fontSize:10, color:'var(--text3,#9aabc7)', marginTop:2 }}>Lucro: +R$ {lucroSugerido.toFixed(0)}</div>
                        </div>
                        <button onClick={() => togglePerna(m)}
                          style={{ marginLeft:'auto', padding:'6px 12px', borderRadius:8, border:`1px solid ${naCombinada ? nv.cor : 'rgba(255,255,255,.15)'}`, background: naCombinada ? `${nv.cor}22` : 'transparent', color: naCombinada ? nv.cor : 'var(--text2,#c6d1e6)', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                          {naCombinada ? '✓ Na combinada' : '+ Combinar'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              };

              // Total potencial se apostar todos os sinais com valor
              const investimentoTotal = comValor.reduce((acc, m) => {
                const k = m.kellyPct ?? 0;
                return acc + (k > 0 ? Math.max(5, Math.round(bankroll * k / 100)) : 0);
              }, 0);
              const retornoPotencialMedio = comValor.reduce((acc, m) => {
                const k = m.kellyPct ?? 0;
                const stake = k > 0 ? Math.max(5, Math.round(bankroll * k / 100)) : 0;
                return acc + stake * (m.probFinal / 100) * m.odd;
              }, 0);

              return (
                <>
                  {/* Bankroll + resumo do potencial */}
                  {comValor.length > 0 && (
                    <div style={{ padding:'14px 16px', background:'linear-gradient(135deg, rgba(0,229,160,.06), rgba(77,159,255,.04))', border:'1px solid rgba(0,229,160,.22)', borderRadius:14, marginBottom:14 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                        <div>
                          <label style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', color:'var(--text3,#9aabc7)', textTransform:'uppercase' }}>Meu bankroll</label>
                          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
                            <span style={{ fontFamily:'var(--font-mono)', fontSize:16, color:'var(--text2,#c6d1e6)' }}>R$</span>
                            <input
                              type="number"
                              value={bankroll}
                              onChange={e => salvarBankroll(Math.max(0, parseFloat(e.target.value) || 0))}
                              style={{ background:'rgba(0,0,0,.3)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'6px 10px', color:'var(--text,#f0f4ff)', fontFamily:'var(--font-mono)', fontSize:18, fontWeight:700, width:100, outline:'none' }}
                            />
                          </div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', color:'var(--text3,#9aabc7)', textTransform:'uppercase', marginBottom:4 }}>
                            Se apostar tudo o sugerido
                          </div>
                          <div style={{ display:'flex', gap:14, alignItems:'baseline' }}>
                            <div>
                              <div style={{ fontSize:9, color:'var(--text3,#9aabc7)' }}>Investimento</div>
                              <div style={{ fontFamily:'var(--font-mono)', fontSize:15, fontWeight:700, color:'var(--text,#f0f4ff)' }}>R$ {investimentoTotal}</div>
                            </div>
                            <div>
                              <div style={{ fontSize:9, color:'var(--text3,#9aabc7)' }}>Retorno esperado</div>
                              <div style={{ fontFamily:'var(--font-mono)', fontSize:15, fontWeight:700, color:'#00e5a0' }}>R$ {retornoPotencialMedio.toFixed(0)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize:11, color:'var(--text3,#9aabc7)', marginTop:10, lineHeight:1.5 }}>
                        💡 O <strong>stake sugerido</strong> em cada sinal usa o <strong>Critério de Kelly (quarter)</strong> — a fórmula que apostadores profissionais usam pra maximizar retorno de longo prazo controlando a variância. Retorno esperado = média ponderada dos cenários (acerto × probabilidade real).
                      </div>
                    </div>
                  )}

                  <div style={{ padding:'10px 14px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:10, fontSize:11.5, color:'var(--text3, #9aabc7)', lineHeight:1.6, marginBottom:16 }}>
                    Base: <strong style={{ color:'var(--text2, #c6d1e6)' }}>{analise.base.jogosAnalisados} jogos recentes</strong>
                    {analise.base.confrontosDiretos > 0 && <> + <strong style={{ color:'var(--text2, #c6d1e6)' }}>{analise.base.confrontosDiretos} confronto{analise.base.confrontosDiretos>1?'s':''} direto{analise.base.confrontosDiretos>1?'s':''}</strong></>}
                    {' '}· {analise.base.metodologia}
                  </div>

                  {comValor.length === 0 && (
                    <div style={{ textAlign:'center', padding:'28px 16px', background:'var(--bg2, #0f1520)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, marginBottom:16 }}>
                      <div style={{ fontSize:15, fontWeight:700, color:'var(--text, #f0f4ff)', marginBottom:6 }}>Nenhum valor identificado neste jogo</div>
                      <div style={{ fontSize:12.5, color:'var(--text3, #9aabc7)', lineHeight:1.6, maxWidth:400, margin:'0 auto' }}>
                        As odds estão alinhadas com a frequência real dos eventos — e não apostar
                        também é uma decisão de valor. Veja abaixo a análise de cada mercado.
                      </div>
                    </div>
                  )}

                  {comValor.map(m => <CardMercado key={m.id} m={m} />)}

                  {semValor.length > 0 && (
                    <>
                      <div className="ana-divider" style={{ marginTop: comValor.length ? 20 : 0 }}>Demais mercados analisados</div>
                      {semValor.map(m => <CardMercado key={m.id} m={m} />)}
                    </>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* ── ESTATÍSTICAS ── */}
        {assinante && aba==='estatisticas' && (
          <div>
            {/* Dados reais — ESPN */}
            {confStatus === 'carregando' && (
              <div className="sk-fade-in" style={{ marginBottom: 20 }}>
                <div style={{ marginBottom: 12 }}><span className="sk" style={{ width: 220, height: 12, borderRadius: 6, display: 'inline-block' }}/></div>
                <SkelCard/>
                <SkelCard/>
              </div>
            )}

            {confStatus === 'ok' && conf && (
              <>
                {/* Confronto direto */}
                {conf.h2h?.length > 0 && (
                  <>
                    <div className="ana-divider">Confronto direto — {jogo.casa.nome} x {jogo.fora.nome}</div>
                    <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                      {[
                        { v: conf.resumoH2H.vitoriasCasa, l: jogo.casa.nome, c: '#00e5a0' },
                        { v: conf.resumoH2H.empates,      l: 'Empates',      c: '#c6d1e6' },
                        { v: conf.resumoH2H.vitoriasFora, l: jogo.fora.nome, c: '#4d9fff' },
                      ].map(({v,l,c}) => (
                        <div key={l} style={{ flex:1, textAlign:'center', background:'var(--bg2, #0f1520)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:'12px 8px' }}>
                          <div style={{ fontFamily:'var(--font-mono)', fontSize:22, fontWeight:700, color:c }}>{v}</div>
                          <div style={{ fontSize:10, color:'var(--text3, #9aabc7)', marginTop:2 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom:24 }}>
                      {conf.h2h.map(j => <LinhaH2H key={j.eventoId} j={j} nomeCasa={jogo.casa.nome} confrontoData={conf}/>)}
                    </div>
                  </>
                )}

                {/* Comparativo das seleções (calculado dos resultados reais) */}
                {conf.casa?.ultimos?.length > 0 && conf.fora?.ultimos?.length > 0 && (() => {
                  const resumo = t => {
                    const js = t.ultimos || [];
                    const v = js.filter(j => j.resultado === 'V').length;
                    const e = js.filter(j => j.resultado === 'E').length;
                    const d = js.filter(j => j.resultado === 'D').length;
                    const gp = js.reduce((n, j) => n + j.golsPro, 0);
                    const gc = js.reduce((n, j) => n + j.golsContra, 0);
                    const aproveitamento = js.length ? Math.round((v * 3 + e) / (js.length * 3) * 100) : 0;
                    return { n: js.length, v, e, d, gp, gc, aproveitamento, forma: js.slice(0, 5) };
                  };
                  const rc = resumo(conf.casa);
                  const rf = resumo(conf.fora);
                  const linhas = [
                    { label: 'Vitórias',        casa: rc.v,  fora: rf.v },
                    { label: 'Gols marcados',   casa: rc.gp, fora: rf.gp },
                    { label: 'Gols sofridos',   casa: rc.gc, fora: rf.gc, menorMelhor: true },
                    { label: 'Aproveitamento',  casa: rc.aproveitamento, fora: rf.aproveitamento, sufixo: '%' },
                  ];
                  const Dot = ({ r }) => (
                    <span style={{ width:18, height:18, borderRadius:'50%', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800,
                      color: r==='V' ? '#000' : '#fff',
                      background: r==='V' ? '#00e5a0' : r==='E' ? '#3a4356' : '#ff4d6d' }}>{r}</span>
                  );
                  return (
                    <>
                      <div className="ana-divider">Comparativo — últimos {rc.n} jogos de cada seleção</div>
                      <div style={{ background:'var(--bg2, #0f1520)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:'14px 16px', marginBottom:24 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                          <div style={{ display:'flex', gap:4 }}>{rc.forma.slice().reverse().map((j,i)=><Dot key={i} r={j.resultado}/>)}</div>
                          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--text3, #9aabc7)' }}>Forma recente</span>
                          <div style={{ display:'flex', gap:4 }}>{rf.forma.slice().reverse().map((j,i)=><Dot key={i} r={j.resultado}/>)}</div>
                        </div>
                        {linhas.map((e,i)=><LinhaEstatistica key={i} e={e}/>)}
                        <div style={{ fontSize:10, color:'var(--text3, #9aabc7)', textAlign:'center', marginTop:8 }}>
                          {jogo.casa.nome} à esquerda · {jogo.fora.nome} à direita · Copa e amistosos recentes
                        </div>
                      </div>
                    </>
                  );
                })()}

                {/* Últimos jogos reais */}
                {(conf.casa?.ultimos?.length > 0 || conf.fora?.ultimos?.length > 0) && (
                  <>
                    <div className="ana-divider">Últimos jogos — resultados reais</div>
                    <div className="ana-stats-grid" style={{ marginBottom:24, gridTemplateColumns: isMob ? '1fr' : '1fr 1fr' }}>
                      {[[jogo.casa.nome, conf.casa], [jogo.fora.nome, conf.fora]].map(([nome, t]) => t?.ultimos?.length > 0 && (
                        <div key={nome}>
                          <div style={{ fontSize:12, fontWeight:700, color:'var(--text2, #c6d1e6)', marginBottom:10 }}>{nome}</div>
                          {t.ultimos.map(j => <LinhaJogoReal key={j.eventoId} j={j} espnId={t.espnId}/>)}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div style={{ fontSize:10, color:'var(--text3, #9aabc7)', textAlign:'right', marginTop:-14, marginBottom:20 }}>
                  Fonte: ESPN · atualizado a cada 6h
                </div>
              </>
            )}

            {confStatus === 'erro' && (
              <div style={{ padding:'12px 14px', background:'rgba(255,184,48,.06)', border:'1px solid rgba(255,184,48,.2)', borderRadius:10, fontSize:12, color:'var(--text2, #c6d1e6)', marginBottom:20 }}>
                Não foi possível carregar as estatísticas reais agora. Tente novamente em instantes.
              </div>
            )}

          </div>
        )}

        {/* ── MERCADOS ── */}
        {aba==='escalacoes' && evento?.escalacoes && (
          <div>
            <div className="ana-divider">Escalações{evento.local?.estadio ? ` — ${evento.local.estadio}` : ''}</div>
            <div style={{ display:'grid', gridTemplateColumns: isMob ? '1fr' : '1fr 1fr', gap: isMob ? 28 : 40, marginBottom: 24 }}>
              <ColunaEscalacao titulo={jogo.casa.nome} esc={evento.escalacoes.casa} cor="#00e5a0" />
              <ColunaEscalacao titulo={jogo.fora.nome} esc={evento.escalacoes.fora} cor="#4d9fff" />
            </div>
            {evento.arbitros?.length > 0 && (
              <div style={{ fontSize:11, color:'var(--text3, #9aabc7)' }}>
                Arbitragem: {evento.arbitros.join(' · ')}
              </div>
            )}
            <div style={{ fontSize:10, color:'var(--text3, #9aabc7)', textAlign:'right', marginTop:12 }}>
              Fonte: ESPN
            </div>
          </div>
        )}

        {!(aoVivoA || encerA) && aba==='mercados' && (
          <div className="ana-mercados">
            {[
              { titulo:'Resultado (90 minutos)', itens:[
                { label:`${jogo.casa.nome} vence`, odd:o.resultado?.casa, ev:evM[`${jogo.casa.nome} vence`] },
                { label:'Empate', odd:o.resultado?.empate, ev:evM['Empate'] },
                { label:`${jogo.fora.nome} vence`, odd:o.resultado?.fora, ev:evM[`${jogo.fora.nome} vence`] },
              ]},
              o.qualificar?.casa && { titulo:'Para se classificar (com prorrogação e pênaltis)', itens:[
                { label:`${jogo.casa.nome} avança`, odd:o.qualificar?.casa },
                { label:`${jogo.fora.nome} avança`, odd:o.qualificar?.fora },
              ]},
              { titulo:`Total de gols — linha ${o.totalGols?.linha||2.5}`, itens:[
                { label:`Mais de ${o.totalGols?.linha||2.5} gols`, odd:o.totalGols?.mais, ev:evM[`Mais de ${o.totalGols?.linha||2.5} gols`] },
                { label:`Menos de ${o.totalGols?.linha||2.5} gols`, odd:o.totalGols?.menos, ev:evM[`Menos de ${o.totalGols?.linha||2.5} gols`] },
              ]},
              { titulo:'Ambas as equipes marcam', itens:[
                { label:'Sim', odd:o.ambasMarcam?.sim, ev:evM['Ambas marcam — Sim'] },
                { label:'Não', odd:o.ambasMarcam?.nao, ev:evM['Ambas marcam — Não'] },
              ]},
              o.primeiroGol?.casa && { titulo:'Primeiro gol', itens:[
                { label:`${jogo.casa.nome} marca primeiro`, odd:o.primeiroGol?.casa, ev:evM[`${jogo.casa.nome} marca primeiro`] },
                { label:'Nenhum gol', odd:o.primeiroGol?.nenhum },
                { label:`${jogo.fora.nome} marca primeiro`, odd:o.primeiroGol?.fora },
              ]},
              o.chanceDupla?.casaEmpate && { titulo:'Chance dupla', itens:[
                { label:`${jogo.casa.nome} ou Empate`, odd:o.chanceDupla?.casaEmpate },
                { label:`${jogo.casa.nome} ou ${jogo.fora.nome}`, odd:o.chanceDupla?.casaFora },
                { label:`Empate ou ${jogo.fora.nome}`, odd:o.chanceDupla?.empataFora },
              ]},
              o.handicap?.length && { titulo:`Handicap asiático — ${jogo.casa.nome}`, itens:o.handicap.map(h=>({ label:`${jogo.casa.nome} ${h.linha}`, odd:h.odd })) },
            ].filter(Boolean).map(sec=>(
              <div key={sec.titulo}>
                <div className="ana-divider">{sec.titulo}</div>
                {sec.itens.map((it,i)=><MktRow key={i} label={it.label} odd={it.odd} ev={it.ev}/>)}
              </div>
            ))}
          </div>
        )}

        {/* ── PLACARES ── */}
      </div>

      {/* Botão flutuante de combinada — só assinante */}
      {assinante && pernasCombinada.length >= 2 && !modalCombinada && (
        <button onClick={() => setModalCombinada(true)}
          style={{ position:'fixed', bottom:24, right:24, padding:'14px 22px', borderRadius:999, border:'none', background:'linear-gradient(135deg,#00e5a0,#00c88a)', color:'#000', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 12px 32px rgba(0,229,160,.35)', display:'flex', alignItems:'center', gap:10, zIndex:100 }}>
          <span style={{ background:'#000', color:'#00e5a0', borderRadius:999, minWidth:22, height:22, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>{pernasCombinada.length}</span>
          Simular combinada →
        </button>
      )}

      {/* Modal de combinada */}
      {modalCombinada && <ModalCombinada
        pernas={pernasCombinada}
        bankroll={bankroll}
        aoRemover={id => setPernasCombinada(pernas => pernas.filter(p => p.id !== id))}
        aoFechar={() => setModalCombinada(false)}
        aoLimpar={() => { setPernasCombinada([]); setModalCombinada(false); }}
      />}
    </>
  );
}

/* Modal do simulador de combinada — matemática honesta */
function ModalCombinada({ pernas, bankroll, aoRemover, aoFechar, aoLimpar }) {
  const [stake, setStake] = useState(() => Math.max(10, Math.round(bankroll * 0.02)));

  // Cálculo direto no cliente — não precisa bater na API pra simular
  const oddCombinada  = pernas.reduce((a, p) => a * p.odd, 1);
  const probCombinada = pernas.reduce((a, p) => a * p.prob, 1);
  const retornoBruto  = stake * oddCombinada;
  const lucroBruto    = retornoBruto - stake;
  const evValor       = stake * (probCombinada * oddCombinada - 1);
  const evPercent     = (probCombinada * oddCombinada - 1) * 100;

  // Comparação: mesmo stake dividido entre as pernas separadas
  const stakePorPerna = stake / pernas.length;
  const evSeparado = pernas.reduce((a, p) =>
    a + stakePorPerna * (p.prob * p.odd - 1), 0);

  const combinadaEhMelhor = evValor > evSeparado;

  return (
    <div onClick={aoFechar} style={{ position:'fixed', inset:0, background:'rgba(5,8,13,.85)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, zIndex:500 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#0f1520', border:'1px solid rgba(255,255,255,.1)', borderRadius:18, padding:24, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.12em', color:'#00e5a0', marginBottom:2 }}>SIMULADOR</div>
            <h3 style={{ margin:0, fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:'var(--text,#f0f4ff)' }}>Combinada de {pernas.length} sinais</h3>
          </div>
          <button onClick={aoFechar} style={{ background:'none', border:'none', color:'var(--text3,#9aabc7)', fontSize:22, cursor:'pointer', padding:4 }}>✕</button>
        </div>

        {/* Pernas */}
        <div style={{ marginBottom:16 }}>
          {pernas.map(p => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:10, marginBottom:6 }}>
              <div style={{ flex:1, fontSize:13, color:'var(--text,#f0f4ff)', fontWeight:600 }}>{p.mercado}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--text2,#c6d1e6)', fontWeight:700 }}>{p.odd.toFixed(2)}</div>
              <button onClick={() => aoRemover(p.id)} style={{ background:'none', border:'none', color:'var(--text3,#9aabc7)', cursor:'pointer', fontSize:16, padding:'0 4px' }}>×</button>
            </div>
          ))}
        </div>

        {/* Stake */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', color:'var(--text3,#9aabc7)', textTransform:'uppercase' }}>Valor a apostar</label>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6 }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:16, color:'var(--text2,#c6d1e6)' }}>R$</span>
            <input type="number" value={stake} onChange={e => setStake(Math.max(1, parseFloat(e.target.value) || 0))}
              style={{ background:'rgba(0,0,0,.3)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'8px 12px', color:'var(--text,#f0f4ff)', fontFamily:'var(--font-mono)', fontSize:20, fontWeight:700, flex:1, outline:'none' }}
            />
          </div>
        </div>

        {/* Resultado */}
        <div style={{ background:'linear-gradient(135deg, rgba(0,229,160,.08), rgba(77,159,255,.04))', border:'1px solid rgba(0,229,160,.25)', borderRadius:14, padding:16, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', color:'var(--text3,#9aabc7)', textTransform:'uppercase' }}>Odd combinada</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:22, fontWeight:700, color:'var(--text,#f0f4ff)' }}>{oddCombinada.toFixed(2)}</div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
            <div style={{ fontSize:12, color:'var(--text3,#9aabc7)' }}>Se acertar tudo</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:700, color:'#00e5a0' }}>R$ {retornoBruto.toFixed(2)}</div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
            <div style={{ fontSize:12, color:'var(--text3,#9aabc7)' }}>Lucro potencial</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:14, color:'var(--text2,#c6d1e6)' }}>+R$ {lucroBruto.toFixed(2)}</div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <div style={{ fontSize:12, color:'var(--text3,#9aabc7)' }}>Chance real de acertar tudo</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--text2,#c6d1e6)' }}>{(probCombinada * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Análise honesta */}
        <div style={{ padding:14, background: combinadaEhMelhor ? 'rgba(0,229,160,.06)' : 'rgba(255,184,48,.06)', border:`1px solid ${combinadaEhMelhor ? 'rgba(0,229,160,.25)' : 'rgba(255,184,48,.25)'}`, borderRadius:12, marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.1em', color: combinadaEhMelhor ? '#00e5a0' : '#ffb830', marginBottom:6 }}>
            {combinadaEhMelhor ? '✓ MATEMATICAMENTE VANTAJOSA' : '⚠ CUIDADO'}
          </div>
          <div style={{ fontSize:12.5, color:'var(--text2,#c6d1e6)', lineHeight:1.6 }}>
            <div style={{ marginBottom:6 }}>
              <strong>EV desta combinada:</strong> <span style={{ fontFamily:'var(--font-mono)', color: evValor >= 0 ? '#00e5a0' : '#ff4d6d' }}>{evValor >= 0 ? '+' : ''}R$ {evValor.toFixed(2)} ({evPercent >= 0 ? '+' : ''}{evPercent.toFixed(1)}%)</span>
            </div>
            <div style={{ marginBottom:6 }}>
              <strong>Se apostasse R$ {stakePorPerna.toFixed(0)} em cada perna separada:</strong> EV total <span style={{ fontFamily:'var(--font-mono)', color: evSeparado >= 0 ? '#00e5a0' : '#ff4d6d' }}>{evSeparado >= 0 ? '+' : ''}R$ {evSeparado.toFixed(2)}</span>
            </div>
            <div style={{ fontSize:11.5, color:'var(--text3,#9aabc7)', marginTop:10, paddingTop:10, borderTop:'1px solid rgba(255,255,255,.06)', lineHeight:1.6 }}>
              {combinadaEhMelhor
                ? 'Com estas pernas, a combinada tem EV maior que apostar separado. Isso é raro e acontece quando várias pernas têm valor forte. Ainda assim, a variância é muito maior — considere isso.'
                : 'Apostar cada perna separadamente tem EV maior (ou perde menos). A múltipla exige acertar TUDO — perde uma, perde tudo. Considere separar.'}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={aoLimpar} style={{ flex:1, padding:'12px', borderRadius:10, border:'1px solid rgba(255,77,109,.3)', background:'transparent', color:'#ff4d6d', fontWeight:700, cursor:'pointer', fontSize:13 }}>Limpar seleção</button>
          <button onClick={aoFechar} style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'#00e5a0', color:'#000', fontWeight:800, cursor:'pointer', fontSize:13 }}>Voltar</button>
        </div>
      </div>
    </div>
  );
}
