import { Facebook, Globe2, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const groups = [
    ['Support', 'Help Centre', 'AirCover', 'Cancellation options', 'Safety information'],
    ['Community', 'Airbnb.org', 'Combating discrimination', 'Accessibility'],
    ['Hosting', 'Airbnb your home', 'AirCover for Hosts', 'Hosting resources'],
    ['Airbnb', 'Newsroom', 'Learn about new features', 'Careers', 'Investors']
  ];

  return (
    <footer className="footer">
      <div className="footer-grid">
        {groups.map(([title, ...items]) => (
          <div key={title}>
            <h4>{title}</h4>
            {items.map(item => <a href="#" key={item}>{item}</a>)}
          </div>
        ))}
      </div>
      <div className="copyright">
        <span>© 2026 Airbnb Clone · Privacy · Terms · Sitemap</span>
        <div className="footer-controls">
          <button><Globe2 size={17}/> English (ZA)</button>
          <button>R ZAR</button>
          <a href="#" aria-label="Facebook"><Facebook size={18}/></a>
          <a href="#" aria-label="Twitter"><Twitter size={18}/></a>
          <a href="#" aria-label="Instagram"><Instagram size={18}/></a>
        </div>
      </div>
    </footer>
  );
}
