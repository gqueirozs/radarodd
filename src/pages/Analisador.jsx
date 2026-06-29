import React, { useState } from 'react';
import { getLogo, getStats, getH2H } from '../data/statsDB';

/* ── utils ─────────────────────────────────────────── */
const fmt  = v => (!v && v !== 0 ? '—' : parseFloat(v).toFixed(2));
const pct  = v => (!v ? null : (100 / v).toFixed(1) + '%');
const evC  = ev => ev > 5 ? '#00e5a0' : ev > 0 ? '#ffb830' : '#6b7280';
const evLb = ev => ev > 10 ? 'Oportunidade forte' : ev > 5 ? 'Boa oportunidade' : ev > 0 ? 'Leve vantagem' : 'Sem valor';

/* ── sub-componentes ────────────────────────────────── */
function Divisor({ label }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase',
      letterSpacing: '.12em', marginBottom: 14, marginTop: 4,
      paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
      {label}
    </div>
  );
}

function StatBar({ label, val, max = 100, cor = 'var(--accent)' }) {
  const pct = Math.min(100, (val / max) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12,
        color: 'var(--text2)', marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{val}</span>
      </div>
      <div style={{ height: 5, background: 'var(--bg4)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: cor, borderRadius: 3,
          transition: 'width .6s ease' }} />
      </div>
    </div>
  );
}

function FormaJogo({ jogo }) {
  const cor = jogo.resultado === 'V' ? '#00e5a0' : jogo.resultado === 'E' ? '#ffb830' : '#ff4d6d';
  const label = jogo.resultado === 'V' ? 'Vitória' : jogo.resultado === 'E' ? 'Empate' : 'Derrota';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '9px 12px', borderRadius: 8, marginBottom: 6,
      background: cor + '0D', border: `1px solid ${cor}22` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: cor, flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>vs </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{jogo.adversario}</span>
          <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 8 }}>{jogo.data}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
          {jogo.placar}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: cor, textTransform: 'uppercase',
          letterSpacing: '.06em', minWidth: 44, textAlign: 'right' }}>{label}</span>
      </div>
    </div>
  );
}

function CartaoSugestao({ mercado, odd, ev, evText, principal }) {
  if (!odd || odd <= 1) return null;
  const cor = evC(ev);
  return (
    <div style={{ background: ev > 5 ? 'rgba(0,229,160,.06)' : ev > 0 ? 'rgba(255,184,48,.06)' : 'var(--bg3)',
      border: `1px solid ${ev > 5 ? 'rgba(0,229,160,.25)' : ev > 0 ? 'rgba(255,184,48,.25)' : 'var(--border)'}`,
      borderRadius: 12, padding: '16px 18px',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
      <div style={{ flex: 1 }}>
        {ev > 5 && (
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: cor,
            textTransform: 'uppercase', marginBottom: 7 }}>
            {principal ? '★ Melhor aposta' : '★ Sugerido'}
          </div>
        )}
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 5 }}>{mercado}</div>
        <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
          Probabilidade implícita: {pct(odd)}
          {' · '}<span style={{ color: cor }}>{evLb(ev)}</span>
          {evText ? ` · ${evText}` : ''}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>
          {fmt(odd)}
        </div>
        {ev !== undefined && (
          <div style={{ fontSize: 12, fontWeight: 700, color: cor, marginTop: 3 }}>
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{pct(odd)} impl.</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
          {fmt(odd)}
        </div>
        {ev !== undefined && (
          <div style={{ fontSize: 11, color: evC(ev), fontWeight: 600, marginTop: 2 }}>
            {ev > 0 ? '+' : ''}{ev?.toFixed(1)}% EV
          </div>
        )}
      </div>
    </div>
  );
}

function LogoTime({ nome, lado = 'esquerda' }) {
  const logo = getLogo(nome);
  const style = {
    width: 52, height: 52, borderRadius: 8,
    objectFit: 'cover', border: '2px solid var(--border)',
    background: 'var(--bg4)',
  };
  if (!logo) return (
    <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22, fontWeight: 700, color: 'var(--text3)' }}>
      {nome?.charAt(0) || '?'}
    </div>
  );
  return <img src={logo} alt={nome} style={style} onError={e => { e.target.style.display = 'none'; }} />;
}

