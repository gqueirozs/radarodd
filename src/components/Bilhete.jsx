import React, { useState } from 'react';

export default function Bilhete({ itens, onRemove, onClear }) {
  const [stake, setStake] = useState('');

  const oddTotal = itens.reduce((acc, item) => acc * item.odd, 1);
  const retorno = stake ? (parseFloat(stake) * oddTotal).toFixed(2) : null;
  const lucro = stake ? (parseFloat(stake) * oddTotal - parseFloat(stake)).toFixed(2) : null;

  return (
    <div style={{
      position: 'sticky', top: 74, background: 'var(--bg2)',
      border: '1px solid var(--border)', borderRadius: 16,
      padding: 20, minWidth: 260,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>
          Bilhete {itens.length > 0 && <span style={{
            fontSize: 11, background: 'var(--accent)', color: '#000', borderRadius: 99,
            padding: '2px 7px', marginLeft: 6, fontWeight: 700,
          }}>{itens.length}</span>}
        </div>
        {itens.length > 0 && (
          <button onClick={onClear} style={{
            background: 'none', border: 'none', fontSize: 12, color: 'var(--text3)',
            cursor: 'pointer',
          }}>Limpar</button>
        )}
      </div>

      {/* Itens */}
      {itens.length === 0 ? (
        <div style={{
          padding: '24px 0', textAlign: 'center',
          color: 'var(--text3)', fontSize: 13, lineHeight: 1.6,
        }}>
          Selecione uma odd no<br />analisador para apostar
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {itens.map((item, i) => (
            <div key={i} style={{
              background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 2 }}>{item.jogo}</div>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{item.mercado}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color: 'var(--accent)',
                  }}>{item.odd.toFixed(2)}</span>
                  <button onClick={() => onRemove(i)} style={{
                    background: 'none', border: 'none', color: 'var(--text3)',
                    fontSize: 16, cursor: 'pointer', lineHeight: 1, padding: '0 2px',
                  }}>×</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Odd total */}
      {itens.length > 0 && (
        <>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0', borderTop: '1px solid var(--border)', marginBottom: 12,
          }}>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>Odd total</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
              {oddTotal.toFixed(2)}
            </span>
          </div>

          {/* Stake input */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>
              Valor da aposta (R$)
            </label>
            <input
              type="number"
              min="1"
              value={stake}
              onChange={e => setStake(e.target.value)}
              placeholder="Ex: 50"
              style={{
                width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)',
                borderRadius: 8, padding: '10px 12px', color: 'var(--text)',
                fontSize: 15, fontFamily: 'var(--font-mono)', outline: 'none',
              }}
            />
          </div>

          {/* Retorno */}
          {retorno && parseFloat(stake) > 0 && (
            <div style={{
              background: 'var(--accent-dim)', border: '1px solid rgba(0,229,160,0.2)',
              borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Retorno total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>
                  R$ {retorno}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Lucro</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                  + R$ {lucro}
                </span>
              </div>
            </div>
          )}

          <button style={{
            width: '100%', marginTop: 12, padding: '12px',
            background: 'var(--accent)', borderRadius: 10, border: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
            color: '#000', cursor: 'pointer', transition: 'opacity .15s',
          }}
            onMouseEnter={e => e.target.style.opacity = '.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Registrar aposta
          </button>
        </>
      )}
    </div>
  );
}
