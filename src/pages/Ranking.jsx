import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { API_URL } from '../data/api';
import { SkelCard } from '../components/Skeleton';

const CorNivel = { forte: '#00e5a0', valor: '#4d9fff' };
const RotNivel = { forte: 'VALOR FORTE', valor: 'VALOR' };

export default function Ranking() {
  const { assinante } = useAuth();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [status, setStatus] = useState('carregando');
  const [bankroll, setBankroll] = useState(() => {
    try { return parseFloat(localStorage.getItem('sinalodds_bankroll')) || 500; }
    catch { return 500; }
  });

  useEffect(() => {
    if (!assinante) return;
    (async () => {
      try {
        const token = localStorage.getItem('sinalodds_token');
        const res = await fetch(`${API_URL}/api/ranking`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        if (d.ok) { setDados(d); setStatus('ok'); }
        else setStatus('erro');
      } catch { setStatus('erro'); }
    })();
  }, [assinante]);

  if (!assinante) {
    return (
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 14 }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: '#f0f4ff' }}>Ranking exclusivo para assinantes</h2>
        <p style={{ color: '#c6d1e6', margin: '12px auto 22px', maxWidth: 420, lineHeight: 1.6 }}>
          As melhores oportunidades da rodada consolidadas, com odds, EV e stake sugerido pra cada uma.
        </p>
        <button onClick={() => navigate('/premium')} style={{ padding: '13px 32px', borderRadius: 12, border: 'none', background: '#00e5a0', color: '#000', fontWeight: 800, cursor: 'pointer' }}>
          Assinar por R$ 9,99/mês
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 64px' }}>
      <div style={{ marginBottom: 18 }}>
        <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: '.14em', color: '#00e5a0', background: 'rgba(0,229,160,.1)', border: '1px solid rgba(0,229,160,.28)', padding: '4px 12px', borderRadius: 20, marginBottom: 10 }}>★ RANKING PREMIUM</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, letterSpacing: '-.5px', margin: '4px 0 6px', color: '#f0f4ff' }}>
          Melhores oportunidades <span style={{ color: '#00e5a0' }}>da rodada</span>
        </h1>
        <p style={{ color: '#c6d1e6', margin: 0, lineHeight: 1.6 }}>
          Todos os sinais com EV positivo dos jogos futuros, ordenados por valor esperado.
        </p>
      </div>

      {status === 'carregando' && <><SkelCard /><SkelCard /><SkelCard /></>}
      {status === 'erro' && (
        <div style={{ padding: 20, background: 'rgba(255,184,48,.06)', border: '1px solid rgba(255,184,48,.2)', borderRadius: 12, color: '#c6d1e6' }}>
          Não conseguimos carregar o ranking agora. Tente novamente em instantes.
        </div>
      )}

      {status === 'ok' && dados && (
        <>
          {/* Sumário */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Oportunidades', v: dados.total, c: '#f0f4ff' },
              { label: 'Valor forte', v: dados.forte, c: '#00e5a0' },
              { label: 'Valor', v: dados.valor, c: '#4d9fff' },
              { label: 'EV médio', v: `${dados.evMedio >= 0 ? '+' : ''}${dados.evMedio}%`, c: dados.evMedio >= 0 ? '#00e5a0' : '#ff4d6d' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#0f1520', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#9aabc7', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Bankroll input compacto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 14px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12 }}>
            <span style={{ fontSize: 11, color: '#9aabc7', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 700 }}>Bankroll</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#c6d1e6' }}>R$</span>
            <input type="number" value={bankroll}
              onChange={e => {
                const v = Math.max(0, parseFloat(e.target.value) || 0);
                setBankroll(v);
                try { localStorage.setItem('sinalodds_bankroll', String(v)); } catch { /* ok */ }
              }}
              style={{ background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '6px 10px', color: '#f0f4ff', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, width: 100, outline: 'none' }}
            />
            <span style={{ fontSize: 11, color: '#9aabc7', marginLeft: 'auto' }}>Stakes calculados por Kelly (quarter)</span>
          </div>

          {/* Lista */}
          {dados.oportunidades.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, background: '#0f1520', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff', marginBottom: 6 }}>Nenhuma oportunidade agora</div>
              <div style={{ fontSize: 13, color: '#9aabc7', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                As odds atuais estão alinhadas com a frequência real. Volte quando as próximas rodadas abrirem.
              </div>
            </div>
          )}

          {dados.oportunidades.map((o, i) => {
            const stake = o.kellyPct > 0 ? Math.max(5, Math.round(bankroll * o.kellyPct / 100)) : 0;
            const retorno = stake * o.odd;
            const lucro = retorno - stake;
            const cor = CorNivel[o.nivel];
            return (
              <div key={i} onClick={() => navigate(`/partida/${o.jogoId}`)}
                style={{ background: '#0f1520', border: `1px solid ${cor}30`, borderRadius: 14, padding: 14, marginBottom: 10, cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${cor}66`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${cor}30`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.1em', color: cor, background: `${cor}18`, border: `1px solid ${cor}30`, padding: '2px 8px', borderRadius: 20 }}>{RotNivel[o.nivel]}</span>
                      <span style={{ fontSize: 11, color: '#9aabc7' }}>{o.data} · {o.hora}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff', marginBottom: 2 }}>{o.mercado}</div>
                    <div style={{ fontSize: 12, color: '#c6d1e6' }}>{o.confronto}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#f0f4ff' }}>{o.odd.toFixed(2)}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#00e5a0' }}>+{o.ev}% EV</div>
                  </div>
                </div>

                {stake > 0 && (
                  <div style={{ display: 'flex', gap: 16, padding: '8px 12px', background: 'rgba(0,0,0,.25)', borderRadius: 8, fontSize: 11, flexWrap: 'wrap' }}>
                    <span style={{ color: '#9aabc7' }}>Stake: <strong style={{ color: cor, fontFamily: 'var(--font-mono)' }}>R$ {stake}</strong></span>
                    <span style={{ color: '#9aabc7' }}>Se acertar: <strong style={{ color: '#f0f4ff', fontFamily: 'var(--font-mono)' }}>R$ {retorno.toFixed(0)}</strong></span>
                    <span style={{ color: '#9aabc7' }}>Lucro: <strong style={{ color: '#f0f4ff', fontFamily: 'var(--font-mono)' }}>+R$ {lucro.toFixed(0)}</strong></span>
                    <span style={{ color: '#9aabc7', marginLeft: 'auto' }}>Ver análise →</span>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
