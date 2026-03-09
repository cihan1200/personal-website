const TOTAL = 4;

export default function SideDots({ curSec, go, loaded }) {
  return (
    <div id="sdots" className={loaded ? 'vis' : ''}>
      {Array.from({ length: TOTAL }).map((_, i) => (
        // Fragment lets us interleave dots and connector lines
        <span key={i}>
          {i > 0 && <div className="sdl" />}
          <div
            className={`sdot${curSec === i ? ' on' : ''}`}
            onClick={() => go(i)}
          />
        </span>
      ))}
    </div>
  );
}