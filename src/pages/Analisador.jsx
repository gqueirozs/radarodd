import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { getLogo, getStats, getH2H } from '../data/statsDB';
import { fetchConfronto } from '../data/api';

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

function FormaItem({ jogo }) {
  const cor = jogo.resultado==='V' ? '#00e5a0' : jogo.resultado==='E' ? '#ffb830' : '#ff4d6d';
  const label = jogo.resultado==='V' ? 'Vitória' : jogo.resultado==='E' ? 'Empate' : 'Derrota';
  return (
    <div className="ana-forma-item" style={{ background:cor+'0D', border:`1px solid ${cor}22` }}>
      <div className="ana-forma-left">
        <div className="ana-forma-dot" style={{ background:cor }}/>
        <div>
          <span className="ana-forma-adv">vs {jogo.adversario}</span>
          <span className="ana-forma-data" style={{ marginLeft:8 }}>{jogo.data}</span>
        </div>
      </div>
      <div className="ana-forma-right">
        <span className="ana-forma-placar">{jogo.placar}</span>
        <span className="ana-forma-result" style={{ color:cor }}>{label}</span>
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

const COR_RES = { V: '#00e5a0', E: '#8b9ab4', D: '#ff4d6d' };
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
          vs {j.adversario} <span style={{ color:'var(--text3, #4d5f7a)', fontWeight:500, fontSize:11 }}>{fmtDataISO(j.data)}</span>
        </span>
        <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:13, color:'var(--text, #f0f4ff)' }}>{j.golsPro}-{j.golsContra}</span>
        <span style={{ fontSize:10, fontWeight:800, letterSpacing:'.06em', color:cor, minWidth:56, textAlign:'right' }}>{TXT_RES[j.resultado]}</span>
      </div>
      {(gols.length > 0 || amarelos > 0 || vermelhos > 0) && (
        <div style={{ marginTop:5, fontSize:11, color:'var(--text3, #4d5f7a)', lineHeight:1.5 }}>
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
        <span style={{ fontSize:11, color:'var(--text3, #4d5f7a)', minWidth:56 }}>{fmtDataISO(j.data)}</span>
        <span style={{ fontSize:12, fontWeight:700, color:'var(--text, #f0f4ff)', flex:1 }}>
          {nomeCasa} <span style={{ fontFamily:'var(--font-mono)', color: COR_RES[j.resultado] }}>{j.golsPro} x {j.golsContra}</span> {j.adversario}
        </span>
        <span style={{ fontSize:10, color:'var(--text3, #4d5f7a)', textTransform:'capitalize' }}>{(j.competicao || '').replace(/-/g,' ')}</span>
      </div>
      {(golsCasa.length > 0 || golsFora.length > 0) && (
        <div style={{ marginTop:6, display:'flex', gap:12, fontSize:11, lineHeight:1.5 }}>
          <span style={{ flex:1, color:'#00e5a0' }}>{golsCasa.map(g => `${g.jogador} ${g.minuto||''}`.trim()).join(' · ')}</span>
          <span style={{ flex:1, color:'#4d9fff', textAlign:'right' }}>{golsFora.map(g => `${g.jogador} ${g.minuto||''}`.trim()).join(' · ')}</span>
        </div>
      )}
      {(fC || fF) && (
        <div style={{ marginTop:6, fontSize:10, color:'var(--text3, #4d5f7a)' }}>
          {fC?.faltas != null && fF?.faltas != null && <>Faltas {fC.faltas} x {fF.faltas}</>}
          {fC?.escanteios != null && fF?.escanteios != null && <> · Escanteios {fC.escanteios} x {fF.escanteios}</>}
          {fC?.posse != null && fF?.posse != null && <> · Posse {fC.posse} x {fF.posse}</>}
        </div>
      )}
    </div>
  );
}

