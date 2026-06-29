import React, { useState } from 'react';

function ScoreBadge({ score }) {
  if (!score && score !== 0) return null;
  const nivel = score >= 75 ? 'alta' : score >= 50 ? 'media' : 'baixa';
  const cor = nivel === 'alta' ? '#00e5a0' : nivel === 'media' ? '#ffb830' : '#9ca3af';
  const label = nivel === 'alta' ? 'Alta confiança' : nivel === 'media' ? 'Confiança média' : 'Baixa confiança';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%', background: cor,
        boxShadow: `0 0 6px ${cor}`,
      }} />
      <span style={{ fontSize: 11, color: cor, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function SugestaoChip({ sugestao }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 20,
      background: 'rgba(0,229,160,0.08)',
      border: '1px solid rgba(0,229,160,0.2)',
    }}>
      <span style={{ fontSize: 14 }}>★</span>
      <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{sugestao}</span>
    </div>
  );
}

function calcScore(jogo) {
  const vbs = (jogo.valueBets || []).filter(v => v.ev > 0);
  if (!vbs.length) return null;
  const maxEv = Math.max(...vbs.map(v => v.ev || 0));
  return Math.min(99, Math.round(40 + maxEv * 2.5 + vbs.length * 5));
}

function melhorSugestao(jogo) {
  const vbs = (jogo.valueBets || []).filter(v => v.ev > 0);
  if (!vbs.length) return null;
  const melhor = vbs.reduce((a, b) => (a.ev > b.ev ? a : b));
  return melhor.mercado;
}

function qtdSugestoes(jogo) {
  return (jogo.valueBets || []).filter(v => v.ev > 0).length;
}

export default function Home({ onSelectJogo, jogos: jogosProp }) {
  const [filtro, setFiltro] = useState('todos');
  const hoje = new Date().toLocaleDateString('pt-BR');
  const amanhã = new Date(Date.now() + 86400000).toLocaleDateString('pt-BR');

  const JOGOS = (jogosProp || []).filter(j => {
    if (filtro === 'hoje') return j.data === hoje;
    if (filtro === 'amanhã') return j.data === amanhã;
    return true;
  });

  // Ordenar: maior score de confiança primeiro
  const jogosOrdenados = [...JOGOS].sort((a, b) => (calcScore(b) || 0) - (calcScore(a) || 0));

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          fontSize: 11, color: 'var(--accent)', fontWeight: 700,
          letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10,
        }}>
          Copa do Mundo 2026
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700,
          color: 'var(--text)', lineHeight: 1.2, marginBottom: 10,
        }}>
          Sugestões de apostas
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, maxWidth: 520 }}>
          Análise estatística dos jogos da Copa. Cada jogo é avaliado automaticamente
          e as melhores oportunidades são destacadas com base em valor esperado e probabilidade real.
        </p>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[['todos', 'Todos'], ['hoje', 'Hoje'], ['amanhã', 'Amanhã']].map(([v, l]) => (
          <button key={v} onClick={() => setFiltro(v)} style={{
            padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            border: 'none', cursor: 'pointer', transition: 'all .15s',
            background: filtro === v ? 'var(--accent)' : 'var(--bg3)',
            color: filtro === v ? '#000' : 'var(--text2)',
          }}>{l}</button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {jogosOrdenados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)', fontSize: 14 }}>
            Nenhum jogo encontrado para este filtro.
          </div>
        )}
        {jogosOrdenados.map(jogo => {
          const score = calcScore(jogo);
          const sugestao = melhorSugestao(jogo);
          const nSugestoes = qtdSugestoes(jogo);
          const temAnalise = nSugestoes > 0;

          return (
            <div
              key={jogo.id}
              onClick={() => onSelectJogo(jogo)}
              style={{
                background: 'var(--bg2)', borderRadius: 16, cursor: 'pointer',
                border: temAnalise ? '1px solid rgba(0,229,160,0.15)' : '1px solid var(--border)',
                overflow: 'hidden', transition: 'all .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
            >
              {/* Barra de destaque se tem sugestão */}
              {temAnalise && (
                <div style={{
                  height: 3,
                  background: 'linear-gradient(90deg, var(--accent), transparent)',
                }} />
              )}

              <div style={{ padding: '20px 24px' }}>
                {/* Linha superior: competição + data + confiança */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 18,
                }}>
                  <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>
                    {jogo.competicao} · {jogo.data} às {jogo.hora}
                  </span>
                  <ScoreBadge score={score} />
                </div>

                {/* Times */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: 20,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 22,
                      fontWeight: 700, color: 'var(--text)',
                    }}>{jogo.casa.nome}</div>
                  </div>
                  <div style={{
                    padding: '0 24px', textAlign: 'center',
                    fontSize: 12, fontWeight: 700, color: 'var(--text3)',
                    letterSpacing: '.1em',
                  }}>VS</div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 22,
                      fontWeight: 700, color: 'var(--text)',
                    }}>{jogo.fora.nome}</div>
                  </div>
                </div>

                {/* Linha inferior: sugestão ou "sem dados" + link */}
                <div style={{
                  paddingTop: 14, borderTop: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ flex: 1 }}>
                    {sugestao ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <SugestaoChip sugestao={sugestao} />
                        {nSugestoes > 1 && (
                          <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                            +{nSugestoes - 1} sugestão{nSugestoes > 2 ? 'ões' : ''}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                        Sem sugestões no momento — odds sem valor estatístico
                      </span>
                    )}
                  </div>
                  <span style={{
                    fontSize: 13, color: 'var(--accent)', fontWeight: 600,
                    whiteSpace: 'nowrap', marginLeft: 16,
                  }}>
                    Ver análise →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
