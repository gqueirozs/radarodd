import React, { useState } from 'react';
import { HISTORICO_APOSTAS } from '../data/mockData';

export default function Historico() {
  const [apostas] = useState(HISTORICO_APOSTAS);

  const totalStake = apostas.reduce((acc, a) => acc + a.stake, 0);
  const totalRetorno = apostas.reduce((acc, a) => acc + a.retorno, 0);
  const lucroTotal = totalRetorno - totalStake;
  const roi = ((lucroTotal / totalStake) * 100).toFixed(1);
  const taxaAcerto = ((apostas.filter(a => a.resultado === 'green').length / apostas.length) * 100).toFixed(0);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Suas apostas
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px' }}>
          Histórico
        </h1>
      </div>

      {/* Cards de resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Apostas', value: apostas.length, suffix: '' },
          { label: 'Taxa de acerto', value: taxaAcerto, suffix: '%', color: 'var(--accent)' },
          { label: 'Lucro total', value: lucroTotal > 0 ? `+${lucroTotal.toFixed(0)}` : lucroTotal.toFixed(0), suffix: 'R$', color: lucroTotal >= 0 ? 'var(--accent)' : 'var(--red)' },
          { label: 'ROI', value: roi, suffix: '%', color: parseFloat(roi) >= 0 ? 'var(--accent)' : 'var(--red)' },
        ].map((c, i) => (
          <div key={i} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 18px',
          }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: c.color || 'var(--text)' }}>
              {c.suffix === 'R$' ? `${c.suffix} ${c.value}` : `${c.value}${c.suffix}`}
            </div>
          </div>
        ))}
      </div>

      {/* Lista de apostas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {apostas.map((a, i) => (
          <div key={i} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderLeft: `3px solid ${a.resultado === 'green' ? 'var(--accent)' : 'var(--red)'}`,
            borderRadius: '0 12px 12px 0', padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 3 }}>{a.data} · {a.jogo}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{a.mercado}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Odd</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>
                {a.odd.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Apostado</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>
                R$ {a.stake}
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 90 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 2 }}>
                {a.resultado === 'green' ? 'Retorno' : 'Resultado'}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700,
                color: a.resultado === 'green' ? 'var(--accent)' : 'var(--red)',
              }}>
                {a.resultado === 'green' ? `R$ ${a.retorno.toFixed(2)}` : '✗ Perdida'}
              </div>
              {a.resultado === 'green' && (
                <div style={{ fontSize: 11, color: 'var(--accent)', opacity: 0.7 }}>
                  +R$ {(a.retorno - a.stake).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state de apostas futuras */}
      <div style={{
        marginTop: 24, padding: '20px', background: 'var(--bg2)',
        border: '1px dashed var(--border2)', borderRadius: 12, textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>
          Suas apostas feitas pelo RadarOdd aparecem aqui automaticamente
        </div>
      </div>
    </div>
  );
}
