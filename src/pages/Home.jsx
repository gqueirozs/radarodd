import React, { useState } from 'react';
import { getLogo, getStats } from '../data/statsDB';
import { useIsMobile } from '../hooks/useIsMobile';

const S = `
.home-wrap { max-width: 860px; margin: 0 auto; padding: 28px 16px 48px; }
.home-hero { margin-bottom: 24px; }
.home-badges { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.home-badge { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; }
.home-badge-g { color: #00e5a0; background: rgba(0,229,160,.1); border: 1px solid rgba(0,229,160,.2); }
.home-badge-d { color: var(--text3); background: var(--bg3); border: 1px solid var(--border); }
.home-title { font-family: var(--font-display); font-weight: 800; color: var(--text); line-height: 1.15; letter-spacing: -.5px; margin-bottom: 10px; }
.home-sub { color: var(--text3); font-size: 13px; line-height: 1.6; max-width: 480px; }
.home-filters { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.home-filter { padding: 7px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid var(--border); cursor: pointer; transition: all .15s; background: var(--bg2); color: var(--text2); }
.home-filter.on { background: #00e5a0; color: #000; border-color: transparent; }
.home-cards { display: flex; flex-direction: column; gap: 10px; }
.home-card { background: var(--bg2); border-radius: 16px; cursor: pointer; transition: background .2s, transform .2s, box-shadow .2s; overflow: hidden; border: 1px solid var(--border); }
.home-card.vb { border-color: rgba(0,229,160,.15); }
.home-card:hover { background: var(--bg3); transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,0,0,.3); }
.home-accent { height: 2px; background: linear-gradient(90deg,#00e5a0,transparent); }
.home-body { padding: 14px 16px; }
.home-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px; }
.home-time { font-size: 11px; color: var(--text3); font-weight: 500; }
.home-footer-card { padding: 10px 16px 13px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.home-chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; border-radius: 20px; background: rgba(0,229,160,.08); border: 1px solid rgba(0,229,160,.2); font-size: 11px; font-weight: 600; color: #00e5a0; }
.home-ev { font-size: 10px; color: rgba(0,229,160,.7); font-family: var(--font-mono); flex-shrink: 0; }
.home-see { font-size: 12px; color: #00e5a0; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
.home-nobet { font-size: 12px; color: var(--text3); }
.score-ring { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; }
.score-ring-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
.home-info-bar { margin-top: 28px; padding: 13px 16px; background: var(--bg2); border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: flex-start; gap: 10px; font-size: 12px; color: var(--text3); line-height: 1.6; }
`;

function Flag({ nome, size }) {
  const logo = getLogo(nome);
  const st = { width: size, height: size, borderRadius: 7, objectFit: 'cover', border: '2px solid rgba(255,255,255,.1)', flexShrink: 0 };
  if (!logo) return (
    <div style={{ ...st, background: 'var(--bg4)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text3)', fontSize: size * .4 }}>
      {nome?.charAt(0) || '?'}
    </div>
  );
  return <img src={logo} alt={nome} style={st} onError={e => { e.target.style.display = 'none'; }} />;
}

function Ring({ score }) {
  if (!score) return null;
  const cor = score >= 70 ? '#00e5a0' : score >= 45 ? '#ffb830' : '#6b7280';
  const lbl = score >= 70 ? 'Alta' : score >= 45 ? 'Média' : 'Baixa';
  const r = 14, c = 2 * Math.PI * r, d = (score / 100) * c;
  return (
    <div className="score-ring">
      <svg width={36} height={36} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={18} cy={18} r={r} fill="none" stroke="var(--bg4)" strokeWidth={3} />
        <circle cx={18} cy={18} r={r} fill="none" stroke={cor} strokeWidth={3}
          strokeDasharray={`${d} ${c}`} strokeLinecap="round" />
        <text x={18} y={18} textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 9, fill: cor, fontWeight: 700, fontFamily: 'monospace' }}
          transform="rotate(90,18,18)">{score}</text>
      </svg>
      <span className="score-ring-lbl" style={{ color: cor }}>{lbl}</span>
    </div>
  );
}

