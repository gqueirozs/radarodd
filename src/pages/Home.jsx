import React, { useState } from 'react';
import { getLogo, getStats } from '../data/statsDB';
import { useIsMobile } from '../hooks/useIsMobile';

/* ─── Perfil de apostador ───────────────────────────────────────────
   CONSERVADOR → EV > 8% + odd baixa (<2.5) = menor risco, retorno menor
   MODERADO    → EV > 5%  = padrão
   ARROJADO    → EV > 0%  + odd alta (>3.0) = maior risco, retorno maior
*/
const PERFIS = {
  conservador: { label: 'Conservador', emoji: '🛡️', desc: 'Odds baixas, mais seguro', evMin: 5,  oddMax: 2.5,  oddMin: 0   },
  moderado:    { label: 'Moderado',    emoji: '⚖️', desc: 'Equilíbrio risco/retorno', evMin: 5,  oddMax: 99,   oddMin: 0   },
  arrojado:    { label: 'Arrojado',    emoji: '🔥', desc: 'Odds altas, maior retorno', evMin: 3, oddMax: 99,   oddMin: 2.5 },
};

function filtraParaPerfil(vbs, perfil) {
  const p = PERFIS[perfil];
  return vbs.filter(v => {
    if (v.ev < p.evMin) return false;
    if (perfil === 'conservador' && v.odd > p.oddMax) return false;
    if (perfil === 'arrojado'    && v.odd < p.oddMin) return false;
    return true;
  });
}

