import { Menu, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandMark from './BrandMark';

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="admin-header">
      <Link className="admin-brand" to="/" aria-label="Airbnb admin home">
        <BrandMark />
        <span>airbnb admin</span>
      </Link>
      <nav>
        {user ? (
          <>
            <Link to="/">Listings</Link>
            <Link to="/listings/new">Create listing</Link>
            <span className="admin-greeting">Hello, {user.username}</span>
            <div className="admin-profile">
              <button onClick={() => setOpen(v => !v)} aria-label="Admin profile menu"><Menu size={18}/><UserCircle size={26}/></button>
              {open && (
                <div className="admin-menu">
                  <strong>{user.username}</strong>
                  <span className="admin-menu-email">{user.email}</span>
                  <Link to="/reservations" onClick={() => setOpen(false)}>Reservations</Link>
                  <button onClick={() => { logout(); setOpen(false); navigate('/login'); }}>Log out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <span>Become a host</span>
        )}
      </nav>
    </header>
  );
}
