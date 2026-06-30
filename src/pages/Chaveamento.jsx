import React, { useState } from 'react';
import { OITAVAS, QUARTAS, SEMIS, FINAL, TERCEIRO } from '../data/bracketData';
import { getLogo } from '../data/statsDB';
import { useIsMobile } from '../hooks/useIsMobile';

const S = `
.brk-wrap { max-width: 1180px; margin: 0 auto; padding: 28px 16px 56px; }
.brk-badges { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.brk-badge { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; }
.brk-badge-g { color: #00e5a0; background: rgba(0,229,160,.1); border: 1px solid rgba(0,229,160,.2); }
.brk-badge-d { color: #4d5f7a; background: #141c2a; border: 1px solid rgba(255,255,255,.07); }
.brk-title { font-family: var(--font-display); font-weight: 800; color: #f0f4ff; line-height: 1.15; letter-spacing: -.5px; margin-bottom: 10px; }
.brk-sub { color: #4d5f7a; font-size: 13px; line-height: 1.6; max-width: 480px; margin-bottom: 24px; }

.brk-fasetabs { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
.brk-fasetab { padding: 7px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid rgba(255,255,255,.07); cursor: pointer; transition: all .15s; background: #0f1520; color: #8b9ab4; }
.brk-fasetab.on { background: #00e5a0; color: #000; border-color: transparent; }

.brk-desktop { display: flex; gap: 28px; overflow-x: auto; padding-bottom: 16px; }
.brk-coluna { display: flex; flex-direction: column; justify-content: space-around; min-width: 230px; flex-shrink: 0; }
.brk-coluna-titulo { font-size: 11px; font-weight: 700; color: #4d5f7a; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 14px; text-align: center; }

.brk-jogo { background: #0f1520; border: 1px solid rgba(255,255,255,.07); border-radius: 12px; padding: 10px 12px; margin-bottom: 18px; cursor: pointer; transition: all .15s; }
.brk-jogo:hover { background: #141c2a; border-color: rgba(0,229,160,.25); transform: translateY(-1px); }
.brk-jogo.vazio { cursor: default; opacity: .55; }
.brk-jogo.vazio:hover { background: #0f1520; border-color: rgba(255,255,255,.07); transform: none; }
.brk-jogo-data { font-size: 10px; color: #4d5f7a; margin-bottom: 8px; text-align: center; }
.brk-time { display: flex; align-items: center; gap: 8px; padding: 5px 0; }
.brk-time-nome { font-size: 13px; font-weight: 600; color: #f0f4ff; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.brk-time-vazio { font-size: 13px; color: #4d5f7a; font-style: italic; }
.brk-flag { width: 22px; height: 22px; border-radius: 5px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255,255,255,.08); }
.brk-flag-ph { width: 22px; height: 22px; border-radius: 5px; background: #1c2537; border: 1px solid rgba(255,255,255,.08); flex-shrink: 0; }
.brk-divider { height: 1px; background: rgba(255,255,255,.07); margin: 2px 0; }

.brk-mobile-fase { margin-bottom: 28px; }
.brk-mobile-titulo { font-size: 13px; font-weight: 700; color: #00e5a0; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,.07); }
.brk-mobile-grupo { font-size: 10px; font-weight: 700; color: #4d5f7a; text-transform: uppercase; letter-spacing: .1em; margin: 14px 0 8px; }

.brk-final-card { background: linear-gradient(135deg, rgba(0,229,160,.08), rgba(0,176,255,.05)); border: 1.5px solid rgba(0,229,160,.25); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 20px; }
.brk-final-label { font-size: 11px; font-weight: 700; color: #00e5a0; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 14px; }
.brk-final-times { display: flex; align-items: center; justify-content: center; gap: 16px; }
.brk-final-time { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 90px; }
.brk-final-time-nome { font-size: 15px; font-weight: 800; font-family: var(--font-display); color: #f0f4ff; }
.brk-final-vs { font-size: 13px; color: #4d5f7a; font-weight: 700; }
.brk-final-data { font-size: 11px; color: #4d5f7a; margin-top: 12px; }

@media (max-width: 768px) {
  .brk-desktop { display: none; }
}
@media (min-width: 769px) {
  .brk-mobile { display: none; }
}
`;