function ProbBar({ oddC, oddF, oddE }) {
  if (!oddC || !oddF) return null;
  const rc = 1/oddC, re = oddE ? 1/oddE : 0, rf = 1/oddF, t = rc + re + rf;
  const pc = Math.round(rc/t*100), pe = Math.round(re/t*100), pf = Math.round(rf/t*100);
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', height: 4 }}>
        <div style={{ width: pc+'%', background: '#00e5a0' }} />
        <div style={{ width: pe+'%', background: 'var(--bg4)', margin: '0 1px' }} />
        <div style={{ width: pf+'%', background: '#4d9fff' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 10, color: '#00e5a0', fontWeight: 600 }}>{pc}%</span>
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>Emp {pe}%</span>
        <span style={{ fontSize: 10, color: '#4d9fff', fontWeight: 600 }}>{pf}%</span>
      </div>
    </div>
  );
}

function calcSc(j) {
  const v = (j.valueBets||[]).filter(x=>x.ev>0);
  return v.length ? Math.min(99, Math.round(40 + Math.max(...v.map(x=>x.ev||0))*2.5 + v.length*5)) : 0;
}
function best(j) {
  const v = (j.valueBets||[]).filter(x=>x.ev>0);
  return v.length ? v.reduce((a,b)=>a.ev>b.ev?a:b) : null;
}

/* ── CARD DESKTOP ── */
function CardDesktop({ jogo, onClick }) {
  const sc = calcSc(jogo), mb = best(jogo), ns = (jogo.valueBets||[]).filter(v=>v.ev>0).length;
  const o = jogo.odds||{}, stC = getStats(jogo.casa.nome), stF = getStats(jogo.fora.nome);
  return (
    <div className={`home-card${sc>0?' vb':''}`} onClick={onClick}>
      {sc > 0 && <div className="home-accent"/>}
      <div className="home-body">
        <div className="home-meta">
          <span className="home-time">{jogo.data} · {jogo.hora}{jogo.estadio ? ` · ${jogo.estadio}` : ''}</span>
          <Ring score={sc||null}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          {/* Casa */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Flag nome={jogo.casa.nome} size={44}/>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{jogo.casa.nome}</div>
              {stC && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{stC.gols_marcados}G · #{stC.ranking_fifa}</div>}
            </div>
          </div>
          {/* Odds */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {o.resultado?.casa && [
              { v: o.resultado.casa,   l:'1', c:'#00e5a0' },
              { v: o.resultado.empate, l:'X', c:'var(--text2)' },
              { v: o.resultado.fora,   l:'2', c:'#4d9fff' },
            ].filter(x=>x.v).map(({v,l,c})=>(
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: c }}>{parseFloat(v).toFixed(2)}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</div>
              </div>
            ))}
          </div>
          {/* Fora */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{jogo.fora.nome}</div>
              {stF && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{stF.gols_marcados}G · #{stF.ranking_fifa}</div>}
            </div>
            <Flag nome={jogo.fora.nome} size={44}/>
          </div>
        </div>
        <ProbBar oddC={o.resultado?.casa} oddF={o.resultado?.fora} oddE={o.resultado?.empate}/>
      </div>
      <div className="home-footer-card">
        <div style={{ flex: 1, minWidth: 0 }}>
          {mb ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span className="home-chip">★ {mb.mercado}</span>
              <span className="home-ev">+{mb.ev?.toFixed(1)}% EV</span>
              {ns > 1 && <span style={{ fontSize: 11, color: 'var(--text3)' }}>+{ns-1}</span>}
            </div>
          ) : <span className="home-nobet">Sem valor detectado</span>}
        </div>
        <span className="home-see">Ver análise →</span>
      </div>
    </div>
  );
}

/* ── CARD MOBILE ── */
function CardMobile({ jogo, onClick }) {
  const sc = calcSc(jogo), mb = best(jogo), ns = (jogo.valueBets||[]).filter(v=>v.ev>0).length;
  const o = jogo.odds||{};
  return (
    <div className={`home-card${sc>0?' vb':''}`} onClick={onClick}>
      {sc > 0 && <div className="home-accent"/>}
      <div style={{ padding: '12px 14px' }}>
        {/* Meta + score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{jogo.data} · {jogo.hora}</span>
          <Ring score={sc||null}/>
        </div>
        {/* Times lado a lado */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <Flag nome={jogo.casa.nome} size={34}/>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{jogo.casa.nome}</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 700, letterSpacing: '.1em', padding: '0 8px', flexShrink: 0 }}>VS</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text)', textAlign: 'right' }}>{jogo.fora.nome}</span>
            <Flag nome={jogo.fora.nome} size={34}/>
          </div>
        </div>
        {/* Odds em linha */}
        {o.resultado?.casa && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, padding: '8px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 10 }}>
            {[
              { v: o.resultado.casa,   l:'1', c:'#00e5a0' },
              { v: o.resultado.empate, l:'X', c:'var(--text2)' },
              { v: o.resultado.fora,   l:'2', c:'#4d9fff' },
            ].filter(x=>x.v).map(({v,l,c})=>(
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color: c }}>{parseFloat(v).toFixed(2)}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</div>
              </div>
            ))}
          </div>
        )}
        <ProbBar oddC={o.resultado?.casa} oddF={o.resultado?.fora} oddE={o.resultado?.empate}/>
      </div>
      {/* Footer */}
      <div style={{ padding: '8px 14px 12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {mb ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span className="home-chip" style={{ fontSize: 10, maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>★ {mb.mercado}</span>
              <span className="home-ev">+{mb.ev?.toFixed(1)}%</span>
            </div>
          ) : <span className="home-nobet">Sem valor</span>}
        </div>
        <span className="home-see" style={{ fontSize: 11 }}>Ver →</span>
      </div>
    </div>
  );
}

