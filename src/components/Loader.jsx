import { useRef, useEffect } from 'react';

export default function Loader({ onLoaded }) {
  const ldrRef = useRef(null);
  const fillRef = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const ldr = ldrRef.current;
    const fill = fillRef.current;
    const num = numRef.current;

    // Kick off the CSS width transition
    const t0 = setTimeout(() => { fill.style.width = '100%'; }, 80);

    // Count the percentage number up
    let val = 0;
    const iv = setInterval(() => {
      val = Math.min(val + Math.random() * 3.5 + 1.5, 100);
      num.textContent = Math.floor(val) + '%';

      if (val >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          ldr.classList.add('out');
          onLoaded();
          setTimeout(() => { ldr.style.display = 'none'; }, 900);
        }, 350);
      }
    }, 22);

    return () => {
      clearTimeout(t0);
      clearInterval(iv);
    };
  }, [onLoaded]);

  return (
    <div id="ldr" ref={ldrRef}>
      <div className="ldr-logo">Cihan Işık</div>
      <div className="ldr-track">
        <div className="ldr-fill" ref={fillRef} />
      </div>
      <div className="ldr-n" ref={numRef}>0%</div>
    </div>
  );
}