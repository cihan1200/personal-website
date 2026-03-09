export default function HeroSection({ active }) {
  return (
    <div id="s0" className={`sec${active ? ' on' : ''}`}>
      <p className="h-eye">Full Stack Web Developer · Istanbul, Turkey</p>

      <h1 className="h-name">
        CİHAN
        <span className="stroke">IŞIK</span>
      </h1>

      <p className="h-sub">Building modern, responsive &amp; user-friendly web apps</p>

      <div className="h-scr">
        Scroll to explore
        <div className="h-scr-l" />
      </div>
    </div>
  );
}