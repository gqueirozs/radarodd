import React, { useState } from 'react';

/* ── helpers ─────────────────────────────────────────────── */
function fmt(v) {
  if (!v && v !== 0) return '—';
  return parseFloat(v).toFixed(2);
}
function pct(v) {
  if (!v) return null;
  return (100 / v).toFixed(1) + '%';
}
function evColor(ev) {
  if (ev > 5) return '#00e5a0';
  if (ev > 0) return '#ffb830';
  return '#9ca3af';
}
function evLabel(ev) {
  if (ev > 10) return 'Oportunidade forte';
  if (ev > 5)  return 'Boa oportunidade';
  if (ev > 0)  return 'Leve vantagem';
  return 'Sem valor estatístico';
}

/* ── Componentes ─────────────────────────────────────────── */
function Secao({ titulo, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: 'var(--text3)',
        textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 14,
        paddingBottom: 8, borderBottom: '1px solid var(--border)',
      }}>{titulo}</div>
      {children}
    </div>
  );
}

function CartaoSugestao({ mercado, odd, ev, evText, principal }) {
  if (!odd || odd <= 1) return null;
  const cor = evColor(ev);
  return (
    <div style={{
      background: ev > 0 ? `rgba(${ev > 5 ? '0,229,160' : '255,184,48'},.06)` : 'var(--bg3)',
      border: `1px solid ${ev > 0 ? (ev > 5 ? 'rgba(0,229,160,.25)' : 'rgba(255,184,48,.25)') : 'var(--border)'}`,
      borderRadius: 12, padding: '14px 16px',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        {ev > 5 && (
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
            color: cor, textTransform: 'uppercase', marginBottom: 6,
          }}>
            {principal ? '★ Melhor aposta' : '★ Sugerido'}
          </div>
        )}
        <div style={{
          fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4,
        }}>{mercado}</div>
        <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
          Prob. implícita: {pct(odd)} · {evLabel(ev)}
          {evText ? ` · ${evText}` : ''}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 22,
          fontWeight: 700, color: 'var(--text)',
        }}>{fmt(odd)}</div>
        {ev !== undefined && (
          <div style={{
            fontSize: 11, fontWeight: 700, color: cor, marginTop: 2,
          }}>
            {ev > 0 ? '+' : ''}{ev?.toFixed(1)}% EV
          </div>
        )}
      </div>
    </div>
  );
}

