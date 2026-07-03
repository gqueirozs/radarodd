import React from 'react';
import Logo from './Logo';

export default function Nav({ page, setPage, apiStatus, ultimaAtualizacao }) {
  const s = {
    online:  { cor: '#00e5a0', texto: 'Ao vivo' },
    loading: { cor: '#ffb830', texto: 'Atualizando' },
    mock:    { cor: '#ffb830', texto: 'Demo' },
    offline: { cor: '#ff4d6d', texto: 'Offline' },
  }[apiStatus] || { cor: '#ffb830', texto: '...' };

  const hora = ultimaAtualizacao
    ? new Date(ultimaAtualizacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;

  const links = [['home','Jogos'],['chaveamento','Mata-mata']];

  return (
    <>
      <style>{`
        .nav { position:sticky; top:0; z-index:200; background:rgba(9,13,20,.96); backdrop-filter:blur(16px); border-bottom:1px solid rgba(255,255,255,.07); padding:0 20px; height:56px; display:flex; align-items:center; justify-content:space-between; }
        .nav-logo { background:none; border:none; display:flex; align-items:center; gap:9px; cursor:pointer; padding:0; }
        .nav-logo-text { font-family:var(--font-display); font-weight:800; font-size:17px; color:#f0f4ff; letter-spacing:-.3px; }
        .nav-logo-text span { color:#00e5a0; }
        .nav-logo-domain { font-size:9px; color:#7d8fad; letter-spacing:.05em; margin-top:1px; }
        .nav-links { display:flex; gap:2px; }
        .nav-link { background:none; border:none; border-radius:8px; padding:6px 13px; font-size:13px; font-weight:500; transition:all .15s; cursor:pointer; white-space:nowrap; }
        .nav-link.on { background:rgba(0,229,160,.12); color:#00e5a0; }
        .nav-link:not(.on) { color:#aab7cf; }
        .nav-status { display:flex; align-items:center; gap:6px; padding:5px 10px; border-radius:8px; background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.06); font-size:11px; font-weight:600; white-space:nowrap; }
        .nav-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; animation:pulse 2s infinite; }
        .nav-bottom { display:none; }
        @media (max-width:600px) {
          .nav-links { display:none; }
          .nav-logo-text { font-size:15px; }
          .nav-status { padding:4px 8px; font-size:10px; }
          .nav-hora { display:none; }
          .nav-bottom {
            display:flex; position:fixed; bottom:0; left:0; right:0; z-index:200;
            background:rgba(9,13,20,.97); backdrop-filter:blur(16px);
            border-top:1px solid rgba(255,255,255,.08);
            padding:6px 8px calc(6px + env(safe-area-inset-bottom));
          }
          .nav-bottom-link {
            flex:1; display:flex; flex-direction:column; align-items:center; gap:2px;
            background:none; border:none; padding:6px 4px; border-radius:10px;
            font-size:11px; font-weight:600; cursor:pointer; transition:all .15s;
          }
          .nav-bottom-link.on { color:#00e5a0; }
          .nav-bottom-link:not(.on) { color:#aab7cf; }
          .nav-bottom-dot { width:5px; height:5px; border-radius:50%; background:#00e5a0; opacity:0; transition:opacity .15s; }
          .nav-bottom-link.on .nav-bottom-dot { opacity:1; }
          body { padding-bottom:62px; }
        }
      `}</style>
      <nav className="nav">
        <button className="nav-logo" onClick={() => setPage('home')}>
          <Logo size={32} />
          <div>
            <div className="nav-logo-text">Sinal<span>Odds</span></div>
            <div className="nav-logo-domain">sinalodds.com.br</div>
          </div>
        </button>

        <div className="nav-links">
          {links.map(([id,label])=>(
            <button key={id} className={`nav-link${page===id?' on':''}`} onClick={()=>setPage(id)}>{label}</button>
          ))}
        </div>

        <div className="nav-status">
          <div className="nav-dot" style={{ background:s.cor }}/>
          <span style={{ color:s.cor }}>{s.texto}</span>
          {hora && apiStatus==='online' && <span className="nav-hora" style={{ color:'#7d8fad', fontWeight:400 }}>{hora}</span>}
        </div>
      </nav>

      <div className="nav-bottom">
        {links.map(([id,label])=>(
          <button key={id} className={`nav-bottom-link${page===id?' on':''}`} onClick={()=>setPage(id)}>
            <span className="nav-bottom-dot" />
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
