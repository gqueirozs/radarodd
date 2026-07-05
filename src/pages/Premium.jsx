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
.pm-modal { background:#0f1520; border:1px solid rgba(255,255,255,.1); border-radius:20px; padding:28px; width:100%; max-width:420px; max-height:92vh; overflow-y:auto; }
.pm-modal h3 { font-family:var(--font-display); font-size:20px; font-weight:800; color:#f0f4ff; margin:0 0 18px; }
.pm-campo { margin-bottom:12px; }
.pm-campo label { display:block; font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#9aabc7; margin-bottom:6px; }
.pm-campo input { width:100%; box-sizing:border-box; background:#090d14; border:1px solid rgba(255,255,255,.1); border-radius:10px; padding:12px 14px; font-size:14px; color:#f0f4ff; outline:none; transition:border-color .15s; }
.pm-campo input:focus { border-color:rgba(0,229,160,.5); }
.pm-erro { font-size:12px; color:#ff4d6d; background:rgba(255,77,109,.08); border:1px solid rgba(255,77,109,.2); border-radius:10px; padding:10px 12px; margin-bottom:12px; }
.pm-alt { text-align:center; font-size:12.5px; color:#9aabc7; margin-top:14px; }
.pm-alt button { background:none; border:none; color:#00e5a0; font-weight:700; cursor:pointer; font-size:12.5px; }
.pm-fechar { position:absolute; top:14px; right:16px; background:none; border:none; color:#9aabc7; font-size:20px; cursor:pointer; }

.pm-pix-codigo { background:#090d14; border:1px dashed rgba(255,255,255,.15); border-radius:12px; padding:12px; font-family:var(--font-mono); font-size:10.5px; color:#c6d1e6; word-break:break-all; max-height:96px; overflow-y:auto; margin-bottom:12px; }
.pm-copiar { width:100%; padding:12px; border-radius:10px; border:1px solid rgba(0,229,160,.35); background:rgba(0,229,160,.08); color:#00e5a0; font-weight:700; font-size:13px; cursor:pointer; }
.pm-aguardando { display:flex; align-items:center; justify-content:center; gap:8px; margin-top:16px; font-size:12px; color:#9aabc7; }
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
    setErro(''); setEnviando(true);
    try {
      const r = await criarAssinaturaPix(documento, telefone);
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
              <input value={documento} onChange={e => setDocumento(e.target.value)} placeholder="000.000.000-00" inputMode="numeric" />
            </div>
            <div className="pm-campo">
              <label>Telefone</label>
              <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 99999-9999" inputMode="tel" />
            </div>
            <button className="pm-cta" style={{ maxWidth:'100%', marginTop:6 }} disabled={enviando} onClick={gerar}>
              {enviando ? 'Gerando PIX…' : 'Gerar PIX de R$ 9,99'}
            </button>
            <div className="pm-alt" style={{ color:'#9aabc7' }}>Sem renovação automática: você paga só quando quiser continuar.</div>
          </>
        ) : (
          <>
            <h3>Pague com PIX</h3>
            {cobranca.qrcode && (
              <div style={{ textAlign:'center', marginBottom:14 }}>
                <img
                  src={cobranca.qrcode.startsWith('data:') ? cobranca.qrcode : `data:image/png;base64,${cobranca.qrcode}`}
                  alt="QR Code PIX"
                  style={{ width:190, height:190, borderRadius:12, background:'#fff', padding:8 }}
                />
              </div>
            )}
            {cobranca.copiaCola && (
              <>
                <div className="pm-pix-codigo">{cobranca.copiaCola}</div>
                <button className="pm-copiar" onClick={copiar}>{copiado ? '✓ Copiado!' : 'Copiar código PIX'}</button>
              </>
            )}
            <div className="pm-aguardando">
              <span className="pm-dot" /> Aguardando confirmação — libera na hora após o pagamento
            </div>
          </>
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

        <div className="pm-beneficios">
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

        <div className="pm-como">
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
