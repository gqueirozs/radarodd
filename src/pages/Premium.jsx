import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { criarAssinaturaPix, consultarPagamento } from '../data/api';

const S = `
.pm-wrap { max-width: 760px; margin: 0 auto; padding: 40px 16px 64px; }
.pm-badge { display:inline-block; font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#00e5a0; background:rgba(0,229,160,.1); border:1px solid rgba(0,229,160,.25); padding:4px 12px; border-radius:20px; margin-bottom:16px; }
.pm-titulo { font-family:var(--font-display); font-size:34px; font-weight:800; color:#f0f4ff; line-height:1.15; letter-spacing:-.5px; margin-bottom:14px; }
.pm-titulo span { color:#00e5a0; }
.pm-sub { font-size:15px; color:#c6d1e6; line-height:1.75; max-width:560px; margin-bottom:32px; }

.pm-preco-card { background:linear-gradient(135deg, rgba(0,229,160,.07), rgba(77,159,255,.05)); border:1.5px solid rgba(0,229,160,.3); border-radius:20px; padding:28px; text-align:center; margin-bottom:32px; }
.pm-preco { font-family:var(--font-mono); font-size:44px; font-weight:700; color:#f0f4ff; line-height:1; }
.pm-preco small { font-size:15px; color:#9aabc7; font-weight:500; }
.pm-preco-sub { font-size:12px; color:#9aabc7; margin-top:8px; }
.pm-cta { margin-top:18px; width:100%; max-width:340px; padding:14px 24px; border-radius:12px; border:none; background:#00e5a0; color:#000; font-size:15px; font-weight:800; cursor:pointer; transition:all .15s; }
.pm-cta:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(0,229,160,.25); }
.pm-cta:disabled { opacity:.6; cursor:default; transform:none; box-shadow:none; }

.pm-beneficios { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:32px; }
@media (max-width:600px){ .pm-beneficios{ grid-template-columns:1fr; } }
.pm-b { background:#0f1520; border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:16px; }
.pm-b-icone { font-size:20px; margin-bottom:8px; }
.pm-b-titulo { font-size:14px; font-weight:700; color:#f0f4ff; margin-bottom:5px; }
.pm-b-desc { font-size:12px; color:#9aabc7; line-height:1.65; }

.pm-como { margin-bottom:32px; }
.pm-como-titulo { font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#9aabc7; margin-bottom:14px; }
.pm-passo { display:flex; gap:12px; padding:9px 0; align-items:flex-start; }
.pm-passo-n { font-family:var(--font-mono); font-size:12px; font-weight:700; color:#00e5a0; background:rgba(0,229,160,.1); border:1px solid rgba(0,229,160,.2); width:26px; height:26px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pm-passo-t { font-size:13px; color:#c6d1e6; line-height:1.65; padding-top:3px; }

.pm-aviso { font-size:11.5px; color:#9aabc7; line-height:1.7; background:rgba(255,184,48,.04); border:1px solid rgba(255,184,48,.14); border-radius:12px; padding:12px 14px; }

/* Modal */
.pm-overlay { position:fixed; inset:0; background:rgba(5,8,13,.8); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; z-index:500; padding:16px; }
.pm-modal { background:#0f1520; border:1px solid rgba(255,255,255,.1); border-radius:20px; padding:24px; width:100%; max-width:420px; max-height:92vh; overflow-y:auto; }
@media (max-width:480px) { .pm-modal { padding:18px; border-radius:16px; } .pm-modal h3 { font-size:18px; margin-bottom:12px; } .pm-modal-pix .pm-valor strong { font-size:28px; } .pm-qr-wrap img { width:170px; height:170px; } }
.pm-modal h3 { font-family:var(--font-display); font-size:20px; font-weight:800; color:#f0f4ff; margin:0 0 18px; }
.pm-campo { margin-bottom:12px; }
.pm-campo label { display:block; font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#9aabc7; margin-bottom:6px; }
.pm-campo input { width:100%; box-sizing:border-box; background:#090d14; border:1px solid rgba(255,255,255,.1); border-radius:10px; padding:12px 14px; font-size:14px; color:#f0f4ff; outline:none; transition:border-color .15s; }
.pm-campo input:focus { border-color:rgba(0,229,160,.5); }
.pm-erro { font-size:12px; color:#ff4d6d; background:rgba(255,77,109,.08); border:1px solid rgba(255,77,109,.2); border-radius:10px; padding:10px 12px; margin-bottom:12px; }
.pm-alt { text-align:center; font-size:12.5px; color:#9aabc7; margin-top:14px; }
.pm-alt button { background:none; border:none; color:#00e5a0; font-weight:700; cursor:pointer; font-size:12.5px; }
.pm-fechar { position:absolute; top:14px; right:16px; background:none; border:none; color:#9aabc7; font-size:20px; cursor:pointer; }

.pm-modal-pix { text-align:center; padding-top:4px; }
.pm-modal-pix .pm-valor { display:flex; align-items:baseline; justify-content:center; gap:8px; margin-bottom:22px; }
.pm-modal-pix .pm-valor strong { font-family:var(--font-mono); font-size:32px; font-weight:700; color:#f0f4ff; }
.pm-modal-pix .pm-valor span { font-size:12px; color:#9aabc7; letter-spacing:.02em; }
.pm-qr-wrap { display:flex; justify-content:center; margin-bottom:18px; }
.pm-qr-wrap img { width:200px; height:200px; border-radius:14px; background:#fff; padding:10px; box-shadow:0 8px 32px rgba(0,229,160,.08); }
.pm-pix-label { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#9aabc7; margin-bottom:8px; text-align:center; }
.pm-pix-codigo { background:#090d14; border:1px dashed rgba(255,255,255,.15); border-radius:12px; padding:12px 14px; font-family:var(--font-mono); font-size:10px; color:#c6d1e6; word-break:break-all; line-height:1.55; max-height:78px; overflow-y:auto; margin-bottom:10px; text-align:left; }
.pm-copiar { width:100%; padding:13px; border-radius:11px; border:1px solid rgba(0,229,160,.35); background:rgba(0,229,160,.08); color:#00e5a0; font-weight:700; font-size:13px; cursor:pointer; transition:all .15s; display:inline-flex; align-items:center; justify-content:center; gap:8px; }
.pm-copiar:hover { background:rgba(0,229,160,.15); border-color:rgba(0,229,160,.55); }
.pm-aguardando { display:flex; align-items:center; justify-content:center; gap:8px; margin-top:20px; padding:12px; background:rgba(255,184,48,.04); border:1px solid rgba(255,184,48,.14); border-radius:10px; font-size:12px; color:#c6d1e6; }
.pm-aguardando strong { color:#ffb830; font-weight:700; }
.pm-dot { width:7px; height:7px; border-radius:50%; background:#ffb830; animation:pmpulse 1.4s infinite; }
@keyframes pmpulse { 0%,100%{opacity:1} 50%{opacity:.35} }
.pm-sucesso { text-align:center; padding:12px 0; }
.pm-sucesso-icone { font-size:44px; margin-bottom:12px; }
`;

