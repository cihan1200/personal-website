export default function ScrollHint({ curSec, loaded }) {
  const visible = loaded && curSec === 0;

  return (
    <div id="sh" className={visible ? 'vis' : ''}>
      <span>Scroll</span>
      <div className="shl" />
    </div>
  );
}