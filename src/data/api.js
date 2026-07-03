const API_URL = process.env.REACT_APP_API_URL || 'https://radarodd-api-production.up.railway.app';

export async function fetchJogos() {
  try {
    const res = await fetch(`${API_URL}/api/jogos`);
    if (!res.ok) throw new Error('API indisponível');
    const data = await res.json();
    if (data.ok && data.jogos?.length > 0) return data.jogos;
    throw new Error(data.mensagem || 'Sem jogos');
  } catch (err) {
    console.warn('API offline, usando dados locais:', err.message);
    return null;
  }
}

export async function fetchJogo(id) {
  try {
    const res = await fetch(`${API_URL}/api/jogos/${id}`);
    if (!res.ok) throw new Error('Jogo não encontrado');
    const data = await res.json();
    return data.ok ? data.jogo : null;
  } catch (err) {
    console.warn('Erro ao buscar jogo:', err.message);
    return null;
  }
}

export async function fetchStatus() {
  try {
    const res = await fetch(`${API_URL}/api/status`);
    const data = await res.json();
    return data;
  } catch {
    return { status: 'offline' };
  }
}

export async function fetchValueBets() {
  try {
    const res = await fetch(`${API_URL}/api/value-bets`);
    const data = await res.json();
    return data.ok ? data.valueBets : [];
  } catch {
    return [];
  }
}

export async function fetchConfronto(casa, fora) {
  try {
    const qs = new URLSearchParams({ casa, fora }).toString();
    const res = await fetch(`${API_URL}/api/confronto?${qs}`);
    const data = await res.json();
    return data.ok ? data : null;
  } catch (err) {
    console.warn('Erro ao buscar confronto:', err.message);
    return null;
  }
}

export async function fetchMataMata() {
  try {
    const res = await fetch(`${API_URL}/api/mata-mata`);
    const data = await res.json();
    return data.ok ? data : null;
  } catch (err) {
    console.warn('Erro ao buscar mata-mata:', err.message);
    return null;
  }
}

export async function fetchEvento(eventoId, liga = 'fifa.world') {
  try {
    const res = await fetch(`${API_URL}/api/evento/${eventoId}?liga=${liga}`);
    const data = await res.json();
    return data.ok ? data : null;
  } catch (err) {
    console.warn('Erro ao buscar detalhes do evento:', err.message);
    return null;
  }
}
