import React, { useState, useEffect } from 'react';
import { getLogo } from '../data/statsDB';
import { fetchMataMata } from '../data/api';
import { useIsMobile } from '../hooks/useIsMobile';

const S = `
.brk-wrap { max-width: 1320px; margin: 0 auto; padding: 28px 16px 56px; }
.brk-badges { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.brk-badge { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; }
.brk-badge-g { color: #00e5a0; background: rgba(0,229,160,.1); border: 1px solid rgba(0,229,160,.2); }
.brk-badge-d { color: #9aabc7; background: #141c2a; border: 1px solid rgba(255,255,255,.07); }
.brk-badge-live { color: #ff4d6d; background: rgba(255,77,109,.1); border: 1px solid rgba(255,77,109,.25); animation: brkpulse 1.6s infinite; }
@keyframes brkpulse { 0%,100%{ opacity:1 } 50%{ opacity:.55 } }
.brk-title { font-family: var(--font-display); font-weight: 800; color: #f0f4ff; line-height: 1.15; letter-spacing: -.5px; margin-bottom: 10px; }
.brk-sub { color: #9aabc7; font-size: 13px; line-height: 1.6; max-width: 520px; margin-bottom: 8px; }
.brk-atualizado { color: #9aabc7; font-size: 11px; margin-bottom: 24px; }

.brk-fasetabs { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
.brk-fasetab { padding: 7px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid rgba(255,255,255,.07); cursor: pointer; transition: all .15s; background: #0f1520; color: #c6d1e6; }
.brk-fasetab.on { background: #00e5a0; color: #000; border-color: transparent; }

.brk-desktop { display: flex; flex-direction: column; gap: 36px; }
.brk-chave-nome { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.brk-chave-nome span { font-size: 12px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #00e5a0; }
.brk-chave-nome::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(0,229,160,.3), transparent); }
.brk-chave:nth-child(2) .brk-chave-nome span { color: #4d9fff; }
.brk-chave:nth-child(2) .brk-chave-nome::after { background: linear-gradient(90deg, rgba(77,159,255,.3), transparent); }

.brk-arvore { display: grid; grid-template-columns: repeat(4, minmax(215px, 1fr)); gap: 10px 20px; overflow-x: auto; padding-bottom: 8px; }
.brk-arvore .brk-jogo { margin-bottom: 0; align-self: center; width: 100%; }
.brk-cabecalhos { display: grid; grid-template-columns: repeat(4, minmax(215px, 1fr)); gap: 0 20px; margin-bottom: 10px; }
.brk-coluna-titulo { font-size: 10px; font-weight: 700; color: #9aabc7; text-transform: uppercase; letter-spacing: .1em; text-align: center; }

.brk-jogo { background: #0f1520; border: 1px solid rgba(255,255,255,.07); border-radius: 12px; padding: 10px 12px; margin-bottom: 16px; transition: all .15s; }
.brk-jogo.clicavel { cursor: pointer; }
.brk-jogo.clicavel:hover { background: #141c2a; border-color: rgba(0,229,160,.25); transform: translateY(-1px); }
.brk-jogo.live { border-color: rgba(255,77,109,.35); }
.brk-jogo.vazio { opacity: .55; }
.brk-jogo-meta { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 10px; color: #9aabc7; margin-bottom: 8px; }
.brk-jogo-meta .fim  { color: #c6d1e6; font-weight: 700; letter-spacing: .06em; }
.brk-jogo-meta .live { color: #ff4d6d; font-weight: 800; letter-spacing: .06em; animation: brkpulse 1.6s infinite; }
.brk-time { display: flex; align-items: center; gap: 8px; padding: 5px 0; }
.brk-time-nome { font-size: 13px; font-weight: 600; color: #f0f4ff; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.brk-time.perdedor .brk-time-nome { color: #9aabc7; font-weight: 500; }
.brk-time-vazio { font-size: 13px; color: #9aabc7; font-style: italic; flex: 1; }
.brk-placar { font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: #f0f4ff; min-width: 18px; text-align: right; }
.brk-time.perdedor .brk-placar { color: #9aabc7; }
.brk-pen { font-size: 10px; color: #c6d1e6; font-family: var(--font-mono); }
.brk-odd { font-family: var(--font-mono); font-size: 12px; font-weight: 700; }
.brk-flag { width: 22px; height: 22px; border-radius: 5px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255,255,255,.08); }
.brk-flag-ph { width: 22px; height: 22px; border-radius: 5px; background: #1c2537; border: 1px solid rgba(255,255,255,.08); flex-shrink: 0; }
.brk-divider { height: 1px; background: rgba(255,255,255,.07); margin: 2px 0; }

.brk-mobile-fase { margin-bottom: 28px; }
.brk-mobile-titulo { font-size: 13px; font-weight: 700; color: #00e5a0; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,.07); }

.brk-final-card { background: linear-gradient(135deg, rgba(0,229,160,.08), rgba(0,176,255,.05)); border: 1.5px solid rgba(0,229,160,.25); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 20px; }
.brk-final-label { font-size: 11px; font-weight: 700; color: #00e5a0; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 14px; }
.brk-final-times { display: flex; align-items: center; justify-content: center; gap: 16px; }
.brk-final-time { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 90px; }
.brk-final-time-nome { font-size: 15px; font-weight: 800; font-family: var(--font-display); color: #f0f4ff; }
.brk-final-vs { font-size: 13px; color: #9aabc7; font-weight: 700; }
.brk-final-data { font-size: 11px; color: #9aabc7; margin-top: 12px; }

@media (max-width: 768px) { .brk-desktop { display: none; } }
@media (min-width: 769px) { .brk-mobile  { display: none; } }
`;

