import React, { useState } from 'react';

function FormaTag({ resultado }) {
  const colors = { V: '#00e5a0', E: '#ffb830', D: '#ff4d6d' };
  return (
    <span style={{
      width: 20, height: 20, borderRadius: 4, fontSize: 10, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: colors[resultado] + '22', color: colors[resultado],
    }}>{resultado}</span>
  );
}

function OddPill({ label, value, highlight }) {
  return (
    <div style={{
      textAlign: 'center', padding: '8px 12px', borderRadius: 8,
      background: highlight ? 'var(--accent-dim2)' : 'var(--bg4)',
      border: `1px solid ${highlight ? 'rgba(0,229,160,0.3)' : 'var(--border)'}`,
      minWidth: 72,
    }}>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3 }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 16,
        color: highlight ? 'var(--accent)' : 'var(--text)',
      }}>{value}</div>
    </div>
  );
}

export default function Home({ onSelectJogo, jogos: jogosProp, apiStatus }) {
  const [filtro, setFiltro] = useState('todos');
  const JOGOS = jogosProp || [];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Copa do Mundo 2026
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700,
          letterSpacing: '-0.5px', color: 'var(--text)', lineHeight: 1.2,
        }}>
          Jogos disponíveis
        </h1>
        <p style={{ color: 'var(--text2)', marginTop: 8, fontSize: 15 }}>
          Selecione um jogo para ver análise completa de odds e value bets
        </p>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['todos', 'hoje', 'amanhã'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: 'none',
            background: filtro === f ? 'var(--accent)' : 'var(--bg3)',
            color: filtro === f ? '#000' : 'var(--text2)',
            transition: 'all .15s',
          }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      {/* Lista de jogos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {JOGOS.map(jogo => (
          <div
            key={jogo.id}
            onClick={() => onSelectJogo(jogo)}
            style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '20px 24px',
              cursor: 'pointer', transition: 'all .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '1px solid var(--border2)';
              e.currentTarget.style.background = 'var(--bg3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid var(--border)';
              e.currentTarget.style.background = 'var(--bg2)';
            }}
          >
            {/* Competição e data */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500 }}>{jogo.competicao}</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{jogo.data} · {jogo.hora}</span>
                <span style={{
                  fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600,
                  background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-dim2)',
                }}>Value bets: {jogo.valueBets.filter(v => v.ev > 0).length}</span>
              </div>
            </div>

            {/* Times */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              {/* Casa */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{jogo.casa.bandeira}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--text)' }}>
                      {jogo.casa.nome}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>Grupo {jogo.casa.grupo} · {jogo.casa.pts} pts</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {jogo.casa.forma.map((f, i) => <FormaTag key={i} resultado={f} />)}
                </div>
              </div>

              {/* VS */}
              <div style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                  color: 'var(--text3)', letterSpacing: '.1em',
                }}>VS</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{jogo.estadio}</div>
              </div>

              {/* Fora */}
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--text)' }}>
                      {jogo.fora.nome}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'right' }}>Grupo {jogo.fora.grupo} · {jogo.fora.pts} pts</div>
                  </div>
                  <span style={{ fontSize: 28 }}>{jogo.fora.bandeira}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                  {jogo.fora.forma.map((f, i) => <FormaTag key={i} resultado={f} />)}
                </div>
              </div>
            </div>

            {/* Odds principais */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <OddPill label={jogo.casa.nome} value={jogo.odds.resultado.casa} highlight />
              <OddPill label="Empate" value={jogo.odds.resultado.empate} />
              <OddPill label={jogo.fora.nome} value={jogo.odds.resultado.fora} />
              <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
              <OddPill label="Mais 2.5" value={jogo.odds.totalGols.mais} />
              <OddPill label="Ambas" value={jogo.odds.ambasMarcam.sim} />
            </div>

            {/* Rodapé */}
            <div style={{
              marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {jogo.valueBets.filter(v => v.ev > 0).slice(0, 2).map((vb, i) => (
                  <span key={i} style={{
                    fontSize: 11, padding: '3px 8px', borderRadius: 6,
                    background: vb.forca === 'alta' ? 'var(--accent-dim)' : 'var(--amber-dim)',
                    color: vb.forca === 'alta' ? 'var(--accent)' : 'var(--amber)',
                    border: `1px solid ${vb.forca === 'alta' ? 'rgba(0,229,160,0.2)' : 'rgba(255,184,48,0.2)'}`,
                    fontWeight: 500,
                  }}>★ {vb.mercado}</span>
                ))}
              </div>
              <span style={{
                fontSize: 13, color: 'var(--accent)', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                Ver análise →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
