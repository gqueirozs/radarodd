import React from 'react';

/**
 * Skeleton — placeholder animado enquanto conteúdo carrega.
 * Reduz percepção de latência muito melhor que um "Carregando…" chapado.
 *
 * <Skel w={200} h={16} />        → uma linha
 * <SkelTexto linhas={3} />       → várias linhas
 * <SkelCard />                   → um card de jogo típico
 */

const CSS = `
@keyframes sk-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.sk {
  display: inline-block;
  background: #0f1520;
  background-image: linear-gradient(90deg, #0f1520 0%, #1a2333 50%, #0f1520 100%);
  background-size: 800px 100%;
  animation: sk-shimmer 1.4s linear infinite;
  border-radius: 6px;
}
@keyframes sk-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.sk-fade-in { animation: sk-fade-in .35s ease-out both; }
`;

let injetado = false;
function injetar() {
  if (injetado || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = CSS;
  document.head.appendChild(el);
  injetado = true;
}

export function Skel({ w = '100%', h = 14, r = 6, style }) {
  injetar();
  return <span className="sk" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

export function SkelTexto({ linhas = 3, larguras = ['100%', '92%', '78%'], espaco = 8, style }) {
  injetar();
  return (
    <div style={style}>
      {Array.from({ length: linhas }).map((_, i) => (
        <div key={i} style={{ marginBottom: i < linhas - 1 ? espaco : 0 }}>
          <Skel w={larguras[i % larguras.length]} h={14} />
        </div>
      ))}
    </div>
  );
}

export function SkelCard() {
  injetar();
  return (
    <div className="sk-fade-in" style={{ background: '#0b1119', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Skel w={56} h={13} />
        <Skel w={70} h={20} r={20} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <Skel w={26} h={26} r={6} />
          <Skel w={100} h={16} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Skel w={30} h={18} />
          <Skel w={30} h={18} />
          <Skel w={30} h={18} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
          <Skel w={100} h={16} />
          <Skel w={26} h={26} r={6} />
        </div>
      </div>
      <Skel w="100%" h={6} r={3} />
    </div>
  );
}

export function SkelTeaser() {
  injetar();
  return (
    <div className="sk-fade-in" style={{ background: 'linear-gradient(135deg, rgba(0,229,160,.04), rgba(77,159,255,.02))', border: '1.5px solid rgba(0,229,160,.15)', borderRadius: 18, padding: '32px 24px', textAlign: 'center' }}>
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
        <Skel w={180} h={22} r={20} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <Skel w="70%" h={26} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <Skel w="50%" h={13} />
      </div>
      <div style={{ maxWidth: 400, margin: '0 auto 16px' }}>
        <SkelTexto linhas={2} espaco={6} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Skel w={220} h={44} r={12} />
      </div>
    </div>
  );
}
