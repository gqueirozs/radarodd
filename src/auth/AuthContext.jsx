import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../data/api';

const AuthContext = createContext(null);
const CHAVE_TOKEN = 'sinalodds_token';

export function getToken() {
  try { return localStorage.getItem(CHAVE_TOKEN); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const aplicarSessao = useCallback((token, u) => {
    try { localStorage.setItem(CHAVE_TOKEN, token); } catch { /* modo privado */ }
    setUsuario(u);
  }, []);

  const sair = useCallback(() => {
    try { localStorage.removeItem(CHAVE_TOKEN); } catch { /* ok */ }
    setUsuario(null);
  }, []);

  const atualizarUsuario = useCallback(async () => {
    const token = getToken();
    if (!token) { setUsuario(null); setCarregando(false); return null; }
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.ok) { setUsuario(data.usuario); return data.usuario; }
      sair();
    } catch { /* offline: mantém estado atual */ }
    setCarregando(false);
    return null;
  }, [sair]);

  useEffect(() => { atualizarUsuario().finally(() => setCarregando(false)); }, [atualizarUsuario]);

  async function chamarAuth(caminho, corpo) {
    const res = await fetch(`${API_URL}/api/auth/${caminho}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.mensagem || 'Não foi possível concluir');
    aplicarSessao(data.token, data.usuario);
    return data.usuario;
  }

  const valor = {
    usuario,
    carregando,
    assinante: !!usuario?.assinante,
    entrar: (email, senha) => chamarAuth('login', { email, senha }),
    registrar: (nome, email, senha) => chamarAuth('registrar', { nome, email, senha }),
    sair,
    atualizarUsuario,
    setUsuario,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
