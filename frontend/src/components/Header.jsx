import { Globe2, Menu, Search, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandMark from './BrandMark';

const categories = [
  ['/category-icons/all.svg', 'All'],
  ['/category-icons/homes.svg', 'Homes'],
  ['/category-icons/experiences.svg', 'Experiences'],
  ['/category-icons/services.svg', 'Services']
];

export default function Header() {
  const [location, setLocation] = useState('');
  const [when, setWhen] = useState('');
  const [guests, setGuests] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const openCategory = (label) => {
    setActiveCategory(label);
    if (label === 'All') { navigate('/'); return; }
    if (label === 'Homes') { navigate('/locations'); return; }
    const id = label === 'Experiences' ? 'experiences' : 'services';
    navigate(`/#${id}`);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (when) params.set('when', when);
    if (guests) params.set('guests', guests);
    navigate(`/locations?${params.toString()}`);
  };

  return (
    <header className="site-header">
      <div className="header-top">
        <Link className="brand" to="/" aria-label="Airbnb home">
          <BrandMark />
          <span>airbnb</span>
        </Link>

        <nav className="category-nav" aria-label="Browse categories">
          {categories.map(([icon, label]) => (
            <button
              type="button"
              key={label}
              className={activeCategory === label ? 'active' : ''}
              onClick={() => openCategory(label)}
            >
              <img className="category-icon" src={icon} alt="" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="header-actions">
          {!user && <Link to="/login" className="host-link">Become a host</Link>}
          <button className="round-icon-button" aria-label="Language and region"><Globe2 size={19} /></button>
          <div className="profile-wrap">
            <button className="profile-button" onClick={() => setMenuOpen(v => !v)} aria-label="Profile menu">
              <Menu size={18} />
              <UserCircle size={28} />
            </button>
            {menuOpen && (
              <div className="profile-menu">
                {user ? (
                  <>
                    <strong>Hello, {user.username}</strong>
                    <Link to="/reservations" onClick={() => setMenuOpen(false)}>Reservations</Link>
                    <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}>Log out</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <form className="airbnb-search" onSubmit={submit}>
        <label>
          <strong>Where</strong>
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Search destinations" />
        </label>
        <label>
          <strong>When</strong>
          <input type="date" value={when} onChange={e => setWhen(e.target.value)} aria-label="Add dates" />
        </label>
        <label>
          <strong>Who</strong>
          <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
          </select>
        </label>
        <button className="search-button" aria-label="Search"><Search size={20} /></button>
      </form>
    </header>
  );
}
