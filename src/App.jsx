import { useState, useRef, useEffect, useCallback } from 'react';
import Threescene from './components/ThreeScene';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import SideDots from './components/SideDots';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import WorkSection from './components/WorkSection';
import ContactSection from './components/ContactSection';
import ScrollHint from './components/ScrollHint';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [curSec, setCurSec] = useState(0);

  // Refs keep event handlers stable without stale closures
  const curSecRef = useRef(0);
  const transRef = useRef(false);
  const scrollAccRef = useRef(0);
  const wsRef = useRef(null);   // Work-section scroll container

  // go(i) — change the active section
  const go = useCallback((i) => {
    if (i === curSecRef.current || transRef.current) return;
    transRef.current = true;
    curSecRef.current = i;
    setCurSec(i);
    setTimeout(() => { transRef.current = false; }, 700);
  }, []);

  // ── Wheel (section scroll + work-carousel pass-through) ──
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      const sec = curSecRef.current;

      if (sec === 2 && wsRef.current) {
        const ws = wsRef.current;
        const atEnd = ws.scrollLeft >= ws.scrollWidth - ws.clientWidth - 4;
        const atStart = ws.scrollLeft < 4;
        if (e.deltaY > 0 && atEnd) { go(3); return; }
        if (e.deltaY < 0 && atStart) { go(1); return; }
        ws.scrollLeft += e.deltaY * 0.8;
        return;
      }

      scrollAccRef.current += e.deltaY;
      if (scrollAccRef.current > 110 && sec < 3) { go(sec + 1); scrollAccRef.current = 0; }
      else if (scrollAccRef.current < -110 && sec > 0) { go(sec - 1); scrollAccRef.current = 0; }
      if (Math.abs(scrollAccRef.current) > 350) scrollAccRef.current = 0;
    };
    document.addEventListener('wheel', onWheel, { passive: false });
    return () => document.removeEventListener('wheel', onWheel);
  }, [go]);

  // ── Arrow-key navigation ──
  useEffect(() => {
    const onKey = (e) => {
      const sec = curSecRef.current;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { if (sec < 3) go(sec + 1); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { if (sec > 0) go(sec - 1); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go]);

  // ── Touch swipe navigation ──
  useEffect(() => {
    let tc = 0;
    const onTouchStart = (e) => { tc = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      const d = tc - e.changedTouches[0].clientY;
      const sec = curSecRef.current;
      if (Math.abs(d) > 55) {
        if (d > 0 && sec < 3) go(sec + 1);
        else if (d < 0 && sec > 0) go(sec - 1);
      }
    };
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [go]);

  return (
    <>
      {/* 3D canvas — always behind everything */}
      <Threescene curSec={curSec} />

      {/* Custom cursor */}
      <Cursor />

      {/* Loading screen — dismisses itself, then calls onLoaded */}
      <Loader onLoaded={() => setLoaded(true)} />

      {/* Navigation chrome */}
      <Navbar curSec={curSec} go={go} loaded={loaded} />
      <SideDots curSec={curSec} go={go} loaded={loaded} />

      {/* Section counter bottom-left */}
      <div id="sct" className={loaded ? 'vis' : ''}>
        {'0' + (curSec + 1) + ' / 04'}
      </div>

      {/* Page sections */}
      <HeroSection active={curSec === 0} />
      <AboutSection active={curSec === 1} />
      <WorkSection active={curSec === 2} wsRef={wsRef} />
      <ContactSection active={curSec === 3} />

      {/* Scroll indicator */}
      <ScrollHint curSec={curSec} loaded={loaded} />
    </>
  );
}