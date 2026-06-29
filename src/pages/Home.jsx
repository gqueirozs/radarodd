import React, { useState } from 'react';
import { getLogo, getStats } from '../data/statsDB';

function calcScore(jogo) {
  const vbs = (jogo.valueBets || []).filter(v => v.ev > 0);
  if (!vbs.length) return 0;
  const maxEv = Math.max(...vbs.map(v => v.ev || 0));
  return Math.min(99, Math.round(40 + maxEv * 2.5 + vbs.length * 5));
}

function melhorSugestao(jogo) {
  const vbs = (jogo.valueBets || []).filter(v => v.ev > 0);
  if (!vbs.length) return null;
  return vbs.reduce((a, b) => (a.ev > b.ev ? a : b));
}

function FlagImg({ nome, size = 44 }) {
  const logo = getLogo(nome);
  if (!logo) return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: 'var(--bg4)', border: '2px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700, color: 'var(--text3)',
      flexShrink: 0,
    }}>{nome?.charAt(0) || '?'}</div>
  );
  return (
    <img src={logo} alt={nome} style={{
      width: size, height: size, borderRadius: 8,
      objectFit: 'cover', border: '2px solid rgba(255,255,255,.1)',
      flexShrink: 0,
    }} onError={e => { e.target.style.display = 'none'; }} />
  );
}

function ScoreRing({ score }) {
  if (!score) return null;
  const cor = score >= 70 ? '#00e5a0' : score >= 45 ? '#ffb830' : '#6b7280';
  const label = score >= 70 ? 'Alta' : score >= 45 ? 'Média' : 'Baixa';
  const r = 16, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
      <svg width={42} height={42} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={21} cy={21} r={r} fill="none" stroke="var(--bg4)" strokeWidth={3} />
        <circle cx={21} cy={21} r={r} fill="none" stroke={cor} strokeWidth={3}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray .6s ease' }} />
        <text x={21} y={21} textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 10, fill: cor, fontWeight: 700, fontFamily: 'monospace' }}
          transform={`rotate(90, 21, 21)`}>{score}</text>
      </svg>
      <span style={{ fontSize: 9, color: cor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
    </div>
  );
}

function ProbBar({ casaNome, foraNome, oddCasa, oddFora, oddEmp }) {
  if (!oddCasa || !oddFora) return null;
  const rc = 1 / oddCasa, re = oddEmp ? 1 / oddEmp : 0, rf = 1 / oddFora;
  const tot = rc + re + rf;
  const pc = Math.round(rc / tot * 100);
  const pe = Math.round(re / tot * 100);
  const pf = Math.round(rf / tot * 100);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', height: 4 }}>
        <div style={{ width: pc + '%', background: '#00e5a0' }} />
        <div style={{ width: pe + '%', background: '#3d4451', margin: '0 1px' }} />
        <div style={{ width: pf + '%', background: '#4d9fff' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 10, color: '#00e5a0', fontWeight: 600 }}>{pc}%</span>
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>Empate {pe}%</span>
        <span style={{ fontSize: 10, color: '#4d9fff', fontWeight: 600 }}>{pf}%</span>
      </div>
    </div>
  );
}