const S = `
.hw { max-width: 860px; margin: 0 auto; padding: 28px 16px 56px; }
.hbadges { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.hbadge  { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; }
.hbadge-g { color: #00e5a0; background: rgba(0,229,160,.1); border: 1px solid rgba(0,229,160,.2); }
.hbadge-d { color: #9aabc7; background: #141c2a; border: 1px solid rgba(255,255,255,.07); }
.htitle { font-family: var(--font-display); font-weight: 800; color: #f0f4ff; line-height: 1.15; letter-spacing: -.5px; margin-bottom: 10px; }
.hsub   { color: #9aabc7; font-size: 13px; line-height: 1.6; max-width: 480px; }

/* Filtros de data */
.hfilters { display: flex; gap: 6px; margin-bottom: 0; flex-wrap: wrap; }
.hfilter  { padding: 7px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid rgba(255,255,255,.07); cursor: pointer; transition: all .15s; background: #0f1520; color: #c6d1e6; }
.hfilter.on { background: #00e5a0; color: #000; border-color: transparent; }

/* Perfis */
.hperfis { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.hperfil {
  flex: 1; min-width: 100px; padding: 10px 14px; border-radius: 12px; cursor: pointer;
  border: 1.5px solid rgba(255,255,255,.07); background: #0f1520;
  transition: all .2s; text-align: center;
}
.hperfil.on {
  border-color: #00e5a0;
  background: rgba(0,229,160,.07);
}
.hperfil-emoji { font-size: 18px; margin-bottom: 4px; }
.hperfil-nome  { font-size: 12px; font-weight: 700; color: #f0f4ff; }
.hperfil-desc  { font-size: 10px; color: #9aabc7; margin-top: 2px; }

@keyframes hpulse { 0%,100%{ opacity:1 } 50%{ opacity:.55 } }
.hlive { animation: hpulse 1.6s infinite; }

/* Botão de jogos futuros (recolhidos por padrão) */
.hfuturos {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 16px; margin-bottom: 20px;
  background: #0f1520; border: 1px dashed rgba(255,255,255,.12); border-radius: 12px;
  color: #c6d1e6; font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all .15s;
}
.hfuturos:hover { border-color: rgba(0,229,160,.35); color: #00e5a0; background: rgba(0,229,160,.04); }
.hfuturos-seta { font-size: 11px; }

/* Timeline por dia */
.hgrupo { margin-bottom: 24px; }
.hgrupo:last-child { margin-bottom: 0; }
.hdia {
  position: sticky; top: 56px; z-index: 50;
  display: flex; align-items: center; gap: 12px;
  padding: 10px 2px;
  background: rgba(9,13,20,.92); backdrop-filter: blur(12px);
  margin-bottom: 10px;
}
.hdia-num { font-family: var(--font-mono); font-size: 26px; font-weight: 700; color: #f0f4ff; line-height: 1; letter-spacing: -1px; }
.hdia-col { display: flex; flex-direction: column; gap: 1px; }
.hdia-sem { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #c6d1e6; }
.hdia-mes { font-size: 10px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: #9aabc7; }
.hdia-tag { font-size: 10px; font-weight: 800; letter-spacing: .1em; padding: 3px 9px; border-radius: 20px; }
.hdia-tag.hoje   { color: #00e5a0; background: rgba(0,229,160,.1);  border: 1px solid rgba(0,229,160,.25); }
.hdia-tag.amanha { color: #4d9fff; background: rgba(77,159,255,.1); border: 1px solid rgba(77,159,255,.25); }
.hdia-linha { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,.1), transparent); }
.hdia-qtd { font-size: 11px; color: #9aabc7; font-weight: 600; white-space: nowrap; }
.htime-hora { font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: #c3cfe6; }

/* Cards */
.hcards { display: flex; flex-direction: column; gap: 10px; }
.hcard  { background: #0f1520; border-radius: 16px; cursor: pointer; transition: background .2s, transform .2s, box-shadow .2s; overflow: hidden; border: 1px solid rgba(255,255,255,.07); }
.hcard.vb { border-color: rgba(0,229,160,.18); }
.hcard:hover { background: #141c2a; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,0,0,.35); }
.haccent { height: 2px; background: linear-gradient(90deg,#00e5a0,transparent); }
.hbody  { padding: 14px 16px; }
.hmeta  { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px; }
.htime  { font-size: 11px; color: #9aabc7; font-weight: 500; }

/* Sinais */
.hsinais { display: flex; flex-direction: column; gap: 6px; }
.hsinal  { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: 10px; }
.hsinal-icon  { font-size: 14px; flex-shrink: 0; }
.hsinal-info  { flex: 1; min-width: 0; }
.hsinal-nome  { font-size: 13px; font-weight: 600; color: #f0f4ff; }
.hsinal-prob  { font-size: 11px; color: #c6d1e6; margin-top: 1px; }
.hsinal-right { text-align: right; flex-shrink: 0; }
.hsinal-odd   { font-family: var(--font-mono); font-size: 17px; font-weight: 700; }
.hsinal-ev    { font-size: 10px; font-weight: 700; margin-top: 1px; }

.hfooter-card { padding: 10px 16px 13px; border-top: 1px solid rgba(255,255,255,.07); display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.hsee { font-size: 12px; color: #00e5a0; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
.hnobet { font-size: 12px; color: #9aabc7; }
.hbar-info { margin-top: 28px; padding: 13px 16px; background: #0f1520; border-radius: 12px; border: 1px solid rgba(255,255,255,.07); display: flex; align-items: flex-start; gap: 10px; font-size: 12px; color: #9aabc7; line-height: 1.6; }

@media (max-width: 640px) {
  .hw { padding: 20px 12px 48px; }
  .hdia-num { font-size: 22px; }
  .hdia { gap: 10px; }
  .hperfis { gap: 6px; }
  .hperfil { padding: 9px 10px; min-width: 80px; }
  .hbody { padding: 12px 12px; }
  .hfooter-card { padding: 9px 12px 12px; }
}
`;

function Flag({ nome, size }) {
  const logo = getLogo(nome);
  const st = { width: size, height: size, borderRadius: 7, objectFit: 'cover', border: '2px solid rgba(255,255,255,.1)', flexShrink: 0 };
  if (!logo) return (
    <div style={{ ...st, background: '#1c2537', border: '2px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#9aabc7', fontSize: size * .4 }}>
      {nome?.charAt(0) || '?'}
    </div>
  );
  return <img src={logo} alt={nome} style={st} onError={e => { e.target.style.display = 'none'; }} />;
}

