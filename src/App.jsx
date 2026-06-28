import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Home from './pages/Home';
import Analisador from './pages/Analisador';
import Historico from './pages/Historico';
import { fetchJogos, fetchStatus } from './data/api';
import { JOGOS as JOGOS_MOCK } from './data/mockData';

export default function App() {
  const [page, setPage] = useState('home');
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [jogos, setJogos] = useState(JOGOS_MOCK);
  const [apiStatus, setApiStatus] = useState('loading');
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);

  useEffect(() => {
    carregarDados();
    // Atualiza a cada 3 minutos
    const intervalo = setInterval(carregarDados, 3 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  async function carregarDados() {
    setApiStatus('loading');
    try {
      const [jogosApi, status] = await Promise.all([fetchJogos(), fetchStatus()]);
      if (jogosApi && jogosApi.length > 0) {
        setJogos(jogosApi);
        setApiStatus('online');
        setUltimaAtualizacao(status.ultimaAtualizacao);
      } else {
        setJogos(JOGOS_MOCK);
        setApiStatus('mock');
      }
    } catch {
      setJogos(JOGOS_MOCK);
      setApiStatus('offline');
    }
  }

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
      <Nav
        page={page}
        setPage={setPage}
        apiStatus={apiStatus}
        ultimaAtualizacao={ultimaAtualizacao}
      />
      {page === 'home' && (
        <Home
          onSelectJogo={handleSelectJogo}
          jogos={jogos}
          apiStatus={apiStatus}
        />
      )}
      {page === 'analisador' && jogoSelecionado && (
        <Analisador jogo={jogoSelecionado} onVoltar={handleVoltar} />
      )}
      {page === 'historico' && <Historico />}
    </div>
  );
}