function Flag({ nome, size = 22 }) {
  const logo = nome ? getLogo(nome) : null;
  if (!logo) return <div className="brk-flag-ph" style={{ width: size, height: size }} />;
  return <img src={logo} alt={nome} className="brk-flag" style={{ width: size, height: size }} onError={e => { e.target.style.display = 'none'; }} />;
}

function odd(jogoCompleto, lado) {
  const o = jogoCompleto?.odds?.resultado;
  if (!o) return null;
  return lado === 'casa' ? o.casa : o.fora;
}

function CartaoJogo({ confronto, jogosApi, onClick }) {
  const jogoCompleto = (jogosApi || []).find(j =>
    (j.casa?.nome === confronto.casa && j.fora?.nome === confronto.fora) ||
    (j.casa?.nome === confronto.fora && j.fora?.nome === confronto.casa)
  );
  const vazio = !confronto.casa && !confronto.fora;
  const oddCasa = odd(jogoCompleto, 'casa');
  const oddFora = odd(jogoCompleto, 'fora');

  return (
    <div
      className={`brk-jogo${vazio ? ' vazio' : ''}`}
      onClick={() => !vazio && jogoCompleto && onClick(jogoCompleto)}
    >
      <div className="brk-jogo-data">
        {confronto.data}{confronto.hora ? ` · ${confronto.hora}` : ''}
      </div>
      <div className="brk-time">
        <Flag nome={confronto.casa} />
        {confronto.casa
          ? <span className="brk-time-nome">{confronto.casa}</span>
          : <span className="brk-time-vazio">A definir</span>}
        {oddCasa && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#00e5a0', fontWeight: 700 }}>{parseFloat(oddCasa).toFixed(2)}</span>}
      </div>
      <div className="brk-divider" />
      <div className="brk-time">
        <Flag nome={confronto.fora} />
        {confronto.fora
          ? <span className="brk-time-nome">{confronto.fora}</span>
          : <span className="brk-time-vazio">A definir</span>}
        {oddFora && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#4d9fff', fontWeight: 700 }}>{parseFloat(oddFora).toFixed(2)}</span>}
      </div>
    </div>
  );
}

export default function Chaveamento({ jogos: jogosApi, onSelectJogo }) {
  const isMob = useIsMobile(768);
  const [faseAtiva, setFaseAtiva] = useState('todas');

  const handleClick = (jogoCompleto) => {
    if (onSelectJogo) onSelectJogo(jogoCompleto);
  };

  const fases = [
    ['todas', 'Todas as fases'],
    ['oitavas', 'Oitavas'],
    ['quartas', 'Quartas'],
    ['semis', 'Semifinal'],
    ['final', 'Final'],
  ];

  const grupos = { A: 'Chave A', B: 'Chave B', C: 'Chave C', D: 'Chave D' };

  return (
    <>
      <style>{S}</style>
      <div className="brk-wrap">
        <div className="brk-badges">
          <span className="brk-badge brk-badge-g">Copa do Mundo 2026</span>
          <span className="brk-badge brk-badge-d">Mata-mata</span>
        </div>
        <h1 className="brk-title" style={{ fontSize: isMob ? 24 : 30 }}>
          Chaveamento<br />
          <span style={{ color: '#00e5a0' }}>do mata-mata</span>
        </h1>
        <p className="brk-sub">
          Acompanhe o caminho de cada seleção até a final, com odds atualizadas para os confrontos já definidos.
        </p>

        <div className="brk-fasetabs">
          {fases.map(([v, l]) => (
            <button key={v} className={`brk-fasetab${faseAtiva === v ? ' on' : ''}`} onClick={() => setFaseAtiva(v)}>{l}</button>
          ))}
        </div>

        {/* ── FINAL E TERCEIRO LUGAR (sempre visível no topo) ── */}
        {(faseAtiva === 'todas' || faseAtiva === 'final') && (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
            <div className="brk-final-card" style={{ flex: 1, minWidth: 260 }}>
              <div className="brk-final-label">🏆 Grande final</div>
              <div className="brk-final-times">
                <div className="brk-final-time">
                  <Flag nome={FINAL.casa} size={40} />
                  <span className="brk-final-time-nome">{FINAL.casa || 'A definir'}</span>
                </div>
                <span className="brk-final-vs">VS</span>
                <div className="brk-final-time">
                  <Flag nome={FINAL.fora} size={40} />
                  <span className="brk-final-time-nome">{FINAL.fora || 'A definir'}</span>
                </div>
              </div>
              <div className="brk-final-data">{FINAL.data} às {FINAL.hora}</div>
            </div>
            <div className="brk-final-card" style={{ flex: 1, minWidth: 260, background: 'rgba(255,184,48,.05)', borderColor: 'rgba(255,184,48,.2)' }}>
              <div className="brk-final-label" style={{ color: '#ffb830' }}>🥉 Terceiro lugar</div>
              <div className="brk-final-times">
                <div className="brk-final-time">
                  <Flag nome={TERCEIRO.casa} size={40} />
                  <span className="brk-final-time-nome">{TERCEIRO.casa || 'A definir'}</span>
                </div>
                <span className="brk-final-vs">VS</span>
                <div className="brk-final-time">
                  <Flag nome={TERCEIRO.fora} size={40} />
                  <span className="brk-final-time-nome">{TERCEIRO.fora || 'A definir'}</span>
                </div>
              </div>
              <div className="brk-final-data">{TERCEIRO.data} às {TERCEIRO.hora}</div>
            </div>
          </div>
        )}

        {/* ── DESKTOP: bracket horizontal ── */}
        <div className="brk-desktop" style={{ marginTop: 24 }}>
          {(faseAtiva === 'todas' || faseAtiva === 'oitavas') && (
            <div className="brk-coluna">
              <div className="brk-coluna-titulo">Oitavas de final</div>
              {OITAVAS.map(c => <CartaoJogo key={c.id} confronto={c} jogosApi={jogosApi} onClick={handleClick} />)}
            </div>
          )}
          {(faseAtiva === 'todas' || faseAtiva === 'quartas') && (
            <div className="brk-coluna">
              <div className="brk-coluna-titulo">Quartas de final</div>
              {QUARTAS.map(c => <CartaoJogo key={c.id} confronto={c} jogosApi={jogosApi} onClick={handleClick} />)}
            </div>
          )}
          {(faseAtiva === 'todas' || faseAtiva === 'semis') && (
            <div className="brk-coluna">
              <div className="brk-coluna-titulo">Semifinal</div>
              {SEMIS.map(c => <CartaoJogo key={c.id} confronto={c} jogosApi={jogosApi} onClick={handleClick} />)}
            </div>
          )}
        </div>

        {/* ── MOBILE: lista por fase ── */}
        <div className="brk-mobile">
          {(faseAtiva === 'todas' || faseAtiva === 'oitavas') && (
            <div className="brk-mobile-fase">
              <div className="brk-mobile-titulo">Oitavas de final</div>
              {['A', 'B', 'C', 'D'].map(g => (
                <div key={g}>
                  <div className="brk-mobile-grupo">{grupos[g]}</div>
                  {OITAVAS.filter(c => c.lado === g).map(c => <CartaoJogo key={c.id} confronto={c} jogosApi={jogosApi} onClick={handleClick} />)}
                </div>
              ))}
            </div>
          )}
          {(faseAtiva === 'todas' || faseAtiva === 'quartas') && (
            <div className="brk-mobile-fase">
              <div className="brk-mobile-titulo">Quartas de final</div>
              {QUARTAS.map(c => <CartaoJogo key={c.id} confronto={c} jogosApi={jogosApi} onClick={handleClick} />)}
            </div>
          )}
          {(faseAtiva === 'todas' || faseAtiva === 'semis') && (
            <div className="brk-mobile-fase">
              <div className="brk-mobile-titulo">Semifinal</div>
              {SEMIS.map(c => <CartaoJogo key={c.id} confronto={c} jogosApi={jogosApi} onClick={handleClick} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