export default function Home({ onSelectJogo, jogos: jogosProp }) {
  const [filtro, setFiltro] = useState('todos');
  const isMob = useIsMobile(640);
  const hoje = new Date().toLocaleDateString('pt-BR');
  const amnh = new Date(Date.now()+86400000).toLocaleDateString('pt-BR');

  const JOGOS = (jogosProp||[])
    .filter(j => filtro==='hoje' ? j.data===hoje : filtro==='amanhã' ? j.data===amnh : true)
    .sort((a,b) => calcSc(b)-calcSc(a));

  return (
    <>
      <style>{S}</style>
      <div className="home-wrap" style={{ padding: isMob ? '20px 12px 48px' : '28px 16px 48px' }}>
        <div className="home-hero">
          <div className="home-badges">
            <span className="home-badge home-badge-g">Copa do Mundo 2026</span>
            <span className="home-badge home-badge-d">{JOGOS.length} jogos</span>
          </div>
          <h1 className="home-title" style={{ fontSize: isMob ? 26 : 32 }}>
            Análise inteligente<br/>
            <span style={{ color: '#00e5a0' }}>de apostas</span>
          </h1>
          <p className="home-sub">
            Cada jogo é analisado com estatísticas reais e as melhores oportunidades são rankeadas por EV.
          </p>
        </div>
        <div className="home-filters">
          {[['todos','Todos'],['hoje','Hoje'],['amanhã','Amanhã']].map(([v,l])=>(
            <button key={v} className={`home-filter${filtro===v?' on':''}`} onClick={()=>setFiltro(v)}>{l}</button>
          ))}
        </div>
        <div className="home-cards">
          {JOGOS.length===0 && <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text3)', fontSize:14 }}>Nenhum jogo encontrado.</div>}
          {JOGOS.map(j => isMob
            ? <CardMobile key={j.id} jogo={j} onClick={()=>onSelectJogo(j)}/>
            : <CardDesktop key={j.id} jogo={j} onClick={()=>onSelectJogo(j)}/>
          )}
        </div>
        <div className="home-info-bar">
          <span style={{ fontSize:18, flexShrink:0 }}>⏱</span>
          <span>Dados atualizados a cada 5 min. Sugestões baseadas em modelo de valor esperado (EV).</span>
        </div>
      </div>
    </>
  );
}
