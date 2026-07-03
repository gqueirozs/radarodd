import React from 'react';
import Logo from './Logo';

const S = `
.ft-wrap { position: relative; background: #090d14; margin-top: 56px; }
.ft-wrap::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,229,160,.5), rgba(77,159,255,.5), transparent); }
.ft-inner { max-width: 1180px; margin: 0 auto; padding: 44px 16px 28px; }

.ft-topo { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin-bottom: 28px; }
.ft-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.ft-brand-nome { font-family: var(--font-display); font-weight: 800; font-size: 18px; color: #f0f4ff; letter-spacing: -.3px; }
.ft-brand-nome span { color: #00e5a0; }
.ft-tagline { font-size: 12.5px; color: #7d8fad; line-height: 1.7; max-width: 320px; }

.ft-passos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
@media (max-width: 820px) { .ft-passos { grid-template-columns: 1fr; } }
.ft-passo { background: #0f1520; border: 1px solid rgba(255,255,255,.06); border-radius: 14px; padding: 16px; transition: border-color .2s; }
.ft-passo:hover { border-color: rgba(0,229,160,.2); }
.ft-passo-num { font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: #00e5a0; letter-spacing: .1em; margin-bottom: 8px; }
.ft-passo:nth-child(2) .ft-passo-num { color: #4d9fff; }
.ft-passo:nth-child(3) .ft-passo-num { color: #ffb830; }
.ft-passo-titulo { font-size: 13px; font-weight: 700; color: #f0f4ff; margin-bottom: 5px; }
.ft-passo-desc { font-size: 11.5px; color: #7d8fad; line-height: 1.65; }

.ft-aviso { display: flex; gap: 12px; align-items: flex-start; background: rgba(255,184,48,.04); border: 1px solid rgba(255,184,48,.14); border-radius: 14px; padding: 14px 16px; margin-bottom: 24px; }
.ft-aviso-icone { font-size: 15px; line-height: 1.5; flex-shrink: 0; }
.ft-aviso-texto { font-size: 12px; color: #aab7cf; line-height: 1.75; }
.ft-aviso-texto strong { color: #ffb830; font-weight: 700; }

.ft-base { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.05); }
.ft-copy { font-size: 11px; color: #7d8fad; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ft-dot { width: 3px; height: 3px; border-radius: 50%; background: #2a3548; display: inline-block; }
.ft-18 { font-size: 11px; font-weight: 800; color: #ff4d6d; border: 1.5px solid rgba(255,77,109,.35); border-radius: 6px; padding: 2px 7px; letter-spacing: .04em; }
`;

const PASSOS = [
  {
    num: '01',
    titulo: 'Odds do mercado',
    desc: 'Coletamos as cotações do mercado em tempo real e monitoramos suas variações.',
  },
  {
    num: '02',
    titulo: 'Histórico e resultados',
    desc: 'Buscamos partidas anteriores e investigamos o histórico dos times: confrontos diretos, desempenho recente e estatísticas de jogo.',
  },
  {
    num: '03',
    titulo: 'Modelos e probabilidades',
    desc: 'Cruzamos tudo em modelos estatísticos para estimar probabilidades reais e apontar onde há valor nas odds.',
  },
];

export default function Footer() {
  return (
    <>
      <style>{S}</style>
      <footer className="ft-wrap">
        <div className="ft-inner">
          <div className="ft-topo">
            <div>
              <div className="ft-brand">
                <Logo size={28} />
                <span className="ft-brand-nome">Sinal<span>Odds</span></span>
              </div>
              <p className="ft-tagline">
                Análises estatísticas para apostas esportivas. Trabalhamos com dados
                e entregamos análises e probabilidades — nada além disso.
              </p>
            </div>
          </div>

          <div className="ft-passos">
            {PASSOS.map(p => (
              <div className="ft-passo" key={p.num}>
                <div className="ft-passo-num">{p.num}</div>
                <div className="ft-passo-titulo">{p.titulo}</div>
                <div className="ft-passo-desc">{p.desc}</div>
              </div>
            ))}
          </div>

          <div className="ft-aviso">
            <span className="ft-aviso-icone">⚠️</span>
            <p className="ft-aviso-texto">
              <strong>Aviso importante:</strong> todas as análises, sinais e probabilidades
              exibidos são baseados em dados históricos e modelos estatísticos —{' '}
              <strong>não são garantia de resultado e não devem ser tomados como verdade
              absoluta</strong>. Esporte envolve imprevisibilidade e nenhum modelo elimina
              o risco. As informações têm caráter educativo e não constituem recomendação
              de aposta. Aposte com responsabilidade e apenas valores que você pode perder.
            </p>
          </div>

          <div className="ft-base">
            <span className="ft-copy">
              © {new Date().getFullYear()} SinalOdds
              <span className="ft-dot" />
              Odds do mercado
              <span className="ft-dot" />
              Resultados e estatísticas: ESPN
            </span>
            <span className="ft-18">+18</span>
          </div>
        </div>
      </footer>
    </>
  );
}
