import React, { useState } from 'react';
import Bilhete from '../components/Bilhete';

function Tag({ children, color = 'accent' }) {
  const colors = {
    accent: { bg: 'var(--accent-dim)', text: 'var(--accent)', border: 'rgba(0,229,160,0.2)' },
    amber:  { bg: 'var(--amber-dim)',  text: 'var(--amber)',  border: 'rgba(255,184,48,0.2)' },
    red:    { bg: 'var(--red-dim)',    text: 'var(--red)',    border: 'rgba(255,77,109,0.2)' },
    blue:   { bg: 'var(--blue-dim)',   text: 'var(--blue)',   border: 'rgba(77,159,255,0.2)' },
  };
  const c = colors[color];
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>{children}</span>
  );
}

function OddCard({ label, sublabel, value, ev, evText, recommended, onAdd, disabled }) {
  const [selected, setSelected] = useState(false);
  const handleClick = () => {
    if (disabled) return;
    const next = !selected;
    setSelected(next);
    if (next) onAdd(label, value);
    else onAdd(label, value, true);
  };

  return (
    <div onClick={handleClick} style={{
      background: selected ? 'rgba(0,229,160,0.08)' : 'var(--bg3)',
      border: `1px solid ${selected ? 'rgba(0,229,160,0.4)' : recommended ? 'rgba(0,229,160,0.15)' : 'var(--border)'}`,
      borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'all .15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 2 }}>{label}</div>
          {sublabel && <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.4, marginTop: 3 }}>{sublabel}</div>}
        </div>
        <div style={{ textAlign: 'right', marginLeft: 12 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700,
            color: selected ? 'var(--accent)' : 'var(--text)',
          }}>{parseFloat(value).toFixed(2)}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
            {(100 / value).toFixed(1)}% impl.
          </div>
        </div>
      </div>
      {ev !== undefined && (
        <div style={{
          marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)',
          fontSize: 11, fontWeight: 600,
          color: ev > 0 ? 'var(--accent)' : ev < -3 ? 'var(--red)' : 'var(--text3)',
        }}>
          {ev > 0 ? '▲' : ev < 0 ? '▼' : '—'} EV {ev > 0 ? '+' : ''}{ev?.toFixed(1)}% {evText && `· ${evText}`}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: 'var(--text3)',
        textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12,
      }}>{title}</div>
      {children}
    </div>
  );
}

function Grid({ cols = 2, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
      {children}
    </div>
  );
}

