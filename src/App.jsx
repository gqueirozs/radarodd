import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Analisador from './pages/Analisador';
import Chaveamento from './pages/Chaveamento';
import Premium from './pages/Premium';
import { SkelCard } from './components/Skeleton';
import PageTransition from './components/PageTransition';
import { AuthProvider } from './auth/AuthContext';
import { fetchJogos, fetchStatus } from './data/api';

/* Rota /partida/:id — encontra o jogo pelo id da URL */
function PaginaPartida({ jogos, apiStatus }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const jogo = (jogos || []).find(j => String(j.id) === String(id));

  if (!jogo) {
    // Dados ainda carregando: espera; carregado e não achou: volta pra home
    if (apiStatus === 'loading') {
      return (
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 16px' }}>
          <SkelCard />
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[80, 100, 90, 110].map((w,i) => <span key={i} className="sk" style={{ width: w, height: 34, borderRadius: 10, display: 'inline-block' }}/>)}
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }
  return <Analisador jogo={jogo} onVoltar={() => navigate(-1)} />;
}

function AppRotas() {
  const [jogos, setJogos] = useState([]);
  const [apiStatus, setApiStatus] = useState('loading');
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    carregarDados();
    const intervalo = setInterval(carregarDados, 3 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Volta ao topo ao trocar de página
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  async function carregarDados() {
    try {
      const [jogosApi, status] = await Promise.all([fetchJogos(), fetchStatus()]);
      if (jogosApi && jogosApi.length > 0) {
        setJogos(jogosApi);
        setApiStatus('online');
        setUltimaAtualizacao(status?.ultimaAtualizacao);
      } else {
        // API acordando/repopulando: mantém o que houver, sem dados fictícios
        setApiStatus(s => (s === 'online' ? 'online' : 'loading'));
      }
    } catch {
      setApiStatus('offline');
    }
  }

  // Nav continua falando "page"; traduzimos pra URL
  const page = location.pathname.startsWith('/mata-mata') ? 'chaveamento'
    : location.pathname.startsWith('/partida') ? 'analisador'
    : 'home';
  const setPage = id => navigate(id === 'chaveamento' ? '/mata-mata' : '/');

  const abrirPartida = jogo => navigate(`/partida/${jogo.id}`);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav page={page} setPage={setPage} apiStatus={apiStatus} ultimaAtualizacao={ultimaAtualizacao} />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home onSelectJogo={abrirPartida} jogos={jogos} apiStatus={apiStatus} />} />
          <Route path="/mata-mata" element={<Chaveamento jogos={jogos} onSelectJogo={abrirPartida} />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/partida/:id" element={<PaginaPartida jogos={jogos} apiStatus={apiStatus} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRotas />
      </AuthProvider>
    </BrowserRouter>
  );
}