function ProbBar({ oddC, oddF, oddE }) {
  if (!oddC || !oddF) return null;
  const rc = 1/oddC, re = oddE ? 1/oddE : 0, rf = 1/oddF, t = rc + re + rf;
  const pc = Math.round(rc/t*100), pe = Math.round(re/t*100), pf = Math.round(rf/t*100);
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display:'flex', borderRadius: 4, overflow:'hidden', height: 4 }}>
        <div style={{ width:pc+'%', background:'#00e5a0' }} />
        <div style={{ width:pe+'%', background:'#1c2537', margin:'0 1px' }} />
        <div style={{ width:pf+'%', background:'#4d9fff' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop: 4 }}>
        <span style={{ fontSize:10, color:'#00e5a0', fontWeight:600 }}>{pc}%</span>
        <span style={{ fontSize:10, color:'#9aabc7' }}>Emp {pe}%</span>
        <span style={{ fontSize:10, color:'#4d9fff', fontWeight:600 }}>{pf}%</span>
      </div>
    </div>
  );
}

/* ─── Timeline: agrupamento por dia ───────────────────────────── */
const DIAS_SEMANA = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
const MESES = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];

function parseDataBR(d) {
  const m = (d || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
}

function tagRelativa(dateObj) {
  if (!dateObj) return null;
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const diff = Math.round((dateObj - hoje) / 86400000);
  if (diff === 0) return { texto: 'HOJE',   cls: 'hoje'   };
  if (diff === 1) return { texto: 'AMANHÃ', cls: 'amanha' };
  return null;
}

function agruparPorDia(jogos) {
  const grupos = [];
  const idx = new Map();
  for (const j of jogos) {
    const key = j.data || 'sem-data';
    if (!idx.has(key)) {
      const g = { key, dateObj: parseDataBR(j.data), jogos: [] };
      idx.set(key, g); grupos.push(g);
    }
    idx.get(key).jogos.push(j);
  }
  // Mais recente primeiro; sem data por último
  grupos.sort((a, b) => (b.dateObj?.getTime() ?? -Infinity) - (a.dateObj?.getTime() ?? -Infinity));
  return grupos;
}

function HeaderDia({ grupo }) {
  const d = grupo.dateObj;
  const tag = tagRelativa(d);
  const n = grupo.jogos.length;
  return (
    <div className="hdia">
      <span className="hdia-num">{d ? String(d.getDate()).padStart(2,'0') : '—'}</span>
      <div className="hdia-col">
        <span className="hdia-sem">{d ? DIAS_SEMANA[d.getDay()] : 'DATA'}</span>
        <span className="hdia-mes">{d ? MESES[d.getMonth()] : 'A CONFIRMAR'}</span>
      </div>
      {tag && <span className={`hdia-tag ${tag.cls}`}>{tag.texto}</span>}
      <div className="hdia-linha"/>
      <span className="hdia-qtd">{n} jogo{n > 1 ? 's' : ''}</span>
    </div>
  );
}

function nivelSinal(ev, odd) {
  // Classifica o sinal para o apostador entender
  if (ev >= 12) return { cor: '#00e5a0', bg: 'rgba(0,229,160,.08)', bd: 'rgba(0,229,160,.22)', icon: '🎯', label: 'Excelente' };
  if (ev >= 7)  return { cor: '#00e5a0', bg: 'rgba(0,229,160,.06)', bd: 'rgba(0,229,160,.15)', icon: '✅', label: 'Bom'        };
  if (ev >= 3)  return { cor: '#ffb830', bg: 'rgba(255,184,48,.07)', bd: 'rgba(255,184,48,.2)', icon: '⚡', label: 'Ok'         };
  return         { cor: '#6b7280', bg: 'rgba(255,255,255,.03)', bd: 'rgba(255,255,255,.07)', icon: '•',  label: 'Fraco'      };
}

function probReal(odd) {
  // Probabilidade real estimada (remove margem da casa ~5%)
  const impl = 1 / odd;
  const real = impl * 0.95; // ajuste conservador
  return Math.min(99, Math.round(real * 100));
}

function CardJogo({ jogo, perfil, isMob, onClick }) {
  const o   = jogo.odds || {};
  const stC = getStats(jogo.casa.nome);
  const stF = getStats(jogo.fora.nome);

  const encerrado = jogo.statusReal === 'encerrado';
  const aoVivo    = jogo.statusReal === 'ao-vivo';

  // Filtrar sinais pelo perfil (jogo encerrado não tem sinal a exibir)
  const todosVbs  = encerrado ? [] : (jogo.valueBets || []).filter(v => v.ev > 0).sort((a,b)=>b.ev-a.ev);
  const sinaisFiltrados = filtraParaPerfil(todosVbs, perfil);
  const sinaisExibidos  = sinaisFiltrados.slice(0, isMob ? 2 : 3);
  const temSinais = sinaisExibidos.length > 0;
  const tamanhoFlag = isMob ? 32 : 42;

  return (
    <div className={`hcard${temSinais?' vb':''}`} onClick={onClick}>
      {temSinais && <div className="haccent"/>}
      <div className="hbody">
        {/* Meta */}
        <div className="hmeta">
          <span className="htime">
            <span className="htime-hora">{jogo.hora}</span>
            {jogo.estadio ? ` · ${jogo.estadio}` : ''}
          </span>
          {encerrado && (
            <span style={{ fontSize:10, color:'#c6d1e6', fontWeight:800, letterSpacing:'.08em', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', padding:'2px 8px', borderRadius:20 }}>
              ENCERRADO{jogo.prorrogacao ? ' · PRORR.' : ''}{jogo.placar?.penaltisCasa != null ? ' · PÊN.' : ''}
            </span>
          )}
          {aoVivo && (
            <span className="hlive" style={{ fontSize:10, color:'#ff4d6d', fontWeight:800, letterSpacing:'.08em', background:'rgba(255,77,109,.1)', border:'1px solid rgba(255,77,109,.25)', padding:'2px 8px', borderRadius:20 }}>
              ● AO VIVO{jogo.relogio ? ` ${jogo.relogio}` : ''}
            </span>
          )}
          {!encerrado && !aoVivo && temSinais && (
            <span style={{ fontSize:10, color:'#00e5a0', fontWeight:700, background:'rgba(0,229,160,.1)', border:'1px solid rgba(0,229,160,.2)', padding:'2px 8px', borderRadius:20 }}>
              {sinaisExibidos.length} sinal{sinaisExibidos.length>1?'is':''}
            </span>
          )}
        </div>

        {/* Times */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap: isMob?8:12, flex:1 }}>
            <Flag nome={jogo.casa.nome} size={tamanhoFlag}/>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontSize: isMob?14:17, fontWeight:800, color:'#f0f4ff' }}>{jogo.casa.nome}</div>
              {stC && !isMob && <div style={{ fontSize:10, color:'#9aabc7', marginTop:2 }}>{stC.gols_marcados}G · #{stC.ranking_fifa}</div>}
            </div>
          </div>

          {/* Placar real (encerrado ou ao vivo) */}
          {(encerrado || aoVivo) && jogo.placar && (
            <div style={{ display:'flex', alignItems:'baseline', gap:8, flexShrink:0, padding:'0 4px' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize: isMob?22:26, fontWeight:700, color: aoVivo ? '#ff4d6d' : '#f0f4ff' }}>
                {jogo.placar.casa}
                {jogo.placar.penaltisCasa != null && <span style={{ fontSize:12, color:'#c6d1e6' }}> ({jogo.placar.penaltisCasa})</span>}
              </span>
              <span style={{ fontSize:13, color:'#9aabc7', fontWeight:700 }}>x</span>
              <span style={{ fontFamily:'var(--font-mono)', fontSize: isMob?22:26, fontWeight:700, color: aoVivo ? '#ff4d6d' : '#f0f4ff' }}>
                {jogo.placar.fora}
                {jogo.placar.penaltisFora != null && <span style={{ fontSize:12, color:'#c6d1e6' }}> ({jogo.placar.penaltisFora})</span>}
              </span>
            </div>
          )}

          {/* Odds (só pré-jogo) */}
          {!encerrado && !aoVivo && o.resultado?.casa && (
            <div style={{ display:'flex', gap: isMob?10:8, flexShrink:0, padding: isMob?'0':'0 4px' }}>
              {[{v:o.resultado.casa,l:'1',c:'#00e5a0'},{v:o.resultado.empate,l:'X',c:'#c6d1e6'},{v:o.resultado.fora,l:'2',c:'#4d9fff'}].filter(x=>x.v).map(({v,l,c})=>(
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize: isMob?15:15, fontWeight:700, color:c }}>{parseFloat(v).toFixed(2)}</div>
                  <div style={{ fontSize:9, color:'#9aabc7', marginTop:2, textTransform:'uppercase', letterSpacing:'.05em' }}>{l}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display:'flex', alignItems:'center', gap: isMob?8:12, flex:1, justifyContent:'flex-end' }}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize: isMob?14:17, fontWeight:800, color:'#f0f4ff' }}>{jogo.fora.nome}</div>
              {stF && !isMob && <div style={{ fontSize:10, color:'#9aabc7', marginTop:2 }}>{stF.gols_marcados}G · #{stF.ranking_fifa}</div>}
            </div>
            <Flag nome={jogo.fora.nome} size={tamanhoFlag}/>
          </div>
        </div>

        {/* Barra prob */}
        <ProbBar oddC={o.resultado?.casa} oddF={o.resultado?.fora} oddE={o.resultado?.empate}/>

        {/* Sinais */}
        {temSinais && (
          <div className="hsinais" style={{ marginTop:14 }}>
            {sinaisExibidos.map((vb, i) => {
              const ns = nivelSinal(vb.ev, vb.odd);
              const pr = probReal(vb.odd);
              return (
                <div key={i} className="hsinal" style={{ background:ns.bg, border:`1px solid ${ns.bd}` }}>
                  <span className="hsinal-icon">{ns.icon}</span>
                  <div className="hsinal-info">
                    <div className="hsinal-nome">{vb.mercado}</div>
                    <div className="hsinal-prob">
                      Prob. real ~{pr}% · <span style={{ color:ns.cor, fontWeight:600 }}>{ns.label}</span>
                    </div>
                  </div>
                  <div className="hsinal-right">
                    <div className="hsinal-odd" style={{ color:ns.cor }}>{parseFloat(vb.odd).toFixed(2)}</div>
                    <div className="hsinal-ev"  style={{ color:ns.cor }}>+{vb.ev?.toFixed(1)}% EV</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="hfooter-card">
        <span style={{ fontSize:12, color:'#9aabc7' }}>
          {todosVbs.length > 0 ? `${todosVbs.length} sinal${todosVbs.length>1?'is':''} no total` : 'Sem sinais'}
        </span>
        <span className="hsee">Ver análise completa →</span>
      </div>
    </div>
  );
}

export default function Home({ onSelectJogo, jogos: jogosProp }) {
  const [filtro, setFiltro]   = useState('todos');
  const [perfil, setPerfil]   = useState('moderado');
  const [mostrarFuturos, setMostrarFuturos] = useState(false);
  const isMob = useIsMobile(640);
  const hoje = new Date().toLocaleDateString('pt-BR');
  const amnh = new Date(Date.now()+86400000).toLocaleDateString('pt-BR');

  const JOGOS = (jogosProp||[])
    .filter(j => filtro==='hoje' ? j.data===hoje : filtro==='amanhã' ? j.data===amnh : true)
    .sort((a,b) => {
      // Ordenar por quantidade de sinais para o perfil selecionado
      const sA = filtraParaPerfil((a.valueBets||[]).filter(v=>v.ev>0), perfil).length;
      const sB = filtraParaPerfil((b.valueBets||[]).filter(v=>v.ev>0), perfil).length;
      if (sB !== sA) return sB - sA;
      const evA = Math.max(...(a.valueBets||[]).map(v=>v.ev||0), 0);
      const evB = Math.max(...(b.valueBets||[]).map(v=>v.ev||0), 0);
      return evB - evA;
    });

  return (
    <>
      <style>{S}</style>
      <div className="hw">
        {/* Hero */}
        <div style={{ marginBottom:24 }}>
          <div className="hbadges">
            <span className="hbadge hbadge-g">Copa do Mundo 2026</span>
            <span className="hbadge hbadge-d">{JOGOS.length} jogos</span>
          </div>
          <h1 className="htitle" style={{ fontSize: isMob?24:30 }}>
            Sinais de apostas<br/>
            <span style={{ color:'#00e5a0' }}>baseados em estatística</span>
          </h1>
          <p className="hsub">
            Cada aposta sugerida tem probabilidade real estimada e valor esperado calculado.
            Escolha seu perfil e veja os melhores sinais.
          </p>
        </div>

        {/* Filtros de data + perfil */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
          <div className="hfilters">
            {[['todos','Todos'],['hoje','Hoje'],['amanhã','Amanhã']].map(([v,l])=>(
              <button key={v} className={`hfilter${filtro===v?' on':''}`} onClick={()=>setFiltro(v)}>{l}</button>
            ))}
          </div>

          {/* Seletor de perfil */}
          <div className="hperfis">
            {Object.entries(PERFIS).map(([key, p]) => (
              <button key={key} className={`hperfil${perfil===key?' on':''}`} onClick={()=>setPerfil(key)}>
                <div className="hperfil-emoji">{p.emoji}</div>
                <div className="hperfil-nome" style={{ color: perfil===key ? '#00e5a0' : '#f0f4ff' }}>{p.label}</div>
                <div className="hperfil-desc">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline agrupada por dia */}
        {JOGOS.length===0 && (
          <div style={{ textAlign:'center', padding:'48px 0', color:'#9aabc7', fontSize:14 }}>
            Nenhum jogo encontrado.
          </div>
        )}
        {(() => {
          const grupos = agruparPorDia(JOGOS);

          // No filtro "Todos", a análise começa em HOJE: dias futuros ficam
          // recolhidos atrás de um botão, pra lista abrir direto no que importa.
          const hoje0 = new Date(); hoje0.setHours(0,0,0,0);
          const separar = filtro === 'todos';
          const futuros = separar ? grupos.filter(g => g.dateObj && g.dateObj > hoje0) : [];
          const atuais  = separar ? grupos.filter(g => !(g.dateObj && g.dateObj > hoje0)) : grupos;
          const nFuturos = futuros.reduce((n, g) => n + g.jogos.length, 0);

          const renderGrupo = g => (
            <div className="hgrupo" key={g.key}>
              <HeaderDia grupo={g}/>
              <div className="hcards">
                {g.jogos.map(j => (
                  <CardJogo key={j.id} jogo={j} perfil={perfil} isMob={isMob} onClick={()=>onSelectJogo(j)}/>
                ))}
              </div>
            </div>
          );

          return (
            <>
              {nFuturos > 0 && !mostrarFuturos && (
                <button className="hfuturos" onClick={() => setMostrarFuturos(true)}>
                  <span className="hfuturos-seta">▲</span>
                  Mostrar {nFuturos} jogo{nFuturos > 1 ? 's' : ''} dos próximos dias
                </button>
              )}
              {nFuturos > 0 && mostrarFuturos && (
                <>
                  <button className="hfuturos" onClick={() => setMostrarFuturos(false)}>
                    <span className="hfuturos-seta">▼</span>
                    Ocultar jogos dos próximos dias
                  </button>
                  {futuros.map(renderGrupo)}
                </>
              )}
              {atuais.map(renderGrupo)}
            </>
          );
        })()}

        {/* Footer info */}
        <div className="hbar-info">
          <span style={{ fontSize:18, flexShrink:0 }}>⏱</span>
          <span>
            Dados atualizados a cada 5 min · Probabilidade real = prob. implícita da odd ajustada pela margem da casa ·
            EV = vantagem estatística estimada
          </span>
        </div>
      </div>
    </>
  );
}