export default function Home({ onSelectJogo, jogos: jogosProp }) {
  const [filtro, setFiltro] = useState('todos');
  const hoje = new Date().toLocaleDateString('pt-BR');
  const amanhã = new Date(Date.now() + 86400000).toLocaleDateString('pt-BR');

  const JOGOS = (jogosProp || []).filter(j => {
    if (filtro === 'hoje') return j.data === hoje;
    if (filtro === 'amanhã') return j.data === amanhã;
    return true;
  }).sort((a, b) => (calcScore(b) - calcScore(a)));

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '36px 20px' }}>

      {/* Hero header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
            textTransform: 'uppercase', color: 'var(--accent)',
            background: 'rgba(0,229,160,.1)', border: '1px solid rgba(0,229,160,.2)',
            padding: '3px 10px', borderRadius: 20,
          }}>Copa do Mundo 2026</span>
          <span style={{
            fontSize: 11, fontWeight: 600, color: 'var(--text3)',
            background: 'var(--bg3)', padding: '3px 10px', borderRadius: 20,
          }}>{JOGOS.length} jogos disponíveis</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800,
          color: 'var(--text)', lineHeight: 1.15, marginBottom: 12,
          letterSpacing: '-0.5px',
        }}>
          Análise inteligente<br />
          <span style={{ color: 'var(--accent)' }}>de apostas</span>
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 14, lineHeight: 1.7, maxWidth: 480 }}>
          Cada jogo é analisado automaticamente com base em estatísticas reais da Copa.
          As melhores oportunidades são rankeadas por valor esperado (EV).
        </p>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {[['todos', 'Todos os jogos'], ['hoje', 'Hoje'], ['amanhã', 'Amanhã']].map(([v, l]) => (
          <button key={v} onClick={() => setFiltro(v)} style={{
            padding: '7px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            border: `1px solid ${filtro === v ? 'transparent' : 'var(--border)'}`,
            cursor: 'pointer', transition: 'all .15s',
            background: filtro === v ? 'var(--accent)' : 'var(--bg2)',
            color: filtro === v ? '#000' : 'var(--text2)',
          }}>{l}</button>
        ))}
      </div>

      {/* Cards de jogos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {JOGOS.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)', fontSize: 14 }}>
            Nenhum jogo encontrado.
          </div>
        )}
        {JOGOS.map((jogo, idx) => {
          const score = calcScore(jogo);
          const melhor = melhorSugestao(jogo);
          const nSug = (jogo.valueBets || []).filter(v => v.ev > 0).length;
          const statsCasa = getStats(jogo.casa.nome);
          const statsFora = getStats(jogo.fora.nome);
          const o = jogo.odds || {};

          return (
            <div
              key={jogo.id}
              onClick={() => onSelectJogo(jogo)}
              style={{
                background: 'var(--bg2)',
                border: score > 0
                  ? '1px solid rgba(0,229,160,.18)'
                  : '1px solid var(--border)',
                borderRadius: 18, cursor: 'pointer',
                transition: 'all .2s', overflow: 'hidden',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg2)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Linha de destaque topo */}
              {score > 0 && (
                <div style={{
                  height: 2,
                  background: `linear-gradient(90deg, var(--accent) 0%, transparent 100%)`,
                }} />
              )}

              <div style={{ padding: '20px 24px' }}>
                {/* Linha 1: meta info + score */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 18,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>
                      {jogo.data}
                    </span>
                    <span style={{ color: 'var(--border)', fontSize: 12 }}>·</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>
                      {jogo.hora}
                    </span>
                    {jogo.estadio && (
                      <>
                        <span style={{ color: 'var(--border)', fontSize: 12 }}>·</span>
                        <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                          {jogo.estadio}
                        </span>
                      </>
                    )}
                  </div>
                  <ScoreRing score={score || null} />
                </div>

                {/* Linha 2: times com logos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  {/* Time da casa */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <FlagImg nome={jogo.casa.nome} size={48} />
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: 20,
                        fontWeight: 800, color: 'var(--text)', lineHeight: 1.1,
                      }}>{jogo.casa.nome}</div>
                      {statsCasa && (
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>
                          {statsCasa.gols_marcados}G marcados · #{statsCasa.ranking_fifa} FIFA
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Centro: odds e placar */}
                  <div style={{ textAlign: 'center', padding: '0 20px', flexShrink: 0 }}>
                    {o.resultado?.casa ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color: '#00e5a0' }}>
                            {parseFloat(o.resultado.casa).toFixed(2)}
                          </div>
                          <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>CASA</div>
                        </div>
                        {o.resultado.empate && (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color: 'var(--text2)' }}>
                              {parseFloat(o.resultado.empate).toFixed(2)}
                            </div>
                            <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>EMP</div>
                          </div>
                        )}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color: '#4d9fff' }}>
                            {parseFloat(o.resultado.fora).toFixed(2)}
                          </div>
                          <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>FORA</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 700, letterSpacing: '.15em' }}>VS</div>
                    )}
                  </div>

                  {/* Time de fora */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'flex-end' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: 20,
                        fontWeight: 800, color: 'var(--text)', lineHeight: 1.1,
                      }}>{jogo.fora.nome}</div>
                      {statsFora && (
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>
                          {statsFora.gols_marcados}G marcados · #{statsFora.ranking_fifa} FIFA
                        </div>
                      )}
                    </div>
                    <FlagImg nome={jogo.fora.nome} size={48} />
                  </div>
                </div>

                {/* Barra de probabilidade */}
                {o.resultado?.casa && (
                  <ProbBar
                    casaNome={jogo.casa.nome} foraNome={jogo.fora.nome}
                    oddCasa={o.resultado.casa} oddFora={o.resultado.fora}
                    oddEmp={o.resultado.empate}
                  />
                )}

                {/* Linha 3: sugestão + link */}
                <div style={{
                  marginTop: 16, paddingTop: 14,
                  borderTop: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ flex: 1 }}>
                    {melhor ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '4px 12px', borderRadius: 20,
                          background: 'rgba(0,229,160,.08)',
                          border: '1px solid rgba(0,229,160,.2)',
                        }}>
                          <span style={{ color: 'var(--accent)', fontSize: 11 }}>★</span>
                          <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>
                            {melhor.mercado}
                          </span>
                          <span style={{ fontSize: 11, color: 'rgba(0,229,160,.6)', fontFamily: 'var(--font-mono)' }}>
                            +{melhor.ev?.toFixed(1)}% EV
                          </span>
                        </div>
                        {nSug > 1 && (
                          <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                            +{nSug - 1} sugestão{nSug > 2 ? 'ões' : ''}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                        Sem valor estatístico detectado
                      </span>
                    )}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 13, color: 'var(--accent)', fontWeight: 700,
                    whiteSpace: 'nowrap', marginLeft: 16,
                  }}>
                    Ver análise
                    <span style={{ fontSize: 16 }}>→</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé info */}
      <div style={{
        marginTop: 40, padding: '16px 20px',
        background: 'var(--bg2)', borderRadius: 12,
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 12, color: 'var(--text3)',
      }}>
        <span style={{ fontSize: 18 }}>⏱</span>
        <span>Dados atualizados a cada 5 minutos via scraper automático. As sugestões são baseadas em modelo estatístico de valor esperado.</span>
      </div>
    </div>
  );
}
