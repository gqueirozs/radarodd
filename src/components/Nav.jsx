import React from 'react';

export default function Nav({ page, setPage }) {
  const links = [
    { id: 'home',      label: 'Jogos' },
    { id: 'historico', label: 'Histórico' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(9,13,20,0.92)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: 58,
    }}>
      <button onClick={() => setPage('home')} style={{
        background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--accent), #00b0ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>📡</div>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
          color: 'var(--text)', letterSpacing: '-0.3px',
        }}>
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
            transition: 'all .15s',
          }}>{l.label}</button>
        ))}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 12px', borderRadius: 8,
        background: 'var(--accent-dim)', border: '1px solid var(--accent-dim2)',
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
        <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>Ao vivo</span>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </nav>
  );
}