const BENEFICIOS = [
  { icone: '🎯', titulo: 'Sinais com valor real', desc: 'Mercados onde a frequência histórica supera o preço da casa — só quando o valor existe de verdade.' },
  { icone: '📊', titulo: 'Análise transparente', desc: 'Cada sugestão vem com a evidência: quantas vezes o evento aconteceu, em quantos jogos, e o EV calculado.' },
  { icone: '⚔️', titulo: 'Confronto direto e histórico', desc: 'Últimos jogos de cada equipe com goleadores, cartões, faltas e o retrospecto entre elas.' },
  { icone: '🧮', titulo: 'Metodologia aberta', desc: 'Probabilidade justa sem a margem da casa, frequência real com amostra explícita e ponderação estatística.' },
];

const PASSOS = [
  'Crie sua conta em segundos — só nome, e-mail e senha.',
  'Pague R$ 9,99 via PIX. O acesso libera automaticamente na confirmação.',
  'Pronto: análises completas de todos os jogos por 30 dias, renovando quando você quiser.',
];

function ModalAuth({ aberto, aoFechar, aoAutenticar }) {
  const { entrar, registrar } = useAuth();
  const [modo, setModo] = useState('registrar');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!aberto) return null;

  const enviar = async () => {
    setErro(''); setEnviando(true);
    try {
      const u = modo === 'registrar' ? await registrar(nome, email, senha) : await entrar(email, senha);
      aoAutenticar(u);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="pm-overlay" onClick={aoFechar}>
      <div className="pm-modal" style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
        <button className="pm-fechar" onClick={aoFechar}>✕</button>
        <h3>{modo === 'registrar' ? 'Criar conta' : 'Entrar'}</h3>
        {erro && <div className="pm-erro">{erro}</div>}
        {modo === 'registrar' && (
          <div className="pm-campo">
            <label>Nome</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" autoComplete="name" />
          </div>
        )}
        <div className="pm-campo">
          <label>E-mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" autoComplete="email" />
        </div>
        <div className="pm-campo">
          <label>Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
            placeholder={modo === 'registrar' ? 'Mínimo 8 caracteres' : 'Sua senha'}
            autoComplete={modo === 'registrar' ? 'new-password' : 'current-password'}
            onKeyDown={e => e.key === 'Enter' && enviar()} />
        </div>
        <button className="pm-cta" style={{ maxWidth:'100%', marginTop:6 }} disabled={enviando} onClick={enviar}>
          {enviando ? 'Enviando…' : modo === 'registrar' ? 'Criar conta' : 'Entrar'}
        </button>
        <div className="pm-alt">
          {modo === 'registrar'
            ? <>Já tem conta? <button onClick={() => { setModo('entrar'); setErro(''); }}>Entrar</button></>
            : <>Ainda não tem conta? <button onClick={() => { setModo('registrar'); setErro(''); }}>Criar conta</button></>}
        </div>
      </div>
    </div>
  );
}