/* ── PÁGINA PRINCIPAL ────────────────────────────────── */
export default function Analisador({ jogo, onVoltar }) {
  const [aba, setAba] = useState('sugestoes');
  if (!jogo) return null;

  const o   = jogo.odds || {};
  const vbs = (jogo.valueBets || []).sort((a, b) => (b.ev || 0) - (a.ev || 0));
  const evM = {};
  for (const v of vbs) evM[v.mercado] = v.ev;

  const statsCasa = getStats(jogo.casa.nome);
  const statsFora = getStats(jogo.fora.nome);
  const h2h       = getH2H(jogo.casa.nome, jogo.fora.nome);

  // Probabilidades normalizadas para barra visual
  let pCasa = 50, pEmp = 25, pFora = 25;
  if (o.resultado?.casa && o.resultado?.fora) {
    const rc = 1 / o.resultado.casa;
    const re = o.resultado.empate ? 1 / o.resultado.empate : 0;
    const rf = 1 / o.resultado.fora;
    const tot = rc + re + rf;
    pCasa = (rc / tot * 100).toFixed(0);
    pEmp  = (re / tot * 100).toFixed(0);
    pFora = (rf / tot * 100).toFixed(0);
  }

  const abas = [
    { id: 'sugestoes', label: '★ Sugestões' },
    { id: 'estatisticas', label: 'Estatísticas' },
    { id: 'mercados', label: 'Mercados' },
    { id: 'placares', label: 'Placares' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>

      {/* Voltar */}
      <button onClick={onVoltar} style={{ background: 'none', border: 'none', color: 'var(--accent)',
        cursor: 'pointer', fontSize: 13, padding: 0, marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
        ← Voltar para jogos
      </button>

      {/* Header do jogo */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 28, overflow: 'hidden' }}>

        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 18 }}>
          {jogo.competicao} · {jogo.data} às {jogo.hora}
          {jogo.estadio && <span> · {jogo.estadio}</span>}
        </div>

        {/* Times + logos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          {/* Casa */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
            <LogoTime nome={jogo.casa.nome} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
                color: 'var(--text)', lineHeight: 1.1 }}>{jogo.casa.nome}</div>
              {statsCasa && (
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                  {statsCasa.gols_marcados} gols · {statsCasa.vitorias}V {statsCasa.empates}E {statsCasa.derrotas}D
                  {statsCasa.ranking_fifa && ` · #${statsCasa.ranking_fifa} FIFA`}
                </div>
              )}
            </div>
          </div>

          {/* VS central */}
          <div style={{ textAlign: 'center', padding: '0 24px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
              color: 'var(--text3)', letterSpacing: '.15em' }}>VS</div>
            {o.resultado?.casa && (
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#00e5a0' }}>
                    {fmt(o.resultado.casa)}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>CASA</div>
                </div>
                {o.resultado.empate && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--text2)' }}>
                      {fmt(o.resultado.empate)}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>EMP</div>
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#4d9fff' }}>
                    {fmt(o.resultado.fora)}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>FORA</div>
                </div>
              </div>
            )}
          </div>

          {/* Fora */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
                color: 'var(--text)', lineHeight: 1.1 }}>{jogo.fora.nome}</div>
              {statsFora && (
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                  {statsFora.gols_marcados} gols · {statsFora.vitorias}V {statsFora.empates}E {statsFora.derrotas}D
                  {statsFora.ranking_fifa && ` · #${statsFora.ranking_fifa} FIFA`}
                </div>
              )}
            </div>
            <LogoTime nome={jogo.fora.nome} lado="direita" />
          </div>
        </div>

        {/* Barra de probabilidade */}
        <div>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 10, marginBottom: 10 }}>
            <div style={{ width: pCasa + '%', background: 'linear-gradient(90deg,#00e5a0,#00c88a)', transition: 'width .6s' }} />
            <div style={{ width: pEmp + '%', background: 'var(--bg4)', margin: '0 2px' }} />
            <div style={{ width: pFora + '%', background: 'linear-gradient(90deg,#4d9fff,#2979d9)', transition: 'width .6s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: '#00e5a0', fontWeight: 600 }}>{jogo.casa.nome} {pCasa}%</span>
            <span style={{ color: 'var(--text3)' }}>Empate {pEmp}%</span>
            <span style={{ color: '#4d9fff', fontWeight: 600 }}>{jogo.fora.nome} {pFora}%</span>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {abas.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{ padding: '8px 18px', borderRadius: 8,
            fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all .15s',
            background: aba === a.id ? 'var(--accent)' : 'var(--bg3)',
            color: aba === a.id ? '#000' : 'var(--text2)' }}>{a.label}</button>
        ))}
      </div>

      {/* ── ABA SUGESTÕES ── */}
      {aba === 'sugestoes' && (
        <div>
          {vbs.filter(v => v.ev > 0).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg2)',
              borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                Sem oportunidades no momento
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
                As odds atuais não apresentam valor esperado positivo para este jogo.
                Confira os mercados na aba "Mercados".
              </div>
            </div>
          ) : (
            <div>
              <div style={{ background: 'rgba(0,229,160,.05)', border: '1px solid rgba(0,229,160,.15)',
                borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 13,
                color: 'var(--text2)', lineHeight: 1.6 }}>
                💡 Sugestões ordenadas por <strong style={{ color: 'var(--text)' }}>valor esperado (EV)</strong> —
                diferença entre a probabilidade real estimada e a implícita na odd.
                EV &gt; 5% = oportunidade estatisticamente favorável.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {vbs.filter(v => v.ev > 0).map((vb, i) => (
                  <CartaoSugestao key={i} mercado={vb.mercado} odd={vb.odd}
                    ev={vb.ev} evText={vb.descricao} principal={i === 0} />
                ))}
              </div>
              <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--bg2)',
                borderRadius: 12, border: '1px solid var(--border)', fontSize: 12,
                color: 'var(--text3)', lineHeight: 1.6 }}>
                ⚠️ EV positivo indica vantagem estatística, não garantia de resultado.
                Aposte com responsabilidade. Os dados são atualizados a cada 5 minutos.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ABA ESTATÍSTICAS ── */}
      {aba === 'estatisticas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Comparativo fase de grupos */}
          {(statsCasa || statsFora) && (
            <div>
              <Divisor label="Fase de grupos — Copa 2026" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  [jogo.casa.nome, statsCasa, '#00e5a0'],
                  [jogo.fora.nome, statsFora, '#4d9fff'],
                ].map(([nome, st, cor]) => st && (
                  <div key={nome} style={{ background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: 14, padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <LogoTime nome={nome} />
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{nome}</div>
                    </div>

                    {/* Números chave */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
                      {[
                        { label: 'Gols marcados', val: st.gols_marcados, cor },
                        { label: 'Gols sofridos', val: st.gols_sofridos, cor: '#ff4d6d' },
                        { label: 'Ranking FIFA', val: `#${st.ranking_fifa}`, cor: 'var(--text2)' },
                      ].map(({ label, val, cor: c }) => (
                        <div key={label} style={{ textAlign: 'center', background: 'var(--bg3)',
                          borderRadius: 8, padding: '10px 6px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: c }}>
                            {val}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, lineHeight: 1.3 }}>{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Barras */}
                    <StatBar label="Posse de bola média" val={`${st.posse_media}%`} max={70} cor={cor} />
                    <StatBar label="Chutes a gol por jogo" val={st.chutes_gol_media} max={12} cor={cor} />
                    <StatBar label="Escanteios por jogo" val={st.escanteios_media} max={10} cor={cor} />

                    {/* Artilheiro */}
                    {st.artilheiro_copa && (
                      <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--bg3)',
                        borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase',
                            letterSpacing: '.08em', marginBottom: 2 }}>Artilheiro na Copa</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                            {st.artilheiro_copa.nome}
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: cor }}>
                          {st.artilheiro_copa.gols} ⚽
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Forma na Copa */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[[jogo.casa.nome, statsCasa], [jogo.fora.nome, statsFora]].map(([nome, st]) => st?.forma_copa && (
              <div key={nome}>
                <Divisor label={`Últimos jogos — ${nome}`} />
                {st.forma_copa.map((j, i) => <FormaJogo key={i} jogo={j} />)}
              </div>
            ))}
          </div>

          {/* Head to Head */}
          {h2h && (
            <div>
              <Divisor label="Histórico de confrontos diretos" />
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '20px 24px' }}>

                {/* Resumo */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0,
                  textAlign: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 800, color: '#00e5a0' }}>
                      {h2h[Object.keys(h2h).find(k => k !== 'total' && k !== 'empates' && k !== 'confrontos' && k !== 'nota' && !k.includes('gols')) || 'casa']}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{jogo.casa.nome}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 800, color: 'var(--text2)' }}>
                      {h2h.empates || 0}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Empates</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 800, color: '#4d9fff' }}>
                      {h2h[Object.keys(h2h).filter(k => !['total','empates','confrontos','nota'].includes(k) && !k.includes('gols')).slice(-1)[0]] || 0}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{jogo.fora.nome}</div>
                  </div>
                </div>

                {/* Nota */}
                {h2h.nota && (
                  <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 14px',
                    fontSize: 12, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.5 }}>
                    📊 {h2h.nota}
                  </div>
                )}

                {/* Confrontos */}
                {h2h.confrontos?.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)', minWidth: 70 }}>{c.data}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{c.competicao}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
                      color: 'var(--text)', minWidth: 36, textAlign: 'center' }}>{c.placar}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, minWidth: 90, textAlign: 'right',
                      color: c.vencedor === jogo.casa.nome || c.vencedor === 'Brasil' || c.vencedor === 'EUA' ? '#00e5a0' :
                             c.vencedor === 'Empate' ? 'var(--text3)' : '#4d9fff' }}>
                      {c.vencedor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contexto estatístico geral */}
          <div>
            <Divisor label="Contexto da Copa 2026" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { label: 'Média de gols/jogo', val: '2.99', desc: 'Maior desde 1958', cor: '#00e5a0' },
                { label: 'Jogos com +2.5 gols', val: '61%', desc: 'Fase de grupos', cor: '#ffb830' },
                { label: 'Placares decisivos', val: '78%', desc: 'Resolvidos em 90min', cor: '#4d9fff' },
              ].map(({ label, val, desc, cor }) => (
                <div key={label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800, color: cor }}>
                    {val}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginTop: 6 }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ABA MERCADOS ── */}
      {aba === 'mercados' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <Divisor label="Resultado (90 minutos)" />
            <LinhaMercado label={`${jogo.casa.nome} vence`} odd={o.resultado?.casa} ev={evM[`${jogo.casa.nome} vence`]} />
            <LinhaMercado label="Empate" odd={o.resultado?.empate} ev={evM['Empate']} />
            <LinhaMercado label={`${jogo.fora.nome} vence`} odd={o.resultado?.fora} ev={evM[`${jogo.fora.nome} vence`]} />
          </div>
          {o.qualificar?.casa && (
            <div>
              <Divisor label="Para se classificar (com prorrogação e pênaltis)" />
              <LinhaMercado label={`${jogo.casa.nome} avança`} odd={o.qualificar?.casa} />
              <LinhaMercado label={`${jogo.fora.nome} avança`} odd={o.qualificar?.fora} />
            </div>
          )}
          <div>
            <Divisor label={`Total de gols (linha ${o.totalGols?.linha || 2.5})`} />
            <LinhaMercado label={`Mais de ${o.totalGols?.linha || 2.5} gols`} odd={o.totalGols?.mais} ev={evM[`Mais de ${o.totalGols?.linha || 2.5} gols`]} />
            <LinhaMercado label={`Menos de ${o.totalGols?.linha || 2.5} gols`} odd={o.totalGols?.menos} ev={evM[`Menos de ${o.totalGols?.linha || 2.5} gols`]} />
          </div>
          <div>
            <Divisor label="Ambas as equipes marcam" />
            <LinhaMercado label="Sim" odd={o.ambasMarcam?.sim} ev={evM['Ambas marcam — Sim']} />
            <LinhaMercado label="Não" odd={o.ambasMarcam?.nao} ev={evM['Ambas marcam — Não']} />
          </div>
          {o.primeiroGol?.casa && (
            <div>
              <Divisor label="Primeiro gol" />
              <LinhaMercado label={`${jogo.casa.nome} marca primeiro`} odd={o.primeiroGol?.casa} ev={evM[`${jogo.casa.nome} marca primeiro`]} />
              <LinhaMercado label="Nenhum gol" odd={o.primeiroGol?.nenhum} />
              <LinhaMercado label={`${jogo.fora.nome} marca primeiro`} odd={o.primeiroGol?.fora} />
            </div>
          )}
          {o.chanceDupla?.casaEmpate && (
            <div>
              <Divisor label="Chance dupla" />
              <LinhaMercado label={`${jogo.casa.nome} ou Empate`} odd={o.chanceDupla?.casaEmpate} />
              <LinhaMercado label={`${jogo.casa.nome} ou ${jogo.fora.nome}`} odd={o.chanceDupla?.casaFora} />
              <LinhaMercado label={`Empate ou ${jogo.fora.nome}`} odd={o.chanceDupla?.empataFora} />
            </div>
          )}
          {o.handicap?.length > 0 && (
            <div>
              <Divisor label={`Handicap asiático — ${jogo.casa.nome}`} />
              {o.handicap.map((h, i) => <LinhaMercado key={i} label={`${jogo.casa.nome} ${h.linha}`} odd={h.odd} />)}
            </div>
          )}
        </div>
      )}

      {/* ── ABA PLACARES ── */}
      {aba === 'placares' && (
        <div>
          {(!o.placares || o.placares.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg2)',
              borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text3)', fontSize: 14 }}>Odds de placar não disponíveis.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {['casa', 'empate', 'fora'].map(time => {
                const label = time === 'casa' ? jogo.casa.nome : time === 'fora' ? jogo.fora.nome : 'Empate';
                const cor   = time === 'casa' ? '#00e5a0' : time === 'fora' ? '#4d9fff' : 'var(--text3)';
                const pl    = (o.placares || []).filter(p => p.time === time).sort((a, b) => a.odd - b.odd);
                return (
                  <div key={time}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: cor, marginBottom: 12,
                      textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</div>
                    {pl.map((p, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                        padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
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
          )}
        </div>
      )}
    </div>
  );
}
