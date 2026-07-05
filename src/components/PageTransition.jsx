import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/* Wrapper que anima entrada de página (fade + slide-up sutil).
 * Re-anima ao trocar de rota. */
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.classList.remove('page-enter');
    // trigger reflow pra reiniciar a animação
    void ref.current.offsetWidth;
    ref.current.classList.add('page-enter');
  }, [pathname]);
  return <div ref={ref} className="page-enter">{children}</div>;
}
