import { useState, useRef, useEffect } from 'react';

const PROJECTS = [
  {
    num: 'Project_01 · Jan 2026',
    title: 'ECS — Online Clothing Store',
    desc: 'A full-stack e-commerce platform with product reviews, user profile management, and an admin dashboard for editing products, home page images, and viewing statistic reports.',
    tags: ['React', 'Node.js', 'MongoDB', 'CSS'],
    link: 'https://ecs-zeta.vercel.app/',
    linkLabel: 'Live Demo →',
  },
  {
    num: 'More Coming Soon',
    title: 'Next Project',
    desc: 'More projects are in the works. Each one pushing deeper into React architecture, performance optimization, and production-ready full-stack patterns.',
    tags: ['React', 'JavaScript', 'MongoDB'],
    link: 'https://github.com/cihan1200',
    linkLabel: 'GitHub →',
  },
];

// wsRef is forwarded from App so the wheel handler there can read scrollLeft
export default function WorkSection({ active, wsRef }) {
  const [label, setLabel] = useState('01 / 02');
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  // ── Drag-to-scroll ──
  const onMouseDown = (e) => {
    if (!wsRef.current) return;
    drag.current = { active: true, startX: e.pageX, scrollLeft: wsRef.current.scrollLeft };
    wsRef.current.classList.add('gb');
  };

  useEffect(() => {
    const onMouseUp = () => {
      drag.current.active = false;
      wsRef.current?.classList.remove('gb');
    };
    const onMouseMove = (e) => {
      if (!drag.current.active || !wsRef.current) return;
      wsRef.current.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX);
    };
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [wsRef]);

  // ── Scroll position → index label ──
  const onScroll = () => {
    if (!wsRef.current) return;
    const ws = wsRef.current;
    const p = ws.scrollLeft / (ws.scrollWidth - ws.clientWidth || 1);
    const idx = Math.min(Math.round(p) + 1, PROJECTS.length);
    setLabel('0' + idx + ' / 0' + PROJECTS.length);
  };

  // ── Arrow buttons ──
  const shiftW = (dir) => {
    wsRef.current?.scrollBy({ left: dir * 285, behavior: 'smooth' });
  };

  return (
    <div id="s2" className={`sec${active ? ' on' : ''}`}>

      <div className="wh">
        <p className="stag">02 // Selected Work</p>
        <h2 className="sh2" style={{ fontSize: 'clamp(1.3rem,2.8vw,2.2rem)' }}>
          Projects built with <em>craft</em>
        </h2>
      </div>

      <div style={{ width: '100%' }}>
        {/* Scrollable card strip */}
        <div
          className="ws"
          id="ws"
          ref={wsRef}
          onMouseDown={onMouseDown}
          onScroll={onScroll}
        >
          {PROJECTS.map((p) => (
            <div className="pc" key={p.title}>
              <span className="pcn">{p.num}</span>
              <h3 className="pct">{p.title}</h3>
              <p className="pcd">{p.desc}</p>
              <div className="pctg">
                {p.tags.map((t) => <span className="ptg" key={t}>{t}</span>)}
              </div>
              <a href={p.link} target="_blank" rel="noreferrer" className="pca">
                {p.linkLabel}
              </a>
            </div>
          ))}
        </div>

        {/* Navigation arrows + counter */}
        <div className="warr">
          <span className="widx">{label}</span>
          <button className="wa" onClick={() => shiftW(-1)}>←</button>
          <button className="wa" onClick={() => shiftW(1)}>→</button>
        </div>
      </div>

    </div>
  );
}