export default function Analisador({ jogo, onVoltar }) {
  const [aba, setAba] = useState('principal');
  const [bilheteItens, setBilheteItens] = useState([]);
  const [filtroPlaycar, setFiltroPlaycar] = useState('todos');

  const abas = ['principal', 'gols', 'placar', 'especiais', 'análise'];

  const addToBilhete = (mercado, odd, remove = false) => {
    if (remove) {
      setBilheteItens(prev => prev.filter(i => i.mercado !== mercado));
    } else {
      if (bilheteItens.find(i => i.mercado === mercado)) return;
      setBilheteItens(prev => [...prev, {
        jogo: `${jogo.casa.nome} x ${jogo.fora.nome}`,
        mercado, odd: parseFloat(odd),
      }]);
    }
  };

  const removeFromBilhete = (idx) => setBilheteItens(prev => prev.filter((_, i) => i !== idx));

  const placaresFiltrados = filtroPlaycar === 'todos'
    ? jogo.odds.placares
    : jogo.odds.placares.filter(p => p.time === filtroPlaycar);

  const evFn = (odd, probReal) => ((odd * probReal) - 1) * 100;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
      {/* Voltar */}
      <button onClick={onVoltar} style={{
        background: 'none', border: 'none', color: 'var(--text2)', fontSize: 13,
        cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6,
      }}>← Voltar para jogos</button>

      {/* Header do jogo */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
          {jogo.competicao} · {jogo.data} {jogo.hora} · {jogo.estadio}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Casa */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 48 }}>{jogo.casa.bandeira}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>{jogo.casa.nome}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                {jogo.casa.pts} pts · {jogo.casa.gp} gols marcados · {jogo.casa.gc} sofridos
              </div>
            </div>
          </div>
          {/* Odds 1x2 centrais */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {[
              { l: jogo.casa.nome, v: jogo.odds.resultado.casa, h: true },
              { l: 'Empate', v: jogo.odds.resultado.empate },
              { l: jogo.fora.nome, v: jogo.odds.resultado.fora },
            ].map((o, i) => (
              <div key={i} onClick={() => addToBilhete(o.l + ' vence', o.v)} style={{
                padding: '10px 18px', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
                background: o.h ? 'var(--accent-dim2)' : 'var(--bg4)',
                border: `1px solid ${o.h ? 'rgba(0,229,160,0.3)' : 'var(--border)'}`,
                transition: 'all .15s',
              }}>
                <div style={{ fontSize: 11, color: o.h ? 'var(--accent)' : 'var(--text3)', marginBottom: 4 }}>{o.l}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: o.h ? 'var(--accent)' : 'var(--text)' }}>
                  {o.v.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          {/* Fora */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>{jogo.fora.nome}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                {jogo.fora.pts} pts · {jogo.fora.gp} gols marcados · {jogo.fora.gc} sofridos
              </div>
            </div>
            <span style={{ fontSize: 48 }}>{jogo.fora.bandeira}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
        {/* Coluna principal */}
        <div>
          {/* Abas */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
            {abas.map(a => (
              <button key={a} onClick={() => setAba(a)} style={{
                background: 'none', border: 'none', padding: '10px 16px',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                color: aba === a ? 'var(--accent)' : 'var(--text2)',
                borderBottom: aba === a ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1, transition: 'all .15s',
                textTransform: 'capitalize',
              }}>{a}</button>
            ))}
          </div>

          {/* === ABA PRINCIPAL === */}
          {aba === 'principal' && (
            <div>
              <Section title="Chance dupla">
                <Grid cols={3}>
                  {[
                    { l: `${jogo.casa.nome} ou Empate`, v: jogo.odds.chanceDupla.casaEmpate },
                    { l: `${jogo.casa.nome} ou ${jogo.fora.nome}`, v: jogo.odds.chanceDupla.casaFora },
                    { l: `Empate ou ${jogo.fora.nome}`, v: jogo.odds.chanceDupla.empataFora },
                  ].map((o, i) => (
                    <OddCard key={i} label={o.l} value={o.v} onAdd={addToBilhete} />
                  ))}
                </Grid>
              </Section>
              <Section title="Para qualificar (inclui prorrogação e pênaltis)">
                <Grid>
                  <OddCard label={`${jogo.casa.nome} avança`} value={jogo.odds.qualificar.casa} recommended
                    ev={evFn(jogo.odds.qualificar.casa, 0.72)} evText="favorito em 90min + extras"
                    onAdd={addToBilhete} />
                  <OddCard label={`${jogo.fora.nome} avança`} value={jogo.odds.qualificar.fora}
                    ev={evFn(jogo.odds.qualificar.fora, 0.28)} onAdd={addToBilhete} />
                </Grid>
              </Section>
              <Section title="Primeiro gol">
                <Grid cols={3}>
                  <OddCard label={`${jogo.casa.nome} marca primeiro`} value={jogo.odds.primeiroGol.casa} recommended
                    ev={evFn(jogo.odds.primeiroGol.casa, 0.68)} evText="marcou 1º em 10 de 13 Copas"
                    onAdd={addToBilhete} />
                  <OddCard label="Nenhum gol" value={jogo.odds.primeiroGol.nenhum}
                    ev={evFn(jogo.odds.primeiroGol.nenhum, 0.05)} onAdd={addToBilhete} />
                  <OddCard label={`${jogo.fora.nome} marca primeiro`} value={jogo.odds.primeiroGol.fora}
                    ev={evFn(jogo.odds.primeiroGol.fora, 0.28)} onAdd={addToBilhete} />
                </Grid>
              </Section>
            </div>
          )}

          {/* === ABA GOLS === */}
          {aba === 'gols' && (
            <div>
              <Section title={`Total de gols (linha ${jogo.odds.totalGols.linha})`}>
                <Grid>
                  <OddCard label={`Mais de ${jogo.odds.totalGols.linha} gols`} value={jogo.odds.totalGols.mais} recommended
                    ev={evFn(jogo.odds.totalGols.mais, 0.56)} evText="ambos marcaram 7 gols na fase de grupos"
                    onAdd={addToBilhete} />
                  <OddCard label={`Menos de ${jogo.odds.totalGols.linha} gols`} value={jogo.odds.totalGols.menos}
                    ev={evFn(jogo.odds.totalGols.menos, 0.44)} evText="mata-mata tende a ser mais fechado"
                    onAdd={addToBilhete} />
                </Grid>
              </Section>
              <Section title="Ambas as equipes marcam">
                <Grid>
                  <OddCard label="Ambas marcam — Sim" value={jogo.odds.ambasMarcam.sim} recommended
                    ev={evFn(jogo.odds.ambasMarcam.sim, 0.55)} evText={`${jogo.fora.nome} marcou nos 2 encontros recentes`}
                    onAdd={addToBilhete} />
                  <OddCard label="Ambas marcam — Não" value={jogo.odds.ambasMarcam.nao}
                    ev={evFn(jogo.odds.ambasMarcam.nao, 0.45)} onAdd={addToBilhete} />
                </Grid>
              </Section>

              {/* Dica de combo */}
              <div style={{
                background: 'var(--accent-dim)', border: '1px solid rgba(0,229,160,0.2)',
                borderRadius: 10, padding: '14px 16px',
              }}>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>
                  💡 Combinação de valor
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text)' }}>Mais de 2.5 gols + Ambas marcam (Sim)</strong> — odd combinada ~3.80.
                  Ambos os times têm ataque potente (7 gols cada na fase de grupos). O amistoso de 2025 terminou 3×2.
                </div>
              </div>
            </div>
          )}

          {/* === ABA PLACAR === */}
          {aba === 'placar' && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'casa', label: jogo.casa.nome },
                  { id: 'empate', label: 'Empate' },
                  { id: 'fora', label: jogo.fora.nome },
                ].map(f => (
                  <button key={f.id} onClick={() => setFiltroPlaycar(f.id)} style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, border: 'none',
                    background: filtroPlaycar === f.id ? 'var(--accent)' : 'var(--bg3)',
                    color: filtroPlaycar === f.id ? '#000' : 'var(--text2)',
                  }}>{f.label}</button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {placaresFiltrados.map((p, i) => {
                  const colors = { casa: 'var(--accent)', empate: 'var(--amber)', fora: 'var(--red)' };
                  return (
                    <div key={i} onClick={() => addToBilhete(`Placar ${p.placar}`, p.odd)} style={{
                      background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10,
                      padding: '14px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
                        color: colors[p.time], marginBottom: 6,
                      }}>{p.placar}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                        {p.odd.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
                ★ Placares de maior valor esperado: <strong style={{ color: 'var(--text2)' }}>2-1 (8.50)</strong> e <strong style={{ color: 'var(--text2)' }}>3-1 (15.00)</strong> — vitória + ambas marcam.
              </div>
            </div>
          )}

          {/* === ABA ESPECIAIS === */}
          {aba === 'especiais' && (
            <div>
              <Section title={`Escanteios (linha ${jogo.odds.escanteios.linha})`}>
                <Grid>
                  <OddCard label={`Mais de ${jogo.odds.escanteios.linha} escanteios`} value={jogo.odds.escanteios.mais}
                    ev={evFn(jogo.odds.escanteios.mais, 0.50)} onAdd={addToBilhete} />
                  <OddCard label={`Menos de ${jogo.odds.escanteios.linha} escanteios`} value={jogo.odds.escanteios.menos}
                    ev={evFn(jogo.odds.escanteios.menos, 0.60)} onAdd={addToBilhete} />
                </Grid>
              </Section>
              <Section title="Handicap asiático">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {jogo.odds.handicap.map((h, i) => (
                    <OddCard key={i} label={`${jogo.casa.nome} (${h.linha})`} value={h.odd}
                      recommended={h.linha === '0'}
                      sublabel={h.linha === '0' ? 'Devolve em empate' : undefined}
                      onAdd={addToBilhete} />
                  ))}
                </div>
                <div style={{
                  marginTop: 12, background: 'var(--accent-dim)', border: '1px solid rgba(0,229,160,0.2)',
                  borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6,
                }}>
                  💡 <strong style={{ color: 'var(--text)' }}>{jogo.casa.nome} (0)</strong> a {jogo.odds.handicap.find(h => h.linha === '0')?.odd?.toFixed(2)} é o mercado mais seguro — se empatar, devolve; só perde se {jogo.fora.nome} vencer nos 90 minutos.
                </div>
              </Section>
            </div>
          )}

          {/* === ABA ANÁLISE === */}
          {aba === 'análise' && (
            <div>
              {/* Value Bets */}
              <Section title="Value bets detectados">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {jogo.valueBets.filter(v => v.ev > 0).map((vb, i) => {
                    const medalhas = ['🥇', '🥈', '🥉', '4️⃣'];
                    const forcaColor = vb.forca === 'alta' ? 'accent' : vb.forca === 'media' ? 'amber' : 'red';
                    return (
                      <div key={i} onClick={() => addToBilhete(vb.mercado, vb.odd)} style={{
                        background: 'var(--bg3)', border: '1px solid var(--border)',
                        borderLeft: `3px solid ${vb.forca === 'alta' ? 'var(--accent)' : vb.forca === 'media' ? 'var(--amber)' : 'var(--text3)'}`,
                        borderRadius: '0 10px 10px 0', padding: '14px 16px', cursor: 'pointer',
                        transition: 'all .15s',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <span style={{ fontSize: 16 }}>{medalhas[i]}</span>
                              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{vb.mercado}</span>
                              <Tag color={forcaColor}>EV +{vb.ev.toFixed(1)}%</Tag>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
                              Prob. real estimada: <strong style={{ color: 'var(--text2)' }}>{(vb.probReal * 100).toFixed(0)}%</strong> vs prob. implícita da odd: <strong style={{ color: 'var(--text2)' }}>{(100 / vb.odd).toFixed(1)}%</strong>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', marginLeft: 16 }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>
                              {vb.odd.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* Estatísticas */}
              <Section title="Comparativo na fase de grupos">
                {[
                  { label: 'Gols marcados', casa: jogo.casa.gp, fora: jogo.fora.gp, max: Math.max(jogo.casa.gp, jogo.fora.gp) + 1 },
                  { label: 'Gols sofridos', casa: jogo.casa.gc, fora: jogo.fora.gc, max: Math.max(jogo.casa.gc, jogo.fora.gc) + 1 },
                  { label: 'Pontos', casa: jogo.casa.pts, fora: jogo.fora.pts, max: 9 },
                ].map((s, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: 'var(--text2)' }}>
                        {jogo.casa.bandeira} <strong style={{ color: 'var(--text)' }}>{s.casa}</strong>
                      </span>
                      <span style={{ color: 'var(--text3)', fontSize: 12 }}>{s.label}</span>
                      <span style={{ color: 'var(--text2)' }}>
                        <strong style={{ color: 'var(--text)' }}>{s.fora}</strong> {jogo.fora.bandeira}
                      </span>
                    </div>
                    <div style={{ position: 'relative', height: 8, background: 'var(--bg4)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute', left: 0, top: 0, height: '100%',
                        width: `${(s.casa / s.max) * 100}%`,
                        background: 'var(--accent)', borderRadius: 99,
                      }} />
                    </div>
                  </div>
                ))}
              </Section>

              {/* Histórico H2H */}
              <Section title="Histórico de confrontos">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {jogo.historico.map((h, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'var(--bg3)', borderRadius: 8, padding: '10px 14px',
                      border: '1px solid var(--border)',
                    }}>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>{h.data} · {h.competicao}</div>
                        <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{h.casa} x {h.fora}</div>
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700,
                        color: 'var(--text)', padding: '4px 12px',
                        background: 'var(--bg4)', borderRadius: 8,
                      }}>{h.resultado}</div>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                    Retrospecto geral: {jogo.casa.nome} lidera com 11V 2E 1D em 14 jogos
                  </div>
                </div>
              </Section>
            </div>
          )}
        </div>

        {/* Bilhete lateral */}
        <Bilhete
          itens={bilheteItens}
          onRemove={removeFromBilhete}
          onClear={() => setBilheteItens([])}
        />
      </div>
    </div>
  );
}
