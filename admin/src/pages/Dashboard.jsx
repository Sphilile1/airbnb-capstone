import { Building2, MapPinned, Plus, WalletCards } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, imageUrl } from '../api';

export default function Dashboard() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    return api('/api/accommodations')
      .then(setListings)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const locations = new Set(listings.map(item => item.location)).size;
    const average = listings.length ? Math.round(listings.reduce((sum, item) => sum + Number(item.price || 0), 0) / listings.length) : 0;
    return { locations, average };
  }, [listings]);

  const remove = async id => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api(`/api/accommodations/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="admin-main">
      <div className="page-heading">
        <div><p className="eyebrow">Admin dashboard</p><h1>Property listings</h1><p className="admin-subtitle">Manage stays, pricing, availability details and guest-ready content.</p></div>
        <Link className="primary-link" to="/listings/new"><Plus size={17}/> Create listing</Link>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat"><Building2/><span>Listings</span><strong>{listings.length}</strong></div>
        <div className="admin-stat"><MapPinned/><span>Locations</span><strong>{stats.locations}</strong></div>
        <div className="admin-stat"><WalletCards/><span>Average nightly rate</span><strong>R{stats.average.toLocaleString()}</strong></div>
      </div>

      {error && <p className="error" role="alert">{error}</p>}
      {loading && <div className="empty-state">Loading listings…</div>}
      {!loading && <div className="admin-listings">
        {listings.map(item => (
          <article className="admin-listing-card" key={item._id}>
            <img src={imageUrl(item.images?.[0])} alt={item.title} onError={e => { e.currentTarget.src = '/listing-placeholder.svg'; }}/>
            <div>
              <p className="admin-listing-type">{item.type}</p>
              <h3>{item.title}</h3>
              <p>{item.location} · {item.guests} guests · {item.bedrooms} bedrooms</p>
              <p><strong>R{Number(item.price).toLocaleString()}</strong> / night · ★ {Number(item.rating || 0).toFixed(2)}</p>
            </div>
            <div className="card-actions">
              <Link to={`/listings/${item._id}/edit`}>Update</Link>
              <button onClick={() => remove(item._id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>}

      {!loading && listings.length === 0 && !error && <div className="empty-state">No listings yet. Create your first listing.</div>}
    </main>
  );
}
