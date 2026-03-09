const NAV_ITEMS = ['Home', 'About', 'Work', 'Contact'];

export default function Navbar({ curSec, go, loaded }) {
  return (
    <nav className={loaded ? 'vis' : ''}>
      <div className="nl">CI.DEV</div>
      <div className="np">
        {NAV_ITEMS.map((label, i) => (
          <button
            key={label}
            className={`pill${curSec === i ? ' on' : ''}`}
            onClick={() => go(i)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}