function LinhaMercado({ label, odd, ev }) {
  if (!odd || odd <= 1) return null;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
          {pct(odd)} de probabilidade implícita
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--text)',
        }}>{fmt(odd)}</div>
        {ev !== undefined && (
          <div style={{ fontSize: 11, color: evColor(ev), fontWeight: 600, marginTop: 2 }}>
            {ev > 0 ? '+' : ''}{ev?.toFixed(1)}% EV
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Página principal ────────────────────────────────────── */
export default function Analisador({ jogo, onVoltar }) {
  const [aba, setAba] = useState('sugestoes');
  if (!jogo) return null;

  const o = jogo.odds || {};
  const vbs = (jogo.valueBets || []).sort((a, b) => (b.ev || 0) - (a.ev || 0));
  const evMap = {};
  for (const v of vbs) evMap[v.mercado] = v.ev;

  const abas = ['sugestoes', 'mercados', 'placares'];
  const abaLabels = { sugestoes: 'Sugestões', mercados: 'Todos os mercados', placares: 'Resultado correto' };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px' }}>

      {/* Voltar */}
      <button onClick={onVoltar} style={{
        background: 'none', border: 'none', color: 'var(--text3)',
        cursor: 'pointer', fontSize: 13, padding: 0, marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>← Voltar para jogos</button>

      {/* Cabeçalho do jogo */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '24px', marginBottom: 28,
      }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>
          {jogo.competicao} · {jogo.data} às {jogo.hora}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text)',
          }}>{jogo.casa.nome}</div>
          <div style={{
            fontSize: 12, color: 'var(--text3)', fontWeight: 700, letterSpacing: '.12em',
            padding: '0 16px', textAlign: 'center',
          }}>
            VS
            <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 400, marginTop: 4 }}>
              {jogo.estadio || ''}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700,
            color: 'var(--text)', textAlign: 'right',
          }}>{jogo.fora.nome}</div>
        </div>

        {/* Probabilidades do resultado — barra visual */}
        {o.resultado?.casa && o.resultado?.fora && (() => {
          const pc = (100 / o.resultado.casa);
          const pe = o.resultado.empate ? (100 / o.resultado.empate) : 0;
          const pf = (100 / o.resultado.fora);
          const total = pc + pe + pf;
          const casa = (pc / total * 100).toFixed(0);
          const empate = (pe / total * 100).toFixed(0);
          const fora = (pf / total * 100).toFixed(0);
          return (
            <div style={{ marginTop: 20 }}>
              <div style={{
                display: 'flex', borderRadius: 8, overflow: 'hidden', height: 8, marginBottom: 10,
              }}>
                <div style={{ width: casa + '%', background: '#00e5a0', opacity: .8 }} />
                <div style={{ width: empate + '%', background: 'var(--border)', margin: '0 2px' }} />
                <div style={{ width: fora + '%', background: '#4d9fff', opacity: .8 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)' }}>
                <span style={{ color: '#00e5a0' }}>{jogo.casa.nome} {casa}%</span>
                <span>Empate {empate}%</span>
                <span style={{ color: '#4d9fff' }}>{jogo.fora.nome} {fora}%</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {abas.map(a => (
          <button key={a} onClick={() => setAba(a)} style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            border: 'none', cursor: 'pointer', transition: 'all .15s',
            background: aba === a ? 'var(--accent)' : 'var(--bg3)',
            color: aba === a ? '#000' : 'var(--text2)',
          }}>{abaLabels[a]}</button>
        ))}
      </div>

      {/* ── ABA SUGESTÕES ── */}
      {aba === 'sugestoes' && (
        <div>
          {vbs.filter(v => v.ev > 0).length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              background: 'var(--bg2)', borderRadius: 16,
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                Nenhuma aposta com valor estatístico
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)', maxWidth: 380, margin: '0 auto', lineHeight: 1.6 }}>
                As odds disponíveis para este jogo não apresentam valor esperado positivo com base no modelo atual.
                Confira os demais mercados na aba ao lado.
              </div>
            </div>
          ) : (
            <div>
              {/* Explicação */}
              <div style={{
                background: 'rgba(0,229,160,.05)', border: '1px solid rgba(0,229,160,.15)',
                borderRadius: 12, padding: '14px 16px', marginBottom: 24, fontSize: 13,
                color: 'var(--text2)', lineHeight: 1.6,
              }}>
                💡 Sugestões ordenadas por <strong style={{ color: 'var(--text)' }}>valor esperado (EV)</strong> —
                quanto maior o EV positivo, maior a vantagem estatística em relação à odd oferecida.
              </div>

              {/* Cards de sugestão */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {vbs.filter(v => v.ev > 0).map((vb, i) => (
                  <CartaoSugestao
                    key={i}
                    mercado={vb.mercado}
                    odd={vb.odd}
                    ev={vb.ev}
                    evText={vb.descricao}
                    principal={i === 0}
                  />
                ))}
              </div>

              {/* Aviso */}
              <div style={{
                marginTop: 24, padding: '14px 16px',
                background: 'var(--bg2)', borderRadius: 12,
                border: '1px solid var(--border)',
                fontSize: 12, color: 'var(--text3)', lineHeight: 1.6,
              }}>
                ⚠️ <strong style={{ color: 'var(--text2)' }}>Este é um analisador estatístico</strong>, não um sistema de apostas garantido.
                EV positivo indica vantagem matemática, não certeza de resultado.
                Aposte com responsabilidade.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ABA MERCADOS ── */}
      {aba === 'mercados' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <Secao titulo="Resultado (90 minutos)">
            <LinhaMercado label={`${jogo.casa.nome} vence`} odd={o.resultado?.casa} ev={evMap[`${jogo.casa.nome} vence`]} />
            <LinhaMercado label="Empate" odd={o.resultado?.empate} ev={evMap['Empate']} />
            <LinhaMercado label={`${jogo.fora.nome} vence`} odd={o.resultado?.fora} ev={evMap[`${jogo.fora.nome} vence`]} />
          </Secao>

          {o.qualificar?.casa && (
            <Secao titulo="Para se classificar (inclui prorrogação e pênaltis)">
              <LinhaMercado label={`${jogo.casa.nome} avança`} odd={o.qualificar?.casa} ev={evMap[`${jogo.casa.nome} avança`]} />
              <LinhaMercado label={`${jogo.fora.nome} avança`} odd={o.qualificar?.fora} ev={evMap[`${jogo.fora.nome} avança`]} />
            </Secao>
          )}

          <Secao titulo="Total de gols">
            <LinhaMercado label={`Mais de ${o.totalGols?.linha || 2.5} gols`} odd={o.totalGols?.mais} ev={evMap[`Mais de ${o.totalGols?.linha || 2.5} gols`]} />
            <LinhaMercado label={`Menos de ${o.totalGols?.linha || 2.5} gols`} odd={o.totalGols?.menos} ev={evMap[`Menos de ${o.totalGols?.linha || 2.5} gols`]} />
          </Secao>

          <Secao titulo="Ambas as equipes marcam">
            <LinhaMercado label="Sim" odd={o.ambasMarcam?.sim} ev={evMap['Ambas marcam — Sim']} />
            <LinhaMercado label="Não" odd={o.ambasMarcam?.nao} ev={evMap['Ambas marcam — Não']} />
          </Secao>

          {o.primeiroGol?.casa && (
            <Secao titulo="Primeiro gol">
              <LinhaMercado label={`${jogo.casa.nome} marca primeiro`} odd={o.primeiroGol?.casa} ev={evMap[`${jogo.casa.nome} marca primeiro`]} />
              <LinhaMercado label="Nenhum gol" odd={o.primeiroGol?.nenhum} />
              <LinhaMercado label={`${jogo.fora.nome} marca primeiro`} odd={o.primeiroGol?.fora} />
            </Secao>
          )}

          {o.chanceDupla?.casaEmpate && (
            <Secao titulo="Chance dupla">
              <LinhaMercado label={`${jogo.casa.nome} ou Empate`} odd={o.chanceDupla?.casaEmpate} />
              <LinhaMercado label={`${jogo.casa.nome} ou ${jogo.fora.nome}`} odd={o.chanceDupla?.casaFora} />
              <LinhaMercado label={`Empate ou ${jogo.fora.nome}`} odd={o.chanceDupla?.empataFora} />
            </Secao>
          )}

          {o.escanteios?.mais && (
            <Secao titulo={`Escanteios (linha ${o.escanteios?.linha || 9.5})`}>
              <LinhaMercado label={`Mais de ${o.escanteios?.linha || 9.5}`} odd={o.escanteios?.mais} />
              <LinhaMercado label={`Menos de ${o.escanteios?.linha || 9.5}`} odd={o.escanteios?.menos} />
            </Secao>
          )}

          {o.handicap?.length > 0 && (
            <Secao titulo={`Handicap asiático — ${jogo.casa.nome}`}>
              {(o.handicap || []).map((h, i) => (
                <LinhaMercado key={i} label={`${jogo.casa.nome} ${h.linha}`} odd={h.odd} />
              ))}
            </Secao>
          )}
        </div>
      )}

      {/* ── ABA PLACARES ── */}
      {aba === 'placares' && (
        <div>
          {(!o.placares || o.placares.length === 0) ? (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)',
            }}>
              <div style={{ color: 'var(--text3)', fontSize: 14 }}>Odds de placar não disponíveis para este jogo.</div>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
              }}>
                {['casa', 'empate', 'fora'].map(time => {
                  const label = time === 'casa' ? jogo.casa.nome : time === 'fora' ? jogo.fora.nome : 'Empate';
                  const cor = time === 'casa' ? '#00e5a0' : time === 'fora' ? '#4d9fff' : 'var(--text3)';
                  const placares = (o.placares || [])
                    .filter(p => p.time === time)
                    .sort((a, b) => a.odd - b.odd);
                  return (
                    <div key={time}>
                      <div style={{
                        fontSize: 12, fontWeight: 700, color: cor,
                        marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.08em',
                      }}>{label}</div>
                      {placares.map((p, i) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between',
                          padding: '8px 0', borderBottom: '1px solid var(--border)',
                        }}>
                          <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>{p.placar}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>
                            {fmt(p.odd)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
