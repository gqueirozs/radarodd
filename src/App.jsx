import React, { useState } from 'react';
import Nav from './components/Nav';
import Home from './pages/Home';
import Analisador from './pages/Analisador';
import Historico from './pages/Historico';

export default function App() {
  const [page, setPage] = useState('home');
  const [jogoSelecionado, setJogoSelecionado] = useState(null);

  const handleSelectJogo = (jogo) => {
    setJogoSelecionado(jogo);
    setPage('analisador');
  };

  const handleVoltar = () => {
    setPage('home');
    setJogoSelecionado(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav page={page} setPage={setPage} />
      {page === 'home' && <Home onSelectJogo={handleSelectJogo} />}
      {page === 'analisador' && jogoSelecionado && (
        <Analisador jogo={jogoSelecionado} onVoltar={handleVoltar} />
      )}
      {page === 'historico' && <Historico />}
    </div>
  );
}