/* Máscaras: só formata na exibição — envio ainda com dígitos crus */
function mascararCPF(v) {
  const d = (v || '').replace(/\D/g, '').slice(0, 11);
  const p = [];
  if (d.length > 0) p.push(d.slice(0, 3));
  if (d.length > 3) p[p.length - 1] = d.slice(0, 3), p.push(d.slice(3, 6));
  if (d.length > 6) p.push(d.slice(6, 9));
  let out = d.slice(0, 3);
  if (d.length > 3) out += '.' + d.slice(3, 6);
  if (d.length > 6) out += '.' + d.slice(6, 9);
  if (d.length > 9) out += '-' + d.slice(9, 11);
  return out;
}
function mascararTelefone(v) {
  const d = (v || '').replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}
function cpfValido(cpf) {
  const c = (cpf || '').replace(/\D/g, '');
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const dv = pos => {
    let s = 0;
    for (let i = 0; i < pos - 1; i++) s += parseInt(c[i], 10) * (pos - i);
    const r = (s * 10) % 11;
    return (r === 10 ? 0 : r) === parseInt(c[pos - 1], 10);
  };
  return dv(10) && dv(11);
}

function ModalPix({ aberto, aoFechar }) {
  const { setUsuario } = useAuth();
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cobranca, setCobranca] = useState(null);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [pago, setPago] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => () => clearInterval(pollRef.current), []);
  if (!aberto) return null;

  const gerar = async () => {
    setErro('');
    const cpfLimpo = documento.replace(/\D/g, '');
    const telLimpo = telefone.replace(/\D/g, '');
    if (!cpfValido(cpfLimpo)) { setErro('CPF inválido — confira os dígitos.'); return; }
    if (telLimpo.length < 10)  { setErro('Telefone incompleto — inclua DDD e número.'); return; }
    setEnviando(true);
    try {
      const r = await criarAssinaturaPix(cpfLimpo, telLimpo);
      if (!r.ok) throw new Error(r.mensagem || 'Não foi possível gerar o PIX');
      setCobranca(r);
      pollRef.current = setInterval(async () => {
        const st = await consultarPagamento(r.orderUUID);
        if (st?.status === 'pago') {
          clearInterval(pollRef.current);
          setPago(true);
          if (st.usuario) setUsuario(st.usuario);
        }
      }, 5000);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  };

  const copiar = () => {
    navigator.clipboard?.writeText(cobranca.copiaCola || '').then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    });
  };

  return (
    <div className="pm-overlay" onClick={pago ? aoFechar : undefined}>
      <div className="pm-modal" style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
        <button className="pm-fechar" onClick={aoFechar}>✕</button>

        {pago ? (
          <div className="pm-sucesso">
            <div className="pm-sucesso-icone">✅</div>
            <h3 style={{ marginBottom:8 }}>Assinatura ativa!</h3>
            <p style={{ fontSize:13, color:'#c6d1e6', lineHeight:1.7, margin:'0 0 18px' }}>
              Pagamento confirmado. Todas as análises já estão liberadas por 30 dias.
            </p>
            <button className="pm-cta" style={{ maxWidth:'100%' }} onClick={aoFechar}>Ver as análises</button>
          </div>
        ) : !cobranca ? (
          <>
            <h3>Assinar — R$ 9,99 via PIX</h3>
            {erro && <div className="pm-erro">{erro}</div>}
            <div className="pm-campo">
              <label>CPF (exigido pelo pagamento)</label>
              <input value={documento} onChange={e => setDocumento(mascararCPF(e.target.value))} placeholder="000.000.000-00" inputMode="numeric" maxLength={14} autoComplete="off" />
            </div>
            <div className="pm-campo">
              <label>Telefone</label>
              <input value={telefone} onChange={e => setTelefone(mascararTelefone(e.target.value))} placeholder="(11) 99999-9999" inputMode="tel" maxLength={15} autoComplete="tel" />
            </div>
            <button className="pm-cta" style={{ maxWidth:'100%', marginTop:6 }} disabled={enviando} onClick={gerar}>
              {enviando ? 'Gerando PIX…' : 'Gerar PIX de R$ 9,99'}
            </button>
            <div className="pm-alt" style={{ color:'#9aabc7' }}>Sem renovação automática: você paga só quando quiser continuar.</div>
          </>
        ) : (
          <div className="pm-modal-pix">
            <h3 style={{ textAlign:'center', margin:'0 0 6px' }}>Pague com PIX</h3>
            <div className="pm-valor"><strong>R$ 9,99</strong><span>· SinalOdds Premium · 30 dias</span></div>

            {cobranca.qrcode && (
              <>
                <div className="pm-pix-label">Aponte a câmera do banco</div>
                <div className="pm-qr-wrap">
                  <img
                    src={cobranca.qrcode.startsWith('data:') ? cobranca.qrcode : `data:image/png;base64,${cobranca.qrcode}`}
                    alt="QR Code PIX"
                  />
                </div>
              </>
            )}

            {cobranca.copiaCola && (
              <>
                <div className="pm-pix-label">Ou copie e cole</div>
                <div className="pm-pix-codigo">{cobranca.copiaCola}</div>
                <button className="pm-copiar" onClick={copiar}>
                  {copiado
                    ? <>✓ Código copiado</>
                    : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>Copiar código PIX</>}
                </button>
              </>
            )}

            <div className="pm-aguardando">
              <span className="pm-dot" />
              <span><strong>Aguardando pagamento</strong> — libera automaticamente na confirmação</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Premium() {
  const { usuario, assinante } = useAuth();
  const navigate = useNavigate();
  const [modalAuth, setModalAuth] = useState(false);
  const [modalPix, setModalPix] = useState(false);

  const assinar = () => {
    if (assinante) return navigate('/');
    if (!usuario) return setModalAuth(true);
    setModalPix(true);
  };

  return (
    <>
      <style>{S}</style>
      <div className="pm-wrap">
        <span className="pm-badge">SinalOdds Premium</span>
        <h1 className="pm-titulo">
          Pare de apostar no escuro.<br />
          <span>Aposte com evidência.</span>
        </h1>
        <p className="pm-sub">
          Analisamos as odds do mercado contra a frequência real dos eventos — resultados,
          confrontos diretos e desempenho recente das equipes — e mostramos exatamente onde
          existe valor estatístico, com o raciocínio completo, não uma "dica" solta.
        </p>

        <div className="pm-beneficios stagger">
          {BENEFICIOS.map(b => (
            <div className="pm-b" key={b.titulo}>
              <div className="pm-b-icone">{b.icone}</div>
              <div className="pm-b-titulo">{b.titulo}</div>
              <div className="pm-b-desc">{b.desc}</div>
            </div>
          ))}
        </div>

        <div className="pm-preco-card">
          <div className="pm-preco">R$ 9,99<small> /mês</small></div>
          <div className="pm-preco-sub">Pagamento via PIX · acesso imediato · sem renovação automática</div>
          <button className="pm-cta" onClick={assinar}>
            {assinante ? 'Você já é assinante — ver análises' : 'Assinar agora'}
          </button>
        </div>

        <div className="pm-como stagger">
          <div className="pm-como-titulo">Como funciona</div>
          {PASSOS.map((t, i) => (
            <div className="pm-passo" key={i}>
              <div className="pm-passo-n">{i + 1}</div>
              <div className="pm-passo-t">{t}</div>
            </div>
          ))}
        </div>

        <div className="pm-aviso">
          As análises são baseadas em dados históricos e modelos estatísticos — não são garantia
          de resultado. Conteúdo educativo, para maiores de 18 anos. Aposte com responsabilidade.
        </div>
      </div>

      <ModalAuth aberto={modalAuth} aoFechar={() => setModalAuth(false)}
        aoAutenticar={u => { setModalAuth(false); if (!u.assinante) setModalPix(true); }} />
      <ModalPix aberto={modalPix} aoFechar={() => setModalPix(false)} />
    </>
  );
}

export { ModalAuth };
