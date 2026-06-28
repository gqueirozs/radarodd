import React from 'react';

export default function Nav({ page, setPage, apiStatus, ultimaAtualizacao }) {
  const links = [
    { id: 'home',      label: 'Jogos' },
    { id: 'historico', label: 'Histórico' },
  ];

  const statusConfig = {
    online:  { cor: '#00e5a0', texto: 'Ao vivo',   pulse: true },
    loading: { cor: '#ffb830', texto: 'Atualizando', pulse: true },
    mock:    { cor: '#ffb830', texto: 'Modo demo',  pulse: false },
    offline: { cor: '#ff4d6d', texto: 'Offline',    pulse: false },
  };
  const s = statusConfig[apiStatus] || statusConfig.loading;

  const horaAtualizada = ultimaAtualizacao
    ? new Date(ultimaAtualizacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(9,13,20,0.92)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: 58,
    }}>
      <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--accent), #00b0ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>📡</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.3px' }}>
          Radar<span style={{ color: 'var(--accent)' }}>Odd</span>
        </span>
      </button>

      <div style={{ display: 'flex', gap: 4 }}>
        {links.map(l => (
          <button key={l.id} onClick={() => setPage(l.id)} style={{
            background: page === l.id ? 'var(--accent-dim2)' : 'none',
            border: 'none', borderRadius: 8,
            padding: '6px 14px', fontSize: 14, fontWeight: 500,
            color: page === l.id ? 'var(--accent)' : 'var(--text2)',
            transition: 'all .15s', cursor: 'pointer',
          }}>{l.label}</button>
        ))}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 12px', borderRadius: 8,
        background: 'rgba(0,0,0,0.3)', border: `1px solid ${s.cor}33`,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', background: s.cor,
          animation: s.pulse ? 'pulse 2s infinite' : 'none',
        }} />
        <span style={{ fontSize: 12, color: s.cor, fontWeight: 500 }}>{s.texto}</span>
        {horaAtualizada && apiStatus === 'online' && (
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{horaAtualizada}</span>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </nav>
  );
}
