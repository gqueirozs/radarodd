import React, { useState } from 'react';
import { getLogo, getStats } from '../data/statsDB';

const STYLES = `
.home-wrap { max-width: 860px; margin: 0 auto; padding: 28px 16px 48px; }
.home-hero { margin-bottom: 28px; }
.home-badges { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.home-badge {
  font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  padding: 3px 10px; border-radius: 20px;
}
.home-badge-green { color: #00e5a0; background: rgba(0,229,160,.1); border: 1px solid rgba(0,229,160,.2); }
.home-badge-grey  { color: var(--text3); background: var(--bg3); border: 1px solid var(--border); }
.home-title { font-family: var(--font-display); font-weight: 800; color: var(--text); line-height: 1.15; letter-spacing: -.5px; margin-bottom: 10px; }
.home-subtitle { color: var(--text3); font-size: 13px; line-height: 1.6; max-width: 480px; }
.home-filters { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.home-filter {
  padding: 7px 16px; border-radius: 10px; font-size: 13px; font-weight: 600;
  border: 1px solid var(--border); cursor: pointer; transition: all .15s;
  background: var(--bg2); color: var(--text2);
}
.home-filter.active { background: #00e5a0; color: #000; border-color: transparent; }
.home-cards { display: flex; flex-direction: column; gap: 10px; }
.home-card {
  background: var(--bg2); border-radius: 16px; cursor: pointer;
  transition: background .2s, transform .2s, box-shadow .2s;
  overflow: hidden; border: 1px solid var(--border);
}
.home-card.has-bets { border-color: rgba(0,229,160,.15); }
.home-card:hover { background: var(--bg3); transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,0,0,.3); }
.home-card-accent { height: 2px; background: linear-gradient(90deg, #00e5a0, transparent); }
.home-card-body { padding: 16px 18px; }
.home-card-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 8px; }
.home-card-time { font-size: 11px; color: var(--text3); font-weight: 500; }
.home-card-teams { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.home-team { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.home-team-right { flex-direction: row-reverse; text-align: right; }
.home-team-flag { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 2px solid rgba(255,255,255,.1); flex-shrink: 0; }
.home-team-flag-placeholder {
  width: 40px; height: 40px; border-radius: 8px; border: 2px solid var(--border);
  background: var(--bg4); display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: var(--text3); font-size: 14px; flex-shrink: 0;
}
.home-team-name { font-family: var(--font-display); font-weight: 800; color: var(--text); line-height: 1.1; overflow: hidden; }
.home-team-sub  { font-size: 10px; color: var(--text3); margin-top: 2px; white-space: nowrap; }
.home-odds { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; padding: 0 8px; }
.home-odds-row { display: flex; gap: 6px; }
.home-odd-cell { text-align: center; }
.home-odd-val  { font-family: var(--font-mono); font-weight: 700; line-height: 1; }
.home-odd-lbl  { font-size: 9px; color: var(--text3); margin-top: 2px; text-transform: uppercase; letter-spacing: .05em; }
.home-probbar  { margin-top: 10px; }
.home-probbar-track { display: flex; border-radius: 4px; overflow: hidden; height: 4px; }
.home-probbar-pcts  { display: flex; justify-content: space-between; margin-top: 4px; }
.home-probbar-pct   { font-size: 10px; font-weight: 600; }
.home-card-footer {
  padding: 10px 18px 14px;
  border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center; gap: 8px;
}
.home-bet-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 11px; border-radius: 20px;
  background: rgba(0,229,160,.08); border: 1px solid rgba(0,229,160,.2);
  font-size: 11px; font-weight: 600; color: #00e5a0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;
}
.home-bet-ev { font-size: 10px; color: rgba(0,229,160,.7); font-family: var(--font-mono); flex-shrink: 0; }
.home-see-more { font-size: 12px; color: #00e5a0; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
.home-no-bet { font-size: 12px; color: var(--text3); }
.home-footer { margin-top: 32px; padding: 14px 16px; background: var(--bg2); border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: flex-start; gap: 10px; font-size: 12px; color: var(--text3); line-height: 1.6; }
.score-ring { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; }
.score-ring-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }

@media (max-width: 600px) {
  .home-wrap { padding: 20px 12px 48px; }
  .home-title { font-size: 26px !important; }
  .home-card-body { padding: 14px 14px; }
  .home-team-name { font-size: 15px !important; }
  .home-odd-val { font-size: 14px !important; }
  .home-card-footer { padding: 10px 14px 12px; }
  .home-bet-chip { max-width: 160px; font-size: 10px; }
  .home-team-flag, .home-team-flag-placeholder { width: 34px; height: 34px; }
}
@media (max-width: 400px) {
  .home-odd-val { font-size: 12px !important; }
  .home-odds { padding: 0 4px; }
  .home-team-sub { display: none; }
}
`;

