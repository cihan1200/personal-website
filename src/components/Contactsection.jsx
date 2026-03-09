const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/cihan1200' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/cihan-isik-1490b33a7' },
  { label: '+90 546 936 09 93', href: 'tel:+905469360993' },
];

export default function ContactSection({ active }) {
  return (
    <div id="s3" className={`sec${active ? ' on' : ''}`}>

      <p className="cpre">04 // Let's build something together</p>

      <a href="mailto:cihan1200@outlook.com" className="ceml">
        cihan1200@outlook.com
      </a>

      <div className="csoc">
        {SOCIAL.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" className="csl">
            {label}
          </a>
        ))}
      </div>

    </div>
  );
}