import { useRef, useEffect } from 'react';

export default function Cursor() {
  const curRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const cur = curRef.current;
    const ring = ringRef.current;

    // ── Cursor position (instant) ──
    const onMove = (e) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';

      // Hover detection via event delegation — no per-element listeners needed
      const isHover = !!e.target.closest('a, button, .pc');
      cur.style.transform = isHover ? 'translate(-50%,-50%) scale(2.4)' : 'translate(-50%,-50%) scale(1)';
      cur.style.background = isHover ? '#ff1166' : 'var(--cyan)';
      ring.style.transform = isHover ? 'translate(-50%,-50%) scale(1.5)' : 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = isHover ? 'rgba(255,17,102,.42)' : 'rgba(0,212,255,.4)';
    };
    document.addEventListener('mousemove', onMove);

    // ── Ring follows with lag (rAF loop) ──
    const lag = () => {
      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.13;
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.13;
      ring.style.left = pos.current.rx + 'px';
      ring.style.top = pos.current.ry + 'px';
      rafRef.current = requestAnimationFrame(lag);
    };
    rafRef.current = requestAnimationFrame(lag);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div id="cur" ref={curRef} />
      <div id="cur-r" ref={ringRef} />
    </>
  );
}