const FASES_META = [
  ['segunda',  'Segunda rodada'],
  ['oitavas',  'Oitavas de final'],
  ['quartas',  'Quartas de final'],
  ['semis',    'Semifinal'],
];

function Flag({ nome, size = 22 }) {
  const logo = nome && nome !== 'A definir' ? getLogo(nome) : null;
  if (!logo) return <div className="brk-flag-ph" style={{ width: size, height: size }} />;
  return <img src={logo} alt={nome} className="brk-flag" style={{ width: size, height: size }} onError={e => { e.target.style.display = 'none'; }} />;
}

function fmtData(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' · ' +
         d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function LadoTime({ t, jogo, corOdd, oddVal }) {
  const definido = t.nome && t.nome !== 'A definir';
  const encerrado = jogo.status === 'encerrado';
  const perdeu = encerrado && definido && !t.vencedor &&
    (jogo.casa.vencedor || jogo.fora.vencedor); // só marca perdedor se houve vencedor
  return (
    <div className={`brk-time${perdeu ? ' perdedor' : ''}`}>
      <Flag nome={definido ? t.nome : null} />
      {definido
        ? <span className="brk-time-nome">{t.nome}</span>
        : <span className="brk-time-vazio">A definir</span>}
      {jogo.status !== 'agendado' && t.placar != null && (
        <span className="brk-placar">
          {t.placar}{t.penaltis != null && <span className="brk-pen"> ({t.penaltis})</span>}
        </span>
      )}
      {jogo.status === 'agendado' && oddVal && (
        <span className="brk-odd" style={{ color: corOdd }}>{parseFloat(oddVal).toFixed(2)}</span>
      )}
    </div>
  );
}

function CartaoJogo({ jogo, jogosApi, onClick }) {
  const definido = jogo.casa.nome !== 'A definir' || jogo.fora.nome !== 'A definir';
  const jogoCompleto = jogo.jogoId ? (jogosApi || []).find(j => j.id === jogo.jogoId) : null;
  const clicavel = !!jogoCompleto;
  return (
    <div
      className={`brk-jogo${clicavel ? ' clicavel' : ''}${jogo.status === 'ao-vivo' ? ' live' : ''}${definido ? '' : ' vazio'}`}
      onClick={() => clicavel && onClick(jogoCompleto)}
      title={clicavel ? 'Ver análise completa' : undefined}
    >
      <div className="brk-jogo-meta">
        {jogo.status === 'ao-vivo'   && <span className="live">● AO VIVO{jogo.relogio ? ` ${jogo.relogio}` : ''}</span>}
        {jogo.status === 'encerrado' && <span className="fim">FIM{jogo.prorrogacao ? ' · PRORR.' : ''}{jogo.casa.penaltis != null ? ' · PÊN.' : ''}</span>}
        {jogo.status === 'agendado'  && <span>{fmtData(jogo.data)}</span>}
      </div>
      <LadoTime t={jogo.casa} jogo={jogo} corOdd="#00e5a0" oddVal={jogo.odds?.casa} />
      <div className="brk-divider" />
      <LadoTime t={jogo.fora} jogo={jogo} corOdd="#4d9fff" oddVal={jogo.odds?.fora} />
    </div>
  );
}

function CardFinal({ jogo, label, emoji, cor }) {
  const nome = t => (t?.nome && t.nome !== 'A definir') ? t.nome : 'A definir';
  return (
    <div className="brk-final-card" style={cor ? { background: 'rgba(255,184,48,.05)', borderColor: 'rgba(255,184,48,.2)' } : undefined}>
      <div className="brk-final-label" style={cor ? { color: cor } : undefined}>{emoji} {label}</div>
      <div className="brk-final-times">
        <div className="brk-final-time">
          <Flag nome={jogo?.casa?.nome !== 'A definir' ? jogo?.casa?.nome : null} size={40} />
          <span className="brk-final-time-nome">{nome(jogo?.casa)}</span>
          {jogo?.status !== 'agendado' && jogo?.casa?.placar != null && <span className="brk-placar" style={{ fontSize: 20 }}>{jogo.casa.placar}</span>}
        </div>
        <span className="brk-final-vs">VS</span>
        <div className="brk-final-time">
          <Flag nome={jogo?.fora?.nome !== 'A definir' ? jogo?.fora?.nome : null} size={40} />
          <span className="brk-final-time-nome">{nome(jogo?.fora)}</span>
          {jogo?.status !== 'agendado' && jogo?.fora?.placar != null && <span className="brk-placar" style={{ fontSize: 20 }}>{jogo.fora.placar}</span>}
        </div>
      </div>
      <div className="brk-final-data">{jogo ? fmtData(jogo.data) : 'Data a definir'}</div>
    </div>
  );
}

export default function Chaveamento({ jogos: jogosApi, onSelectJogo }) {
  const isMob = useIsMobile(768);
  const [faseAtiva, setFaseAtiva] = useState('todas');
  const [dados, setDados] = useState(null);
  const [status, setStatus] = useState('carregando'); // carregando | ok | erro

  useEffect(() => {
    let ativo = true;
    const carregar = () => fetchMataMata().then(d => {
      if (!ativo) return;
      if (d?.fases) { setDados(d); setStatus('ok'); }
      else if (!dados) setStatus('erro');
    });
    carregar();
    const timer = setInterval(carregar, 90 * 1000); // acompanha placar ao vivo
    return () => { ativo = false; clearInterval(timer); };
  }, []);

  const handleClick = j => { if (onSelectJogo) onSelectJogo(j); };
  const fases = dados?.fases || {};
  const temAoVivo = Object.values(fases).some(f => (f || []).some(j => j.status === 'ao-vivo'));

  const abas = [
    ['todas', 'Todas as fases'],
    ...FASES_META.map(([id, l]) => [id, l.replace(' de final', '')]),
    ['final', 'Final'],
  ];

  return (
    <>
      <style>{S}</style>
      <div className="brk-wrap">
        <div className="brk-badges">
          <span className="brk-badge brk-badge-g">Copa do Mundo 2026</span>
          <span className="brk-badge brk-badge-d">Mata-mata</span>
          {temAoVivo && <span className="brk-badge brk-badge-live">● Ao vivo</span>}
        </div>
        <h1 className="brk-title" style={{ fontSize: isMob ? 24 : 30 }}>
          Chaveamento<br />
          <span style={{ color: '#00e5a0' }}>do mata-mata</span>
        </h1>
        <p className="brk-sub">
          Da segunda rodada à final: placares reais, jogos ao vivo e odds atualizadas para os confrontos já definidos.
        </p>
        {dados?.atualizadoEm && (
          <div className="brk-atualizado">
            Atualização automática · fonte ESPN · {new Date(dados.atualizadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}

        <div className="brk-fasetabs">
          {abas.map(([v, l]) => (
            <button key={v} className={`brk-fasetab${faseAtiva === v ? ' on' : ''}`} onClick={() => setFaseAtiva(v)}>{l}</button>
          ))}
        </div>

        {status === 'carregando' && (
          <div style={{ textAlign: 'center', padding: '56px 0', color: '#9aabc7', fontSize: 14 }}>
            Montando o chaveamento com os resultados reais…
          </div>
        )}
        {status === 'erro' && (
          <div style={{ padding: '14px 16px', background: 'rgba(255,184,48,.06)', border: '1px solid rgba(255,184,48,.2)', borderRadius: 12, fontSize: 13, color: '#c6d1e6' }}>
            Não foi possível carregar o chaveamento agora. Tente novamente em instantes.
          </div>
        )}

        {status === 'ok' && (
          <>
            {/* Final e 3º lugar em destaque */}
            {(faseAtiva === 'todas' || faseAtiva === 'final') && (
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <CardFinal jogo={fases.final?.[0]} label="Grande final" emoji="🏆" />
                </div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <CardFinal jogo={fases.terceiro?.[0]} label="Terceiro lugar" emoji="🥉" cor="#ffb830" />
                </div>
              </div>
            )}

            {/* Desktop: 2 chaves em árvore */}
            <div className="brk-desktop" style={{ marginTop: 24 }}>
              {(dados?.chaves || []).map((chave, ci) => (faseAtiva === 'todas' || ['segunda','oitavas','quartas','semis'].includes(faseAtiva)) && (
                <div className="brk-chave" key={chave.nome}>
                  <div className="brk-chave-nome"><span>{chave.nome}</span></div>
                  <div className="brk-cabecalhos">
                    <div className="brk-coluna-titulo">Segunda rodada</div>
                    <div className="brk-coluna-titulo">Oitavas</div>
                    <div className="brk-coluna-titulo">Quartas</div>
                    <div className="brk-coluna-titulo">Semifinal</div>
                  </div>
                  <div className="brk-arvore" style={{ gridTemplateRows: 'repeat(8, minmax(0, auto))' }}>
                    {/* Segunda rodada: 8 slots, 1 linha cada */}
                    {chave.segunda.map((j, i) => (
                      <div key={`s${i}`} style={{ gridColumn: 1, gridRow: i + 1, display:'flex' }}>
                        {j
                          ? <CartaoJogo jogo={j} jogosApi={jogosApi} onClick={handleClick} />
                          : <div className="brk-jogo vazio" style={{ width:'100%' }}><div className="brk-jogo-meta">—</div></div>}
                      </div>
                    ))}
                    {/* Oitavas: 4 slots, 2 linhas cada */}
                    {chave.oitavas.map((j, i) => (
                      <div key={`o${i}`} style={{ gridColumn: 2, gridRow: `${i * 2 + 1} / span 2`, display:'flex', alignItems:'center' }}>
                        {j
                          ? <CartaoJogo jogo={j} jogosApi={jogosApi} onClick={handleClick} />
                          : <div className="brk-jogo vazio" style={{ width:'100%' }}><div className="brk-jogo-meta">A definir</div></div>}
                      </div>
                    ))}
                    {/* Quartas: 2 slots, 4 linhas cada */}
                    {chave.quartas.map((j, i) => (
                      <div key={`q${i}`} style={{ gridColumn: 3, gridRow: `${i * 4 + 1} / span 4`, display:'flex', alignItems:'center' }}>
                        {j
                          ? <CartaoJogo jogo={j} jogosApi={jogosApi} onClick={handleClick} />
                          : <div className="brk-jogo vazio" style={{ width:'100%' }}><div className="brk-jogo-meta">A definir</div></div>}
                      </div>
                    ))}
                    {/* Semifinal: 1 slot, 8 linhas */}
                    <div style={{ gridColumn: 4, gridRow: '1 / span 8', display:'flex', alignItems:'center' }}>
                      {chave.semi
                        ? <CartaoJogo jogo={chave.semi} jogosApi={jogosApi} onClick={handleClick} />
                        : <div className="brk-jogo vazio" style={{ width:'100%' }}><div className="brk-jogo-meta">A definir</div></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: lista por fase */}
            <div className="brk-mobile">
              {FASES_META.map(([id, titulo]) => (faseAtiva === 'todas' || faseAtiva === id) && (fases[id] || []).length > 0 && (
                <div className="brk-mobile-fase" key={id}>
                  <div className="brk-mobile-titulo">{titulo}</div>
                  {(fases[id] || []).map(j => <CartaoJogo key={j.eventoId} jogo={j} jogosApi={jogosApi} onClick={handleClick} />)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