function FlagImg({ nome, size = 40 }) {
  const logo = getLogo(nome);
  const st = { width: size, height: size, borderRadius: 8, objectFit: 'cover', border: '2px solid rgba(255,255,255,.1)', flexShrink: 0 };
  if (!logo) return <div className="home-team-flag-placeholder" style={{ width: size, height: size }}>{nome?.charAt(0) || '?'}</div>;
  return <img src={logo} alt={nome} style={st} onError={e => { e.target.style.display='none'; }} />;
}

function ScoreRing({ score }) {
  if (!score) return null;
  const cor = score >= 70 ? '#00e5a0' : score >= 45 ? '#ffb830' : '#6b7280';
  const label = score >= 70 ? 'Alta' : score >= 45 ? 'Média' : 'Baixa';
  const r = 15, c = 2 * Math.PI * r, dash = (score / 100) * c;
  return (
    <div className="score-ring">
      <svg width={38} height={38} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={19} cy={19} r={r} fill="none" stroke="var(--bg4)" strokeWidth={3}/>
        <circle cx={19} cy={19} r={r} fill="none" stroke={cor} strokeWidth={3}
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"/>
        <text x={19} y={19} textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 9, fill: cor, fontWeight: 700, fontFamily: 'monospace' }}
          transform={`rotate(90,19,19)`}>{score}</text>
      </svg>
      <span className="score-ring-label" style={{ color: cor }}>{label}</span>
    </div>
  );
}

function ProbBar({ oddCasa, oddFora, oddEmp, nomeCasa, nomeFora }) {
  if (!oddCasa || !oddFora) return null;
  const rc = 1/oddCasa, re = oddEmp ? 1/oddEmp : 0, rf = 1/oddFora;
  const tot = rc + re + rf;
  const pc = Math.round(rc/tot*100), pe = Math.round(re/tot*100), pf = Math.round(rf/tot*100);
  return (
    <div className="home-probbar">
      <div className="home-probbar-track">
        <div style={{ width: pc+'%', background: '#00e5a0' }}/>
        <div style={{ width: pe+'%', background: 'var(--bg4)', margin: '0 1px' }}/>
        <div style={{ width: pf+'%', background: '#4d9fff' }}/>
      </div>
      <div className="home-probbar-pcts">
        <span className="home-probbar-pct" style={{ color: '#00e5a0' }}>{pc}%</span>
        <span className="home-probbar-pct" style={{ color: 'var(--text3)', fontWeight: 400 }}>Emp {pe}%</span>
        <span className="home-probbar-pct" style={{ color: '#4d9fff' }}>{pf}%</span>
      </div>
    </div>
  );
}

function calcScore(j) {
  const vbs = (j.valueBets||[]).filter(v=>v.ev>0);
  if (!vbs.length) return 0;
  return Math.min(99, Math.round(40 + Math.max(...vbs.map(v=>v.ev||0))*2.5 + vbs.length*5));
}
function melhor(j) {
  const vbs = (j.valueBets||[]).filter(v=>v.ev>0);
  return vbs.length ? vbs.reduce((a,b)=>a.ev>b.ev?a:b) : null;
}
function nSug(j) { return (j.valueBets||[]).filter(v=>v.ev>0).length; }

