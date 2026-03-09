import { useState, useEffect } from 'react';
import photo from "../assests/photo.jpeg";

const STATS = [
  { num: '24', label: 'Years Old' },
  { num: '2+', label: 'Years Dev' },
  { num: 'TR/EN', label: 'Languages' },
];

const SKILLS = [
  { name: 'React / JavaScript', pct: 92 },
  { name: 'HTML / CSS', pct: 95 },
  { name: 'Node.js / MongoDB', pct: 80 },
  { name: 'Git / Deployment', pct: 85 },
];

export default function AboutSection({ active }) {
  const [barsActive, setBarsActive] = useState(false);

  useEffect(() => {
    if (active && !barsActive) {
      const t = setTimeout(() => setBarsActive(true), 400);
      return () => clearTimeout(t);
    }
  }, [active, barsActive]);

  return (
    <div id="s1" className={`sec${active ? ' on' : ''}`}>

      {/* ── Portrait frame ── */}
      <div className="a-pic">
        <img src={photo} alt="Cihan Işık" className="a-pic-img" />
        <div className="a-pic-overlay-dark" />
        <div className="a-pic-overlay-cyan" />
        {/* Corner brackets */}
        <div className="ac tl" /><div className="ac tr" />
        <div className="ac bl" /><div className="ac br" />
      </div>

      {/* ── Text content ── */}
      <div className="a-tx">
        <p className="stag">01 // Who I Am</p>

        <h2 className="sh2">
          Crafting <em>modern</em><br />web experiences
        </h2>

        <p className="abody">
          Confident and detail-oriented Full Stack Web Developer with strong expertise
          in JavaScript, React, HTML, and CSS — focused on building modern, responsive,
          and user-friendly web applications.
        </p>
        <p className="abody">
          Experienced in integrating frontend apps with backend services and working
          with MongoDB for data modeling. Based in Istanbul, Zeytinburnu. Finishing
          my degree at Bartın University (Management Information Systems, Dec 2025).
        </p>

        {/* Stats */}
        <div className="stats">
          {STATS.map(({ num, label }) => (
            <div key={label}>
              <span className="stn">{num}</span>
              <span className="stl">{label}</span>
            </div>
          ))}
        </div>

        {/* Skill bars */}
        <div className="sk-grid">
          {SKILLS.map(({ name, pct }) => (
            <div className="sk-row" key={name}>
              <div className="sk-hd">
                <span className="sk-nm">{name}</span>
                <span className="sk-pc">{pct}%</span>
              </div>
              <div className="sk-tr">
                <div
                  className="sk-fl"
                  style={{ width: barsActive ? `${pct}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}