export default function Analisador({ jogo, onVoltar }) {
  const [aba, setAba] = useState('sugestoes');
  const [conf, setConf] = useState(null);         // dados reais (ESPN)
  const [confStatus, setConfStatus] = useState('carregando'); // carregando | ok | erro
  const isMob = useIsMobile(640);

  useEffect(() => {
    let ativo = true;
    if (!jogo) return;
    setConfStatus('carregando');
    fetchConfronto(jogo.casa.nome, jogo.fora.nome).then(d => {
      if (!ativo) return;
      if (d && (d.casa || d.fora)) { setConf(d); setConfStatus('ok'); }
      else setConfStatus('erro');
    });
    return () => { ativo = false; };
  }, [jogo?.id]);

  if (!jogo) return null;

  const o    = jogo.odds || {};
  const vbs  = (jogo.valueBets||[]).sort((a,b)=>(b.ev||0)-(a.ev||0));
  const evM  = {};
  for (const v of vbs) evM[v.mercado] = v.ev;

  const stC  = getStats(jogo.casa.nome);
  const stF  = getStats(jogo.fora.nome);
  const h2h  = getH2H(jogo.casa.nome, jogo.fora.nome);

  // Prob bar
  let pC=50, pE=25, pF=25;
  if (o.resultado?.casa && o.resultado?.fora) {
    const rc=1/o.resultado.casa, re=o.resultado.empate?1/o.resultado.empate:0, rf=1/o.resultado.fora;
    const t=rc+re+rf;
    pC=Math.round(rc/t*100); pE=Math.round(re/t*100); pF=Math.round(rf/t*100);
  }

  const ABAS = [
    { id:'sugestoes',  label:'★ Sugestões' },
    { id:'estatisticas',label:'Estatísticas' },
    { id:'mercados',   label:'Mercados' },
    { id:'placares',   label:'Placares' },
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
            {jogo.estadio ? ` · ${jogo.estadio}` : ''}
          </div>

          <div className="ana-teams">
            <div className="ana-team-block">
              <FlagImg nome={jogo.casa.nome}/>
              <div style={{ minWidth:0 }}>
                <div className="ana-team-name" style={{ fontSize: isMob ? 17 : 22 }}>{jogo.casa.nome}</div>
                {stC && <div className="ana-team-sub">{stC.gols_marcados}G · #{stC.ranking_fifa} FIFA</div>}
              </div>
            </div>

            <div className="ana-odds-mid">
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
                {stF && <div className="ana-team-sub" style={{ textAlign:'right' }}>{stF.gols_marcados}G · #{stF.ranking_fifa} FIFA</div>}
              </div>
              <FlagImg nome={jogo.fora.nome}/>
            </div>
          </div>

          {/* Prob bar */}
          <div className="ana-prob-bar">
            <div className="ana-prob-track">
              <div style={{ width:pC+'%', background:'linear-gradient(90deg,#00e5a0,#00c88a)' }}/>
              <div style={{ width:pE+'%', background:'var(--bg4)', margin:'0 2px' }}/>
              <div style={{ width:pF+'%', background:'linear-gradient(90deg,#4d9fff,#2979d9)' }}/>
            </div>
            <div className="ana-prob-pcts">
              <span style={{ color:'#00e5a0' }}>{jogo.casa.nome.split(' ')[0]} {pC}%</span>
              <span style={{ color:'var(--text3)', fontWeight:400, fontSize:10 }}>Emp {pE}%</span>
              <span style={{ color:'#4d9fff' }}>{jogo.fora.nome.split(' ')[0]} {pF}%</span>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="ana-tabs">
          {ABAS.map(a=>(
            <button key={a.id} className={`ana-tab${aba===a.id?' active':''}`}
              onClick={()=>setAba(a.id)}>{a.label}</button>
          ))}
        </div>

        {/* ── SUGESTÕES ── */}
        {aba==='sugestoes' && (
          <div>
            {vbs.filter(v=>v.ev>0).length===0 ? (
              <div className="ana-empty">
                <div style={{ fontSize:32, marginBottom:14 }}>🔍</div>
                <div style={{ fontSize:15, fontWeight:600, color:'var(--text)', marginBottom:8 }}>Sem oportunidades</div>
                <div style={{ fontSize:13, color:'var(--text3)', lineHeight:1.6, maxWidth:320, margin:'0 auto' }}>
                  As odds não apresentam valor esperado positivo para este jogo.
                </div>
              </div>
            ) : (
              <>
                <div className="ana-sug-tip">
                  💡 Ordenado por <strong style={{ color:'var(--text)' }}>valor esperado (EV)</strong> —
                  diferença entre probabilidade real e implícita. EV &gt; 5% = vantagem estatística.
                </div>
                <div className="ana-sug-cards">
                  {vbs.filter(v=>v.ev>0).map((vb,i)=>{
                    const cor = evC(vb.ev);
                    const bg  = vb.ev>5 ? 'rgba(0,229,160,.06)' : 'rgba(255,184,48,.05)';
                    const bd  = vb.ev>5 ? 'rgba(0,229,160,.25)' : 'rgba(255,184,48,.2)';
                    return (
                      <div key={i} className="ana-sug-card" style={{ background:bg, border:`1px solid ${bd}` }}>
                        <div style={{ flex:1 }}>
                          {vb.ev>5 && <div className="ana-sug-label" style={{ color:cor }}>{i===0?'★ Melhor aposta':'★ Sugerido'}</div>}
                          <div className="ana-sug-name">{vb.mercado}</div>
                          <div className="ana-sug-sub">
                            Prob. implícita: {pct(vb.odd)} · <span style={{ color:cor }}>{evL(vb.ev)}</span>
                          </div>
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <div className="ana-sug-odd" style={{ fontSize:22 }}>{fmt(vb.odd)}</div>
                          <div className="ana-sug-ev" style={{ color:cor }}>{vb.ev>0?'+':''}{vb.ev?.toFixed(1)}% EV</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="ana-warn">
                  ⚠️ EV positivo indica vantagem estatística, não garantia. Aposte com responsabilidade.
                </div>
              </>
            )}
          </div>
        )}

        {/* ── ESTATÍSTICAS ── */}
        {aba==='estatisticas' && (
          <div>
            {/* Dados reais — ESPN */}
            {confStatus === 'carregando' && (
              <div style={{ textAlign:'center', padding:'28px 0', color:'var(--text3, #4d5f7a)', fontSize:13 }}>
                Buscando resultados reais das seleções…
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
                        { v: conf.resumoH2H.empates,      l: 'Empates',      c: '#8b9ab4' },
                        { v: conf.resumoH2H.vitoriasFora, l: jogo.fora.nome, c: '#4d9fff' },
                      ].map(({v,l,c}) => (
                        <div key={l} style={{ flex:1, textAlign:'center', background:'var(--bg2, #0f1520)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:'12px 8px' }}>
                          <div style={{ fontFamily:'var(--font-mono)', fontSize:22, fontWeight:700, color:c }}>{v}</div>
                          <div style={{ fontSize:10, color:'var(--text3, #4d5f7a)', marginTop:2 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom:24 }}>
                      {conf.h2h.map(j => <LinhaH2H key={j.eventoId} j={j} nomeCasa={jogo.casa.nome} confrontoData={conf}/>)}
                    </div>
                  </>
                )}

                {/* Últimos jogos reais */}
                {(conf.casa?.ultimos?.length > 0 || conf.fora?.ultimos?.length > 0) && (
                  <>
                    <div className="ana-divider">Últimos jogos — resultados reais</div>
                    <div className="ana-stats-grid" style={{ marginBottom:24, gridTemplateColumns: isMob ? '1fr' : '1fr 1fr' }}>
                      {[[jogo.casa.nome, conf.casa], [jogo.fora.nome, conf.fora]].map(([nome, t]) => t?.ultimos?.length > 0 && (
                        <div key={nome}>
                          <div style={{ fontSize:12, fontWeight:700, color:'var(--text2, #8b9ab4)', marginBottom:10 }}>{nome}</div>
                          {t.ultimos.map(j => <LinhaJogoReal key={j.eventoId} j={j} espnId={t.espnId}/>)}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div style={{ fontSize:10, color:'var(--text3, #4d5f7a)', textAlign:'right', marginTop:-14, marginBottom:20 }}>
                  Fonte: ESPN · atualizado a cada 6h
                </div>
              </>
            )}

            {confStatus === 'erro' && (
              <div style={{ padding:'12px 14px', background:'rgba(255,184,48,.06)', border:'1px solid rgba(255,184,48,.2)', borderRadius:10, fontSize:12, color:'var(--text2, #8b9ab4)', marginBottom:20 }}>
                Não foi possível carregar os resultados reais agora — mostrando dados de referência.
              </div>
            )}

            {(stC||stF) && (
              <>
                <div className="ana-divider">Fase de grupos — Copa 2026</div>
                <div className="ana-stats-grid" style={{ marginBottom:24, gridTemplateColumns: isMob ? '1fr' : '1fr 1fr' }}>
                  {[[jogo.casa.nome,stC,'#00e5a0'],[jogo.fora.nome,stF,'#4d9fff']].map(([nome,st,cor])=>st&&(
                    <div key={nome} className="ana-stat-card">
                      <div className="ana-stat-header">
                        <img src={getLogo(nome)} alt={nome} style={{ width:36,height:36,borderRadius:7,objectFit:'cover',border:'2px solid rgba(255,255,255,.1)',flexShrink:0 }} onError={e=>{e.target.style.display='none';}}/>
                        <span style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>{nome}</span>
                      </div>
                      <div className="ana-stat-nums">
                        {[{v:st.gols_marcados,l:'Gols marcados',c:cor},{v:st.gols_sofridos,l:'Gols sofridos',c:'#ff4d6d'},{v:`#${st.ranking_fifa}`,l:'Ranking FIFA',c:'var(--text2)'}].map(({v,l,c})=>(
                          <div key={l} className="ana-stat-num">
                            <div className="ana-stat-num-val" style={{ color:c }}>{v}</div>
                            <div className="ana-stat-num-lbl">{l}</div>
                          </div>
                        ))}
                      </div>
                      <StatBar label="Posse de bola" val={`${st.posse_media}%`} valRaw={st.posse_media} max={70} cor={cor}/>
                      <StatBar label="Chutes a gol/jogo" val={st.chutes_gol_media} valRaw={st.chutes_gol_media} max={12} cor={cor}/>
                      <StatBar label="Escanteios/jogo" val={st.escanteios_media} valRaw={st.escanteios_media} max={10} cor={cor}/>
                      {st.artilheiro_copa && (
                        <div className="ana-artilheiro">
                          <div>
                            <div className="ana-artilheiro-label">Artilheiro na Copa</div>
                            <div className="ana-artilheiro-nome">{st.artilheiro_copa.nome}</div>
                          </div>
                          <div style={{ fontFamily:'var(--font-mono)',fontSize:20,fontWeight:700,color:cor }}>{st.artilheiro_copa.gols} ⚽</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Forma (referência local — só quando os dados reais falham) */}
            {confStatus !== 'ok' && (stC?.forma_copa||stF?.forma_copa) && (
              <>
                <div className="ana-divider">Últimos jogos na Copa</div>
                <div className="ana-stats-grid" style={{ marginBottom:24, gridTemplateColumns: isMob ? '1fr' : '1fr 1fr' }}>
                  {[[jogo.casa.nome,stC],[jogo.fora.nome,stF]].map(([nome,st])=>st?.forma_copa&&(
                    <div key={nome}>
                      <div style={{ fontSize:12,fontWeight:700,color:'var(--text2)',marginBottom:10 }}>{nome}</div>
                      {st.forma_copa.map((j,i)=><FormaItem key={i} jogo={j}/>)}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* H2H (referência local — só quando os dados reais falham) */}
            {confStatus !== 'ok' && h2h && (
              <>
                <div className="ana-divider">Histórico de confrontos diretos</div>
                <div className="ana-h2h-box" style={{ marginBottom:24 }}>
                  <div className="ana-h2h-nums">
                    <div>
                      <div className="ana-h2h-num" style={{ color:'#00e5a0' }}>
                        {h2h[Object.keys(h2h).find(k=>!['total','empates','confrontos','nota'].includes(k)&&!k.includes('gols'))]||0}
                      </div>
                      <div className="ana-h2h-sub">{jogo.casa.nome}</div>
                    </div>
                    <div>
                      <div className="ana-h2h-num" style={{ color:'var(--text2)' }}>{h2h.empates||0}</div>
                      <div className="ana-h2h-sub">Empates</div>
                    </div>
                    <div>
                      <div className="ana-h2h-num" style={{ color:'#4d9fff' }}>
                        {h2h[Object.keys(h2h).filter(k=>!['total','empates','confrontos','nota'].includes(k)&&!k.includes('gols')).slice(-1)[0]]||0}
                      </div>
                      <div className="ana-h2h-sub">{jogo.fora.nome}</div>
                    </div>
                  </div>
                  {h2h.nota && <div className="ana-h2h-nota">📊 {h2h.nota}</div>}
                  {h2h.confrontos?.map((c,i)=>(
                    <div key={i} className="ana-h2h-row">
                      <span style={{ color:'var(--text3)',fontSize:11,minWidth:60 }}>{c.data}</span>
                      <span style={{ color:'var(--text3)',fontSize:11,flex:1 }}>{c.competicao}</span>
                      <span style={{ fontFamily:'var(--font-mono)',fontWeight:700,color:'var(--text)',fontSize:13 }}>{c.placar}</span>
                      <span style={{ fontSize:11,fontWeight:600,color:'var(--text2)',minWidth:70,textAlign:'right' }}>{c.vencedor}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Contexto Copa */}
            <div className="ana-divider">Contexto da Copa 2026</div>
            <div className="ana-ctx-grid" style={{ gridTemplateColumns: isMob ? '1fr' : 'repeat(3,1fr)' }}>
              {[{v:'2.99',l:'Gols por jogo',s:'Maior desde 1958',c:'#00e5a0'},{v:'61%',l:'Jogos +2.5 gols',s:'Fase de grupos',c:'#ffb830'},{v:'78%',l:'Decididos em 90min',s:'Fase de grupos',c:'#4d9fff'}].map(({v,l,s,c})=>(
                <div key={l} className="ana-ctx-card">
                  <div className="ana-ctx-val" style={{ color:c }}>{v}</div>
                  <div className="ana-ctx-lbl">{l}</div>
                  <div className="ana-ctx-sub">{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MERCADOS ── */}
        {aba==='mercados' && (
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
        {aba==='placares' && (
          <div>
            {(!o.placares||!o.placares.length) ? (
              <div className="ana-empty">
                <div style={{ color:'var(--text3)',fontSize:14 }}>Odds de placar não disponíveis.</div>
              </div>
            ) : (
              <div className="ana-placares-grid" style={{ gridTemplateColumns: isMob ? '1fr' : 'repeat(3,1fr)' }}>
                {['casa','empate','fora'].map(time=>{
                  const cor = time==='casa'?'#00e5a0':time==='fora'?'#4d9fff':'var(--text3)';
                  const nome = time==='casa'?jogo.casa.nome:time==='fora'?jogo.fora.nome:'Empate';
                  const pl = (o.placares||[]).filter(p=>p.time===time).sort((a,b)=>a.odd-b.odd);
                  return (
                    <div key={time}>
                      <div className="ana-placar-titulo" style={{ color:cor }}>{nome}</div>
                      {pl.map((p,i)=>(
                        <div key={i} className="ana-placar-row">
                          <span className="ana-placar-nome">{p.placar}</span>
                          <span className="ana-placar-val">{fmt(p.odd)}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