export default function Home({ onSelectJogo, jogos: jogosProp }) {
  const [filtro, setFiltro] = useState('todos');
  const hoje  = new Date().toLocaleDateString('pt-BR');
  const amnh  = new Date(Date.now()+86400000).toLocaleDateString('pt-BR');

  const JOGOS = (jogosProp||[])
    .filter(j => filtro==='hoje' ? j.data===hoje : filtro==='amanhã' ? j.data===amnh : true)
    .sort((a,b) => calcScore(b)-calcScore(a));

  return (
    <>
      <style>{STYLES}</style>
      <div className="home-wrap">

        {/* Hero */}
        <div className="home-hero">
          <div className="home-badges">
            <span className="home-badge home-badge-green">Copa do Mundo 2026</span>
            <span className="home-badge home-badge-grey">{JOGOS.length} jogos</span>
          </div>
          <h1 className="home-title" style={{ fontSize: 32 }}>
            Análise inteligente<br/>
            <span style={{ color: '#00e5a0' }}>de apostas</span>
          </h1>
          <p className="home-subtitle">
            Cada jogo é analisado com estatísticas reais e as melhores oportunidades são
            rankeadas por valor esperado (EV).
          </p>
        </div>

        {/* Filtros */}
        <div className="home-filters">
          {[['todos','Todos'],['hoje','Hoje'],['amanhã','Amanhã']].map(([v,l])=>(
            <button key={v} className={`home-filter${filtro===v?' active':''}`}
              onClick={()=>setFiltro(v)}>{l}</button>
          ))}
        </div>

        {/* Cards */}
        <div className="home-cards">
          {JOGOS.length === 0 && (
            <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text3)', fontSize:14 }}>
              Nenhum jogo encontrado.
            </div>
          )}
          {JOGOS.map(jogo => {
            const sc = calcScore(jogo);
            const mb = melhor(jogo);
            const ns = nSug(jogo);
            const o  = jogo.odds||{};
            const stC = getStats(jogo.casa.nome);
            const stF = getStats(jogo.fora.nome);
            return (
              <div key={jogo.id} className={`home-card${sc>0?' has-bets':''}`}
                onClick={()=>onSelectJogo(jogo)}>
                {sc > 0 && <div className="home-card-accent"/>}
                <div className="home-card-body">
                  {/* Meta */}
                  <div className="home-card-meta">
                    <span className="home-card-time">
                      {jogo.data} · {jogo.hora}
                      {jogo.estadio ? ` · ${jogo.estadio}` : ''}
                    </span>
                    <ScoreRing score={sc||null}/>
                  </div>

                  {/* Times */}
                  <div className="home-card-teams">
                    {/* Casa */}
                    <div className="home-team">
                      <FlagImg nome={jogo.casa.nome}/>
                      <div style={{ minWidth:0 }}>
                        <div className="home-team-name" style={{ fontSize:17 }}>{jogo.casa.nome}</div>
                        {stC && <div className="home-team-sub">{stC.gols_marcados}G · #{stC.ranking_fifa}</div>}
                      </div>
                    </div>

                    {/* Odds centro */}
                    <div className="home-odds">
                      {o.resultado?.casa ? (
                        <div className="home-odds-row">
                          {[
                            { val: o.resultado.casa,   lbl:'1', cor:'#00e5a0' },
                            { val: o.resultado.empate, lbl:'X', cor:'var(--text2)' },
                            { val: o.resultado.fora,   lbl:'2', cor:'#4d9fff' },
                          ].filter(x=>x.val).map(({val,lbl,cor})=>(
                            <div key={lbl} className="home-odd-cell">
                              <div className="home-odd-val" style={{ fontSize:15, color:cor }}>
                                {parseFloat(val).toFixed(2)}
                              </div>
                              <div className="home-odd-lbl">{lbl}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize:11, color:'var(--text3)', fontWeight:700, letterSpacing:'.1em' }}>VS</span>
                      )}
                    </div>

                    {/* Fora */}
                    <div className="home-team home-team-right">
                      <div style={{ minWidth:0 }}>
                        <div className="home-team-name" style={{ fontSize:17 }}>{jogo.fora.nome}</div>
                        {stF && <div className="home-team-sub" style={{ textAlign:'right' }}>{stF.gols_marcados}G · #{stF.ranking_fifa}</div>}
                      </div>
                      <FlagImg nome={jogo.fora.nome}/>
                    </div>
                  </div>

                  {/* Barra prob */}
                  <ProbBar oddCasa={o.resultado?.casa} oddFora={o.resultado?.fora}
                    oddEmp={o.resultado?.empate}/>
                </div>

                {/* Footer */}
                <div className="home-card-footer">
                  <div style={{ flex:1, minWidth:0 }}>
                    {mb ? (
                      <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                        <span className="home-bet-chip">
                          ★ {mb.mercado}
                        </span>
                        <span className="home-bet-ev">+{mb.ev?.toFixed(1)}% EV</span>
                        {ns > 1 && <span style={{ fontSize:11, color:'var(--text3)' }}>+{ns-1}</span>}
                      </div>
                    ) : (
                      <span className="home-no-bet">Sem valor detectado</span>
                    )}
                  </div>
                  <span className="home-see-more">Ver análise →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="home-footer">
          <span style={{ fontSize:18, flexShrink:0 }}>⏱</span>
          <span>Dados atualizados a cada 5 min. Sugestões baseadas em modelo estatístico de valor esperado (EV).</span>
        </div>
      </div>
    </>
  );
}

