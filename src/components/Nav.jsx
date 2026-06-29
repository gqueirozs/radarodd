import React, { useState } from 'react';

export default function Nav({ page, setPage, apiStatus, ultimaAtualizacao }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const s = {
    online:  { cor: '#00e5a0', texto: 'Ao vivo' },
    loading: { cor: '#ffb830', texto: 'Atualizando' },
    mock:    { cor: '#ffb830', texto: 'Demo' },
    offline: { cor: '#ff4d6d', texto: 'Offline' },
  }[apiStatus] || { cor: '#ffb830', texto: '...' };

  const hora = ultimaAtualizacao
    ? new Date(ultimaAtualizacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <>
      <style>{`
        .nav-root {
          position: sticky; top: 0; z-index: 200;
          background: rgba(9,13,20,0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0 20px; height: 56px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { background: none; border: none; display: flex; align-items: center; gap: 9px; text-decoration: none; }
        .nav-logo-icon {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: linear-gradient(135deg, #00e5a0, #00b0ff);
          display: flex; align-items: center; justify-content: center; font-size: 15px;
        }
        .nav-logo-text { font-family: var(--font-display); font-weight: 700; font-size: 17px; color: var(--text); letter-spacing: -.3px; }
        .nav-logo-text span { color: #00e5a0; }
        .nav-links { display: flex; gap: 2px; }
        .nav-link {
          background: none; border: none; border-radius: 8px;
          padding: 6px 13px; font-size: 13px; font-weight: 500;
          transition: all .15s; cursor: pointer;
        }
        .nav-link.active { background: rgba(0,229,160,.12); color: #00e5a0; }
        .nav-link:not(.active) { color: var(--text2); }
        .nav-status {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 10px; border-radius: 8px;
          background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.06);
          font-size: 11px; font-weight: 600; white-space: nowrap;
        }
        .nav-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; animation: pulse 2s infinite; }

        @media (max-width: 600px) {
          .nav-root { padding: 0 16px; }
          .nav-links { display: none; }
          .nav-status-time { display: none; }
          .nav-logo-text { font-size: 15px; }
          .nav-status { padding: 4px 8px; font-size: 10px; }
        }
      `}</style>
      <nav className="nav-root">
        <button className="nav-logo" onClick={() => setPage('home')}>
          <div className="nav-logo-icon">📡</div>
          <span className="nav-logo-text">Radar<span>Odd</span></span>
        </button>

        <div className="nav-links">
          {[['home','Jogos'],['historico','Histórico']].map(([id, label]) => (
            <button key={id} className={`nav-link${page === id ? ' active' : ''}`}
              onClick={() => setPage(id)}>{label}</button>
          ))}
        </div>

        <div className="nav-status">
          <div className="nav-dot" style={{ background: s.cor }} />
          <span style={{ color: s.cor }}>{s.texto}</span>
          {hora && apiStatus === 'online' && (
            <span className="nav-status-time" style={{ color: 'var(--text3)', fontWeight: 400 }}>{hora}</span>
          )}
        </div>
      </nav>
    </>
  );
}
