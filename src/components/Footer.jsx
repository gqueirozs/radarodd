import React from 'react';
import Logo from './Logo';

const S = `
.ft-wrap { border-top: 1px solid rgba(255,255,255,.07); background: #090d14; margin-top: 48px; }
.ft-inner { max-width: 1180px; margin: 0 auto; padding: 36px 16px 28px; }
.ft-grid { display: grid; grid-template-columns: 1.2fr 2fr; gap: 32px; margin-bottom: 24px; }
@media (max-width: 720px) { .ft-grid { grid-template-columns: 1fr; gap: 20px; } }

.ft-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.ft-brand-nome { font-family: var(--font-display); font-weight: 800; font-size: 17px; color: #f0f4ff; }
.ft-brand-nome span { color: #00e5a0; }
.ft-tagline { font-size: 12px; color: #4d5f7a; line-height: 1.7; max-width: 300px; }

.ft-titulo { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #8b9ab4; margin-bottom: 10px; }
.ft-texto { font-size: 12px; color: #4d5f7a; line-height: 1.8; }
.ft-texto strong { color: #8b9ab4; font-weight: 600; }

.ft-aviso { background: rgba(255,184,48,.05); border: 1px solid rgba(255,184,48,.15); border-radius: 12px; padding: 14px 16px; font-size: 12px; color: #8b9ab4; line-height: 1.8; margin-bottom: 20px; }
.ft-aviso strong { color: #ffb830; font-weight: 700; }

.ft-base { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.05); }
.ft-copy { font-size: 11px; color: #4d5f7a; }
.ft-18 { font-size: 11px; font-weight: 800; color: #ff4d6d; border: 1.5px solid rgba(255,77,109,.35); border-radius: 6px; padding: 2px 7px; }
`;

export default function Footer() {
  return (
    <>
      <style>{S}</style>
      <footer className="ft-wrap">
        <div className="ft-inner">
          <div className="ft-grid">
            <div>
              <div className="ft-brand">
                <Logo size={26} />
                <span className="ft-brand-nome">Sinal<span>Odds</span></span>
              </div>
              <p className="ft-tagline">
                Análises estatísticas para a Copa do Mundo 2026. Trabalhamos com dados
                e entregamos análises e probabilidades.
              </p>
            </div>
            <div>
              <div className="ft-titulo">Como trabalhamos</div>
              <p className="ft-texto">
                Coletamos as <strong>odds do mercado</strong> em tempo real, buscamos os{' '}
                <strong>resultados de partidas anteriores</strong> e investigamos o{' '}
                <strong>histórico das seleções</strong> — confrontos diretos, goleadores,
                cartões e desempenho recente. Tudo isso é cruzado em modelos estatísticos
                para estimar probabilidades reais e identificar valor nas odds oferecidas.
              </p>
            </div>
          </div>

          <div className="ft-aviso">
            <strong>Aviso importante:</strong> todas as análises, sinais e probabilidades
            exibidos são baseados em dados históricos e modelos estatísticos —{' '}
            <strong>não são garantia de resultado e não devem ser tomados como verdade
            absoluta</strong>. Futebol envolve imprevisibilidade e nenhum modelo elimina o
            risco. As informações têm caráter educativo e não constituem recomendação de
            aposta. Aposte com responsabilidade e apenas valores que você pode perder.
          </div>

          <div className="ft-base">
            <span className="ft-copy">
              © {new Date().getFullYear()} SinalOdds · Dados de odds do mercado · Resultados e estatísticas: ESPN
            </span>
            <span className="ft-18">+18</span>
          </div>
        </div>
      </footer>
    </>
  );
}
