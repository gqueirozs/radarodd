import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/api';
import { SkelCard } from '../components/Skeleton';

const CorNivel = { forte: '#00e5a0', valor: '#4d9fff' };
const RotNivel = { forte: 'VALOR FORTE', valor: 'VALOR' };

export default function TrackRecord() {
  const [dados, setDados] = useState(null);
  const [status, setStatus] = useState('carregando');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/track-record`);
        const d = await res.json();
        if (d.ok) { setDados(d); setStatus('ok'); }
        else setStatus('erro');
      } catch { setStatus('erro'); }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 64px' }}>
      <div style={{ marginBottom: 22 }}>
        <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: '.14em', color: '#00e5a0', background: 'rgba(0,229,160,.1)', border: '1px solid rgba(0,229,160,.28)', padding: '4px 12px', borderRadius: 20, marginBottom: 10 }}>
          TRACK RECORD PÚBLICO
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, letterSpacing: '-.5px', margin: '4px 0 6px', color: '#f0f4ff' }}>
          Nosso <span style={{ color: '#00e5a0' }}>histórico</span> — sem retoques
        </h1>
        <p style={{ color: '#c6d1e6', margin: 0, lineHeight: 1.6, maxWidth: 620 }}>
          Cada sinal VALOR FORTE ou VALOR emitido antes de um jogo é registrado no momento em que sai e resolvido automaticamente depois do apito final. Nada de escolher os melhores retroativamente.
        </p>
      </div>

      {status === 'carregando' && <><SkelCard /><SkelCard /></>}
      {status === 'erro' && (
        <div style={{ padding: 20, background: 'rgba(255,184,48,.06)', border: '1px solid rgba(255,184,48,.2)', borderRadius: 12, color: '#c6d1e6' }}>
          Não foi possível carregar o track record agora.
        </div>
      )}

      {status === 'ok' && dados && (
        <>
          {dados.totalResolvidos === 0 && (
            <div style={{ padding: 24, background: '#0f1520', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff', marginBottom: 6 }}>Ainda coletando resultados</div>
              <div style={{ fontSize: 13, color: '#9aabc7', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
                {dados.totalAbertos > 0
                  ? <>Temos <strong>{dados.totalAbertos}</strong> sinais em aberto que serão resolvidos automaticamente conforme os jogos encerram.</>
                  : 'Assim que os primeiros jogos terminarem e sinais forem resolvidos, o histórico aparecerá aqui — 100% auditável.'}
              </div>
            </div>
          )}

          {dados.totalResolvidos > 0 && (
            <>
              {/* Números-chave */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 24 }}>
                {[
                  { label: 'Sinais resolvidos', v: dados.totalResolvidos, c: '#f0f4ff' },
                  { label: 'Taxa de acerto', v: `${dados.taxaAcerto}%`, c: dados.taxaAcerto >= 50 ? '#00e5a0' : '#ff4d6d' },
                  { label: 'ROI (1 unit/sinal)', v: `${dados.roi >= 0 ? '+' : ''}${dados.roi}%`, c: dados.roi >= 0 ? '#00e5a0' : '#ff4d6d' },
                  { label: 'Em aberto', v: dados.totalAbertos, c: '#c6d1e6' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#0f1520', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#9aabc7', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>

              {/* Por nível */}
              <div style={{ background: '#0f1520', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#9aabc7', textTransform: 'uppercase', marginBottom: 12 }}>Por nível de valor</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  {['forte', 'valor'].map(nv => {
                    const info = dados.porNivel[nv];
                    return (
                      <div key={nv} style={{ padding: 12, background: 'rgba(255,255,255,.02)', borderRadius: 10, border: `1px solid ${CorNivel[nv]}22` }}>
                        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', color: CorNivel[nv], marginBottom: 6 }}>{RotNivel[nv]}</div>
                        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#c6d1e6', flexWrap: 'wrap' }}>
                          <span>Total: <strong style={{ fontFamily: 'var(--font-mono)', color: '#f0f4ff' }}>{info.total}</strong></span>
                          <span>Acertos: <strong style={{ fontFamily: 'var(--font-mono)', color: '#f0f4ff' }}>{info.acertos}</strong></span>
                          <span>Acerto: <strong style={{ fontFamily: 'var(--font-mono)', color: info.taxaAcerto >= 50 ? '#00e5a0' : '#ff4d6d' }}>{info.taxaAcerto}%</strong></span>
                          <span>ROI: <strong style={{ fontFamily: 'var(--font-mono)', color: info.roi >= 0 ? '#00e5a0' : '#ff4d6d' }}>{info.roi >= 0 ? '+' : ''}{info.roi}%</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recentes */}
              <div style={{ marginBottom: 12, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#9aabc7', textTransform: 'uppercase' }}>
                Últimos sinais resolvidos
              </div>
              {dados.recentes.map((r, i) => (
                <div key={i} style={{ background: '#0f1520', border: `1px solid ${r.status === 'acertou' ? 'rgba(0,229,160,.22)' : 'rgba(255,77,109,.22)'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.1em', color: CorNivel[r.nivel], background: `${CorNivel[r.nivel]}18`, border: `1px solid ${CorNivel[r.nivel]}30`, padding: '2px 8px', borderRadius: 20 }}>{RotNivel[r.nivel]}</span>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f4ff' }}>{r.mercado}</div>
                    <div style={{ fontSize: 11, color: '#9aabc7', marginTop: 1 }}>{r.jogo} · {r.data} · {r.placar}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#c6d1e6' }}>{r.odd.toFixed(2)}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', color: r.status === 'acertou' ? '#00e5a0' : '#ff4d6d', padding: '4px 10px', background: r.status === 'acertou' ? 'rgba(0,229,160,.08)' : 'rgba(255,77,109,.08)', border: `1px solid ${r.status === 'acertou' ? 'rgba(0,229,160,.25)' : 'rgba(255,77,109,.25)'}`, borderRadius: 20 }}>
                    {r.status === 'acertou' ? '✓ VERDE' : '✗ RED'}
                  </div>
                </div>
              ))}
            </>
          )}

          <div style={{ marginTop: 24, padding: 14, background: 'rgba(255,184,48,.04)', border: '1px solid rgba(255,184,48,.14)', borderRadius: 10, fontSize: 11.5, color: '#9aabc7', lineHeight: 1.6 }}>
            <strong style={{ color: '#ffb830' }}>Como funciona:</strong> cada sinal é gravado no banco no momento em que emitimos (não retrospectivo), com sua odd, EV e nível. Quando o jogo encerra, o resultado é comparado com o mercado e o sinal vira "verde" ou "red" automaticamente. ROI é calculado assumindo 1 unit por sinal. Retornos passados não garantem retornos futuros.
          </div>
        </>
      )}
    </div>
  );
}
